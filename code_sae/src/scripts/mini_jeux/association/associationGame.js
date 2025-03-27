import successSound from "./assets/sons/appSound/goodAnswer.mp3";
import failSound from "./assets/sons/appSound/wrongAnswer.mp3";

import ennonceSound from "./assets/sons/descriptionMJetA/description_minijeux/voix_minijeux_UnMotUneImage.mp3";
import { Consignes } from "./../../consignes/consignes.js";

/**
 * Fonction associé au Mini-Jeu "1 Mot 1 Image"
 *
 * @export
 * @param {*} modalBody
 */
export async function jeuAssociation(modalBody) {
  class AssociationGame {
    constructor(container) {
      this.container = container;
      this.currentLevel = 1;
      this.currentDifficulty = 1;
      this.score = 0;
      this.words = [];
      this.currentWords = [];
      this.touchData = null;
      this.init();
    }

    normalizeString(str) {
      return str
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase();
    }

    /**
     * Méthode qui permet de chercher les mots dans la base de données
     *
     * @async
     * @returns {unknown}
     */
    async loadWordBank() {
      try {
        const response = await fetch("https://test-sae.onrender.com/api/mot");
        if (!response.ok)
          throw new Error("Erreur lors du chargement des mots.");
        const data = await response.json();

        return data.map((wordObj) => {
          const normalizedWord = this.normalizeString(wordObj.mot);
          return {
            word: wordObj.mot,
            image: `./assets/images/${normalizedWord}.png`,
            originalImage: wordObj.image,
          };
        });
      } catch (error) {
        console.error("Erreur :", error);
        const errorMessage = document.createElement("div");
        errorMessage.textContent =
          "Impossible de charger les mots. Veuillez réessayer.";
        errorMessage.style.color = "red";
        errorMessage.style.textAlign = "center";
        modalBody.appendChild(errorMessage);
        return [];
      }
    }

    /**
     * Méthode qui initialise le jeu
     *
     * @async
     * @returns {*}
     */
    async init() {
      this.words = await this.loadWordBank();
      if (this.words.length === 0) {
        console.error("Aucun mot n'a pu être chargé");
        return;
      }
      new Consignes(this.container, ennonceSound);
      this.createGameContent();
      this.createDifficultyMenu();
      this.startNewLevel();
    }

    /** Fonction qui charge le contenu du jeu */
    createGameContent() {
      const gameContent = document.createElement("div");
      gameContent.className = "game-content";

      const gameHeader = document.createElement("div");
      gameHeader.className = "game-header";

      const title = document.createElement("h2");
      title.textContent = "1 Mot 1 Image";

      const gameInfo = document.createElement("div");
      gameInfo.className = "game-info";

      const levelSpan = document.createElement("span");
      levelSpan.textContent = `Niveau: ${this.currentLevel}`;

      const scoreSpan = document.createElement("span");
      scoreSpan.textContent = `Score: ${this.score}`;

      gameInfo.appendChild(levelSpan);
      gameInfo.appendChild(scoreSpan);

      const gameArea = document.createElement("div");
      gameArea.className = "game-area";

      const wordsContainer = document.createElement("div");
      wordsContainer.className = "words-container";

      const imagesContainer = document.createElement("div");
      imagesContainer.className = "images-container";

      gameHeader.appendChild(title);
      gameHeader.appendChild(gameInfo);

      gameArea.appendChild(wordsContainer);
      gameArea.appendChild(imagesContainer);

      gameContent.appendChild(gameHeader);
      gameContent.appendChild(gameArea);

      this.container.appendChild(gameContent);
    }

    createDifficultyMenu() {
      const menu = document.createElement("select");
      menu.className = "difficulty-menu";

      const levels = ["Facile", "Moyen", "Difficile"];
      levels.forEach((level, index) => {
        const option = document.createElement("option");
        option.value = index + 1;
        option.textContent = level;
        menu.appendChild(option);
      });

      menu.addEventListener("change", (e) => {
        this.currentDifficulty = parseInt(e.target.value, 10);
        this.startNewLevel();
      });

      this.container.querySelector(".game-header").appendChild(menu);
    }

    /**
     * Fonction qui récupère des mots aux hasard dans une fourchette définie
     *
     * @param {*} count
     * @returns {*}
     */
    getRandomWords(count) {
      const shuffled = [...this.words].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    }

    /** Fonction qui crée les éléments du jeu */
    createGameElements() {
      const wordsContainer = this.container.querySelector(".words-container");
      const imagesContainer = this.container.querySelector(".images-container");

      wordsContainer.innerHTML = "";
      imagesContainer.innerHTML = "";

      const shuffledWords = [...this.currentWords].sort(
        () => 0.5 - Math.random()
      );

      this.currentWords.forEach((item) => {
        const wordElement = document.createElement("div");
        wordElement.className = "word-card";
        wordElement.textContent = item.word;
        wordElement.setAttribute("draggable", true);
        wordElement.dataset.word = item.word;
        wordsContainer.appendChild(wordElement);
      });

      shuffledWords.forEach((item) => {
        const imageContainer = document.createElement("div");
        imageContainer.className = "image-container";

        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.word;

        img.onerror = () => {
          console.warn(`Impossible de charger l'image ${item.image}`);
        };

        const dropZone = document.createElement("div");
        dropZone.className = "drop-zone";
        dropZone.dataset.word = item.word;

        imageContainer.appendChild(img);
        imageContainer.appendChild(dropZone);
        imagesContainer.appendChild(imageContainer);
      });
    }

    /** Fonction qui gère le Drag & Drop */
    initializeDragAndDrop() {
      const wordCards = this.container.querySelectorAll(".word-card");
      const dropZones = this.container.querySelectorAll(".drop-zone");

      wordCards.forEach((card) => {
        card.addEventListener("dragstart", (e) => {
          e.dataTransfer.setData("text/plain", card.dataset.word);
          card.classList.add("dragging");
        });

        card.addEventListener("dragend", () => {
          card.classList.remove("dragging");
        });
      });

      dropZones.forEach((zone) => {
        zone.addEventListener("dragover", (e) => {
          e.preventDefault();
          zone.classList.add("drag-over");
        });

        zone.addEventListener("dragleave", () => {
          zone.classList.remove("drag-over");
        });

        zone.addEventListener("drop", (e) => {
          e.preventDefault();
          zone.classList.remove("drag-over");
          const word = e.dataTransfer.getData("text/plain");
          const correctWord = zone.dataset.word;

          if (word === correctWord) {
            this.handleCorrectMatch(word, zone);
          } else {
            const wrongAudio = new Audio(failSound);
            wrongAudio.play();
            this.handleIncorrectMatch(zone);
          }
        });
      });
    }

    /**
     * Fonction qui vérifie si l'image et le mot choisi est le bon
     *
     * @param {*} word
     * @param {*} zone
     */
    async handleCorrectMatch(word, zone) {
      const wordElement = this.container.querySelector(`[data-word="${word}"]`);
      zone.appendChild(wordElement);
      wordElement.setAttribute("draggable", false);
      zone.classList.add("correct");
      this.score += 10;
      this.updateScore();

      const allMatched = Array.from(
        this.container.querySelectorAll(".drop-zone")
      ).every((zone) => zone.children.length > 0);

      if (allMatched) {
        const goodAudio = new Audio(successSound);
        goodAudio.play();

        const scoreBase = 100 * this.currentDifficulty;
        const scoreTotal = scoreBase + this.score;

        const enfantConnecte = JSON.parse(
          sessionStorage.getItem("enfantConnecte")
        );
        if (enfantConnecte) {
          await stockerExercice(enfantConnecte.id, 21, scoreTotal);
        }

        this.currentLevel++;
        setTimeout(() => {
          this.startNewLevel();
        }, 1000);

        async function recupererDernierExerciceFait(id_enfant, id_exercice) {
          const reponse = await fetch("https://test-sae.onrender.com/api/realiser");
          const exercicesRealiser = await reponse.json();
          const tabExosRealiser = exercicesRealiser.filter(
            (exerciceRealiser) =>
              exerciceRealiser.id_enfant === id_enfant &&
              exerciceRealiser.id_exercice === id_exercice
          );
          return tabExosRealiser.length;
        }

        async function stockerExercice(id_enfant, id_exercice, score) {
          try {
            const nb_tentative = await recupererDernierExerciceFait(
              id_enfant,
              id_exercice
            );

            const response = await fetch(
              "https://test-sae.onrender.com/api/realiser/create",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id_enfant,
                  id_exercice,
                  nb_tentative,
                  score,
                }),
              }
            );

            if (!response.ok) {
              throw new Error(`Erreur HTTP : ${response.status}`);
            }

            const data = await response.json();

            if (data.success)
              console.log("Le résultat de l'exercice a bien été sauvegardé.");
            else console.log("Erreur lors du stockage de l'exercice.");
          } catch (error) {
            console.error("Erreur lors du stockage de l'exercice :", error);
            alert("Une erreur est survenue : " + error.message);
          }
        }
        setTimeout(() => {
          this.startNewLevel();
        }, 1000);
      }
    }

    /**
     * Fonction qui vérifie si l'image et le mot choisi n'est pas le bon
     *
     * @param {*} zone
     */
    handleIncorrectMatch(zone) {
      zone.classList.add("incorrect");
      setTimeout(() => {
        zone.classList.remove("incorrect");
      }, 1000);
    }

    /** Fonction pour ajouter des points au score */
    updateScore() {
      const scoreElement = this.container.querySelector(
        ".game-info span:last-child"
      );
      scoreElement.textContent = `Score: ${this.score}`;
    }

    /** Fonction pour lancer le niveau suivant */
    startNewLevel() {
      const wordsPerLevel = {
        1: 3,
        2: 4,
        3: 5,
      };

      const count = wordsPerLevel[this.currentDifficulty] || 3;
      this.currentWords = this.getRandomWords(count);
      this.createGameElements();
      this.initializeDragAndDrop();
    }
  }

  new AssociationGame(modalBody);
}
