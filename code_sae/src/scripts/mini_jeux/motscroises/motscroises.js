import goodAnswerSound from "./../../../assets/sons/appSound/goodAnswer.mp3";
import badAnswerSound from "./../../../assets/sons/appSound/wrongAnswer.mp3";

import ennonceSound from "./../../../assets/sons/descriptionMJetA/description_minijeux/voix_minijeux_MotsCroises.mp3";
import { Consignes } from "./../../consignes/consignes.js";

/**
 * Fonction associée au jeu "Mots Croisés"
 *
 * @export
 * @param {*} modalBody
 */
export function jeuMotsCroises(modalBody) {
  class CrosswordGame {
    constructor(container) {
      this.container = container;
      this.currentDifficulty = 1; 
      this.currentPopup = null; 
      this.wordBank = []; 
      this.selectedWords = [];
      this.wordStatus = []; 
      this.errorCount = 0;
      this.maxErrors = 3; 
      this.init();
    }

    async init() {
      await this.loadWordBank();
      new Consignes(this.container, ennonceSound); 
      this.createGameContent(); 
      this.generateNewCrossword(); 
    }

    


    async loadWordBank() {
      const response = await fetch("https://test-sae.onrender.com/api/mot");
      const words = await response.json();

      this.wordBank = words.map((word) => ({
        word: word.mot.toUpperCase(), 
        clue: word.categorie,
      }));

    }

    createGameContent() {
      const gameContent = document.createElement("div");
      gameContent.className = "game-content";

      const listAndCounterContainer = document.createElement("div");
      listAndCounterContainer.className = "list-counter-container";

      this.wordListContainer = document.createElement("div");
      this.wordListContainer.className = "word-list";

      const errorContainer = document.createElement("div");
      errorContainer.id = "error-counter";
      errorContainer.className = "error-container";
  
      for (let i = 0; i < this.maxErrors; i++) {
          const errorIcon = document.createElement("img");
          errorIcon.src = require("../../../assets/icons/faux.png");
          errorIcon.className = "error-icon inactive"; 
          errorContainer.appendChild(errorIcon);
      }

      listAndCounterContainer.appendChild(this.wordListContainer);
      listAndCounterContainer.appendChild(errorContainer);
  
      this.crosswordContainer = document.createElement("div");
      this.crosswordContainer.id = "crossword-container";
      this.crosswordContainer.className = "game-area";
  
      const gameHeader = document.createElement("div");
      gameHeader.className = "game-header";
  
      const title = document.createElement("h2");
      title.textContent = "Mots Croisés";
  
      const gameInfo = document.createElement("div");
      gameInfo.className = "game-info";
  
      const levelSelect = this.createDifficultySelector();
      levelSelect.addEventListener("change", (event) => {
          this.currentDifficulty = parseInt(event.target.value, 10);
          this.generateNewCrossword();
      });
  
      const regenerateButton = document.createElement("button");
      regenerateButton.textContent = "Recharger la Grille";
      regenerateButton.addEventListener("click", () => this.generateNewCrossword());
  
      gameInfo.appendChild(levelSelect);
      gameInfo.appendChild(regenerateButton);
      gameHeader.appendChild(title);
      gameHeader.appendChild(gameInfo);
  
      gameContent.appendChild(gameHeader);
      gameContent.appendChild(listAndCounterContainer);
      gameContent.appendChild(this.crosswordContainer);
      
      this.container.appendChild(gameContent);
  }
  
  

    createDifficultySelector() {
      const select = document.createElement("select");
      for (let i = 1; i <= 5; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = `Niveau ${i}`;
        select.appendChild(option);
      }
      select.value = this.currentDifficulty; 
      return select;
    }

    getWordsByDifficulty() {
      const levelConfig = {
        1: { minLength: 3, maxLength: 5, minCount: 3, maxCount: 5 },
        2: { minLength: 4, maxLength: 6, minCount: 5, maxCount: 6 },
        3: { minLength: 5, maxLength: 7, minCount: 7, maxCount: 8 },
        4: { minLength: 6, maxLength: 8, minCount: 9, maxCount: 10 },
        5: { minLength: 7, maxLength: 10, minCount: 11, maxCount: 15 },
      };

      const { minLength, maxLength, minCount, maxCount } = levelConfig[this.currentDifficulty];
      const filteredWords = this.wordBank.filter(
        (word) => word.word.length >= minLength && word.word.length <= maxLength
      );

      const numWords = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
      return filteredWords.sort(() => 0.5 - Math.random()).slice(0, numWords);
    }

    generateNewCrossword() {
      const wordsToPlace = this.getWordsByDifficulty();
      this.selectedWords = []; 
      this.wordStatus = []; 

      const crossword = this.generateCrossword(wordsToPlace);
      const crosswordWithHiddenLetters = this.hideLetters(crossword, this.currentDifficulty);

      this.displayCrossword(crosswordWithHiddenLetters);
      this.initializeWordStatus(crosswordWithHiddenLetters); 
      this.displayWordList(); 
      this.addCellClickEvent(); 
    }

    generateCrossword(words) {
      const gridSize = 15;
      const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));

      const placeWord = (grid, word, row, col, direction) => {
        if (direction === "across") {
          for (let i = 0; i < word.word.length; i++) {
            grid[row][col + i] = word.word[i];
          }
        } else {
          for (let i = 0; i < word.word.length; i++) {
            grid[row + i][col] = word.word[i];
          }
        }
        this.selectedWords.push({
          ...word,
          startRow: row,
          startCol: col,
          isHorizontal: direction === "across"
        });
      };

      const canPlaceWord = (grid, word, row, col, direction) => {
        const size = grid.length;
        let hasIntersection = false;

        if (direction === "across") {
          if (col + word.word.length > size) return false;

          for (let i = 0; i < word.word.length; i++) {
            const currentCell = grid[row][col + i];
            if (currentCell !== null && currentCell !== word.word[i]) return false;
            if (currentCell === word.word[i]) hasIntersection = true;
          }

          if (col > 0 && grid[row][col - 1] !== null) return false;
          if (col + word.word.length < size && grid[row][col + word.word.length] !== null) return false;
          if (
            (row > 0 && (grid[row - 1][col] !== null || grid[row - 1][col + word.word.length - 1] !== null)) ||
            (row + 1 < size && (grid[row + 1][col] !== null || grid[row + 1][col + word.word.length - 1] !== null))
          ) {
            return false;
          }

          return hasIntersection;
        } else {
          if (row + word.word.length > size) return false;

          for (let i = 0; i < word.word.length; i++) {
            const currentCell = grid[row + i][col];
            if (currentCell !== null && currentCell !== word.word[i]) return false;
            if (currentCell === word.word[i]) hasIntersection = true;
          }

          if (row > 0 && grid[row - 1][col] !== null) return false;
          if (row + word.word.length < size && grid[row + word.word.length][col] !== null) return false;
          if (
            (col > 0 && (grid[row][col - 1] !== null || grid[row + word.word.length - 1][col - 1] !== null)) ||
            (col + 1 < size && (grid[row][col + 1] !== null || grid[row + word.word.length - 1][col + 1] !== null))
          ) {
            return false;
          }

          return hasIntersection;
        }
      };

      const placeWords = (words) => {
        words.sort((a, b) => b.word.length - a.word.length);
        placeWord(grid, words[0], Math.floor(gridSize / 2), Math.floor((gridSize - words[0].word.length) / 2), "across");

        for (let i = 1; i < words.length; i++) {
          const currentWord = words[i];
          let placed = false;

          for (let row = 0; row < gridSize && !placed; row++) {
            for (let col = 0; col < gridSize && !placed; col++) {
              if (grid[row][col] !== null) {
                const existingChar = grid[row][col];

                if (currentWord.word.includes(existingChar)) {
                  const intersectionRow = row - currentWord.word.indexOf(existingChar);
                  if (intersectionRow >= 0 && canPlaceWord(grid, currentWord, intersectionRow, col, "down")) {
                    placeWord(grid, currentWord, intersectionRow, col, "down");
                    placed = true;
                  }

                  const intersectionCol = col - currentWord.word.indexOf(existingChar);
                  if (!placed && intersectionCol >= 0 && canPlaceWord(grid, currentWord, row, intersectionCol, "across")) {
                    placeWord(grid, currentWord, row, intersectionCol, "across");
                    placed = true;
                  }
                }
              }
            }
          }

          if (!placed) {
            console.warn(`Impossible de placer le mot: ${currentWord.word}`);
          }
        }
      };

      placeWords(words);
      return grid;
    }

    hideLetters(grid, difficulty) {
      const hidePercentage = {
        1: { min: 1, max: 2 },
        2: { min: 1, max: 3 },
        3: { min: 2, max: 4 },
        4: { min: 3, max: 5 },
        5: { min: 4, max: 6 },
      };

      const newGrid = grid.map((row) => row.slice());

      this.selectedWords.forEach((word) => {
        const wordLength = word.word.length;
        let minHoles = hidePercentage[difficulty].min;
        let maxHoles = Math.min(hidePercentage[difficulty].max, wordLength - 1); 

        const numHoles = Math.floor(Math.random() * (maxHoles - minHoles + 1)) + minHoles;

        const indices = new Set();
        while (indices.size < numHoles) {
          indices.add(Math.floor(Math.random() * wordLength));
        }

        for (let i = 0; i < wordLength; i++) {
          if (indices.has(i)) {
            const rowIndex = word.startRow + (word.isHorizontal ? 0 : i);
            const colIndex = word.startCol + (word.isHorizontal ? i : 0);
            newGrid[rowIndex][colIndex] = { letter: newGrid[rowIndex][colIndex], hidden: true };
          }
        }
      });

      for (let row = 0; row < newGrid.length; row++) {
        for (let col = 0; col < newGrid[row].length; col++) {
          if (newGrid[row][col] !== null && !newGrid[row][col].hidden) {
            newGrid[row][col] = { letter: newGrid[row][col], hidden: false };
          }
        }
      }

      return newGrid;
    }

    initializeWordStatus(crossword) {
      this.wordStatus = this.selectedWords.map((word) => {
        return Array.from(word.word).map((letter, index) => {
          const isHorizontal = word.isHorizontal;
          const row = word.startRow + (isHorizontal ? 0 : index);
          const col = word.startCol + (isHorizontal ? index : 0);

          const cell = crossword[row][col]; 

          return cell && !cell.hidden ? cell.letter : '_'; 
        });
      });
    }

    displayCrossword(grid) {
      const container = this.crosswordContainer;
      container.innerHTML = "";
  
      const table = document.createElement("table");
      grid.forEach((row) => {
          const tableRow = document.createElement("tr");
          row.forEach((cell) => {
              const tableCell = document.createElement("td");
  
              if (cell) {
                  if (cell.hidden) {
                      tableCell.classList.add("filled");
                  } else {
                      tableCell.textContent = cell.letter;
                      tableCell.classList.add("filled");
                  }
              } else {
                  tableCell.classList.add("empty"); 
              }
  
              tableRow.appendChild(tableCell);
          });
          table.appendChild(tableRow);
      });
  
      container.appendChild(table);
    }

    displayWordList() {
      this.wordListContainer.innerHTML = "";
      this.selectedWords.forEach((word, index) => {
        const wordItem = document.createElement("div");
        wordItem.className = "word-item";
        wordItem.style.display = "flex"; 
        wordItem.style.alignItems = "center"; 

        const displayedWord = this.wordStatus[index].join(' '); 

        const wordElement = document.createElement("span");
        wordElement.textContent = `${displayedWord}`; 
        wordElement.style.marginRight = "10px"; 

        const helpIcon = document.createElement("span");
        helpIcon.textContent = "🔍"; 
        helpIcon.className = "help-icon";  
        helpIcon.style.cursor = "pointer";

        const imageContainer = document.createElement("div");
        imageContainer.style.display = "none";
        helpIcon.addEventListener("mouseenter", () => {
          this.showWordImage(word.word.toLowerCase(), imageContainer);
          helpIcon.classList.add("hidden"); 
        });
        helpIcon.addEventListener("mouseleave", () => {
          this.hideImage(imageContainer);
          helpIcon.classList.remove("hidden");
        });

        wordItem.appendChild(wordElement); 
        wordItem.appendChild(imageContainer); 
        wordItem.appendChild(helpIcon);
        this.wordListContainer.appendChild(wordItem);
      });
    }

    showWordImage(word, container) {
      try {
        const imageSrc = require(`./assets/images/${word}.png`);

        const imageElement = document.createElement("img");
        imageElement.src = imageSrc;
        imageElement.className = "word-image"; 
        imageElement.style.width = "150px"; 
        imageElement.style.height = "150px";
        imageElement.style.borderRadius = "10px"; 
        container.innerHTML = ""; 
        container.appendChild(imageElement);
        container.style.display = "flex"; 
      } catch (error) {
        console.error(`Erreur lors du chargement de l'image pour le mot "${word}": ${error.message}`);
        const errorMessage = document.createElement("span");
        errorMessage.textContent = "Image non disponible"; 
        container.innerHTML = ""; 
        container.appendChild(errorMessage);
        container.style.display = "flex"; 
      }
    }

    hideImage(container) {
      container.innerHTML = ""; 
      container.style.display = "none"; 
    }

    addCellClickEvent() {
      const cells = this.crosswordContainer.querySelectorAll("td");
      cells.forEach((cell, index) => {
          cell.addEventListener("click", () => {
              if (cell.classList.contains("empty") || cell.textContent) {
                  return; 
              }
              const row = Math.floor(index / 15);
              const col = index % 15;
              this.createInputPopup(row, col);
          });
      });
    }

    createInputPopup(row, col) {
      if (this.currentPopup) {
        this.closePopup();
      }

      const popup = document.createElement("div");
      popup.setAttribute("id", "input-popup");
      popup.classList.add("popup");
      document.body.appendChild(popup);
      this.currentPopup = popup;

      const popupContent = document.createElement("div");
      popupContent.className = "popup-content";

      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = 1;
      input.placeholder = "Entrez une lettre";

      const validateButton = document.createElement("button");
      validateButton.textContent = "Valider";

      const cancelButton = document.createElement("button");
      cancelButton.textContent = "Annuler";

      validateButton.addEventListener("click", () => {
        const letter = input.value.trim().toUpperCase();

        if (!letter) {
          alert("Veuillez entrer une lettre !");
        } else if (letter.length > 1 || !/^[A-Z]$/.test(letter)) {
          alert("Veuillez saisir une seule lettre !");
        } else {
          const cells = this.crosswordContainer.querySelectorAll("td");
          const targetCell = cells[row * 15 + col];

          const wordIndex = this.selectedWords.findIndex((word) => {
            return this.getGridIndexForWord(word, row, col) !== -1;
          });

          if (wordIndex !== -1) {
            const gridIndex = this.getGridIndexForWord(this.selectedWords[wordIndex], row, col);
            const correctLetter = this.selectedWords[wordIndex].word[gridIndex];

            if (letter === correctLetter) {
              const goodAnswer = new Audio(goodAnswerSound);
              goodAnswer.play();
              
              targetCell.textContent = letter;
              targetCell.classList.add("filled");
              this.updateDisplayedWord(letter, row, col);
              this.closePopup();
              this.checkIfGridIsComplete();
            } else {
              const wrongAnswer = new Audio(badAnswerSound);
              wrongAnswer.play();
              this.handleIncorrectLetter(); 
            }
          }
        }
      });

      cancelButton.addEventListener("click", this.closePopup.bind(this));

      popupContent.appendChild(input);
      popupContent.appendChild(validateButton);
      popupContent.appendChild(cancelButton);
      popup.appendChild(popupContent);
    }

    updateDisplayedWord(letter, row, col) {
      this.selectedWords.forEach((word, index) => {
          const gridIndex = this.getGridIndexForWord(word, row, col);
          if (gridIndex !== -1) {
              this.wordStatus[index][gridIndex] = letter; 
          }
      });
  
      this.displayWordList(); 
      this.checkIfGridIsComplete(); 
    }
    
    updateErrorCounter() {
      const errorIcons = document.querySelectorAll("#error-counter .error-icon");
      errorIcons.forEach((icon, index) => {
          if (index < this.errorCount) {
              icon.classList.remove("inactive");
          } else {
              icon.classList.add("inactive");
          }
      });
    }
  

    closePopup() {
      if (this.currentPopup) {
        document.body.removeChild(this.currentPopup);
        this.currentPopup = null;
      }
    }

    checkIfGridIsComplete() {
      const allWordsComplete = this.wordStatus.every((word) =>
          word.every((letter) => letter !== '_')
      );
  
      if (allWordsComplete) {
          this.showCongratulationsPopup();
      }
    }

    handleIncorrectLetter() {
      this.errorCount++; 
      this.updateErrorCounter();
      this.showErrorPopup(); 

      if (this.errorCount >= this.maxErrors) {
        this.showGameOverPopup();
      }
    }

    showErrorPopup() {
      if (this.currentPopup) {
        this.closePopup();
      }

      const popup = document.createElement("div");
      popup.setAttribute("id", "error-popup");
      popup.classList.add("popup");

      const popupContent = document.createElement("div");
      popupContent.className = "popup-content";

      const message = document.createElement("h2");
      message.textContent = "Erreur, ce n'est pas la bonne lettre !";

      const errorImage = document.createElement("img");
      errorImage.src = require("../../../assets/icons/faux.png"); 
      errorImage.style.width = "50px";

      const closeButton = document.createElement("span");
      closeButton.textContent = "✖";
      closeButton.classList.add("close-button");
      closeButton.addEventListener("click", () => this.closePopup());

      popupContent.appendChild(closeButton);
      popupContent.appendChild(errorImage);
      popupContent.appendChild(message);
      popup.appendChild(popupContent);

      document.body.appendChild(popup);

      popup.addEventListener("click", (e) => {
        if (e.target === popup) {
          this.closePopup();
        }
      });

      this.currentPopup = popup;
    }

    showGameOverPopup() {
      if (this.currentPopup) {
        this.closePopup();
      }

      const popup = document.createElement("div");
      popup.setAttribute("id", "game-over-popup");
      popup.classList.add("popup");

      const popupContent = document.createElement("div");
      popupContent.className = "popup-content";

      const message = document.createElement("h2");
      message.textContent = "Dommage, vous avez utilisé tous vos essais ! Retentez votre chance.";

      const replayButton = document.createElement("button");
      replayButton.textContent = "Rejouer";
      replayButton.className = "replay-button";
      replayButton.addEventListener("click", () => {
        this.generateNewCrossword();
        this.closePopup();
      });

      popupContent.appendChild(message);
      popupContent.appendChild(replayButton);
      popup.appendChild(popupContent);

      document.body.appendChild(popup);

      popup.addEventListener("click", (e) => {
        if (e.target === popup) {
          this.closePopup();
        }
      });

      this.currentPopup = popup;
    }

    showCongratulationsPopup() {
      if (this.currentPopup) {
        this.closePopup();
      }

      const popup = document.createElement("div");
      popup.setAttribute("id", "congratulations-popup");
      popup.classList.add("popup");

      const popupContent = document.createElement("div");
      popupContent.className = "popup-content";

      const message = document.createElement("h2");
      message.textContent = "Félicitations, vous avez rempli la grille !";

      const closeButton = document.createElement("span");
      closeButton.textContent = "✖";
      closeButton.classList.add("close-button");
      closeButton.addEventListener("click", () => this.closePopup());

      const replayButton = document.createElement("button");
      replayButton.textContent = "Rejouer";
      replayButton.className = "replay-button"; 
      replayButton.addEventListener("click", () => {
        this.generateNewCrossword(); 
        this.closePopup(); 
      });

      popupContent.appendChild(closeButton);
      popupContent.appendChild(message);
      popupContent.appendChild(replayButton);
      popup.appendChild(popupContent);

      document.body.appendChild(popup);

      popup.addEventListener("click", (e) => {
        if (e.target === popup) {
          this.closePopup();
        }
      });

      this.currentPopup = popup;
    }

    getGridIndexForWord(word, row, col) {
      const isHorizontal = word.isHorizontal;

      if (isHorizontal) {
        if (row === word.startRow && col >= word.startCol && col < word.startCol + word.word.length) {
          return col - word.startCol; 
        }
      } else {
        if (col === word.startCol && row >= word.startRow && row < word.startRow + word.word.length) {
          return row - word.startRow;
        }
      }

      return -1; 
    }
  }
  new CrosswordGame(modalBody);
}