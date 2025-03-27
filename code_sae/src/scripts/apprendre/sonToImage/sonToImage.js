import ennonceSound from "./../../../assets/sons/descriptionMJetA/description_apprendre/voix_apprendre_duSonALaLettre 1.mp3";
import { Consignes } from "./../../consignes/consignes.js";


/**
 * Fonction pour lancer le mini-jeu de l'association du son à l'image
 *
 * @export
 * @param {*} modalBody - Élément DOM où le jeu sera intégré
 */
export function exerciceAssociationSonLettre(modalBody) {
    const exerciseContainer = document.createElement("div");
    exerciseContainer.classList.add("exercice-association");

    const toggleContainer = document.createElement("div");
    toggleContainer.classList.add("switch-container", "mb-3");
    toggleContainer.style.width = "100px";
    const toggleLabel = document.createElement("label");
    toggleLabel.textContent = "Mode : ";

    const toggleSwitch = document.createElement("input");
    toggleSwitch.type = "checkbox";
    toggleSwitch.checked = true;

    toggleLabel.appendChild(toggleSwitch);
    toggleContainer.appendChild(toggleLabel);
    exerciseContainer.appendChild(toggleContainer);

    const replayButton = document.createElement("button");
    replayButton.textContent = "Rejouer";
    replayButton.style.backgroundColor = "#4CAF50";
    replayButton.style.color = "white";
    replayButton.style.border = "none";
    replayButton.style.padding = "10px 20px";
    replayButton.style.cursor = "pointer";
    replayButton.style.position = "absolute";
    replayButton.style.bottom = "20px";
    replayButton.style.left = "50%";
    replayButton.style.transform = "translateX(-50%)";
    replayButton.style.display = "none";
    exerciseContainer.appendChild(replayButton);

    const lettres = "abcdefghijklmnopqrstuvwxyz".split('');
    let currentLetter, currentSound, soundOptions, selectedSoundPath = null;
    let resultMessage;

    new Consignes(exerciseContainer, ennonceSound);

    const context = require.context('./../../../assets/sons/lettres', false, /\.mp3$/);
    const audioFiles = context.keys().reduce((files, path) => {
        const fileName = path.replace('./', '');
        files[fileName] = context(path);
        return files;
    }, {});

    function getRandomLetters(count) {
        const shuffled = lettres.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    function updateExercice() {
        const existingSections = exerciseContainer.querySelectorAll(".section-exercice");
        existingSections.forEach(section => section.remove());

        const selectedLetters = getRandomLetters(3);
        currentLetter = selectedLetters[Math.floor(Math.random() * selectedLetters.length)];

        const sectionExercice = document.createElement("div");
        sectionExercice.classList.add("section-exercice");

        const imagePath = require(`./../../../assets/images/${currentLetter}.png`);
        currentSound = audioFiles[`${currentLetter}.mp3`];

        if (toggleSwitch.checked) {
            const consigne = document.createElement("p");
            consigne.textContent = `Quel est la lettre qui correspond à ce son ?`;
            sectionExercice.appendChild(consigne);
            
            const audioIcon = document.createElement("img");
            audioIcon.src = require('./../../../assets/icons/sons.png');
            audioIcon.alt = 'Play sound';
            audioIcon.style.width = "50px";
            audioIcon.style.cursor = "pointer";
            audioIcon.addEventListener("click", () => {
                const audio = new Audio(currentSound);
                audio.play();
            });
            sectionExercice.appendChild(audioIcon);

            const dropArea = document.createElement("div");
            dropArea.style.width = "100px";
            dropArea.style.height = "100px";
            dropArea.style.border = "2px dashed #ccc";
            dropArea.style.display = "flex";
            dropArea.style.alignItems = "center";
            dropArea.style.justifyContent = "center";
            dropArea.style.margin = "20px 0";
            sectionExercice.appendChild(dropArea);

            const choixContainer = document.createElement("div");
            choixContainer.classList.add("choix-container");
            selectedLetters.forEach(letter => {
                const boutonChoix = document.createElement("div");
                const letterImg = document.createElement("img");
                letterImg.src = require(`./../../../assets/images/${letter}.png`);
                letterImg.alt = `Image de la lettre ${letter}`;
                letterImg.style.width = "70px"; 
                letterImg.style.marginTop = "20px"; 
                boutonChoix.appendChild(letterImg);
                
                boutonChoix.draggable = true;
                boutonChoix.addEventListener("dragstart", (e) => {
                    e.dataTransfer.setData("text", letter);
                });

                choixContainer.appendChild(boutonChoix);
            });

            dropArea.addEventListener("dragover", (e) => {
                e.preventDefault();
            });

            dropArea.addEventListener("drop", (e) => {
                e.preventDefault();
                const letterDropped = e.dataTransfer.getData("text");
                if (letterDropped === currentLetter) {
                    dropArea.style.backgroundColor = "rgba(0, 255, 0, 0.5)";
                    resultMessage.textContent = "Correct !";
                    toggleReplayButton(true);
                } else {
                    dropArea.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
                    resultMessage.textContent = "Erreur : la lettre n'est pas correcte.";
                }
            });

            sectionExercice.appendChild(choixContainer);
            sectionExercice.appendChild(dropArea);
        } else {
            const consigne = document.createElement("p");
            consigne.textContent = `Quel son correspond à la lettre "${currentLetter}" ?`;
            sectionExercice.appendChild(consigne);

            const letterImage = document.createElement("img");
            letterImage.src = imagePath;
            letterImage.alt = `Image de la lettre ${currentLetter}`;
            letterImage.style.width = "100px";
            sectionExercice.appendChild(letterImage);

            const audioIconsContainer = document.createElement("div");
            audioIconsContainer.style.display = "flex";
            audioIconsContainer.style.gap = "10px";

            soundOptions = [];
            soundOptions.push(currentSound);
            while (soundOptions.length < 3) {
                const randomAudioPath = getRandomAudio(`${currentLetter}.mp3`);
                if (!soundOptions.includes(randomAudioPath)) {
                    soundOptions.push(randomAudioPath);
                }
            }

            soundOptions.sort(() => 0.5 - Math.random());

            soundOptions.forEach(sound => {
                const audioIcon = document.createElement("img");
                audioIcon.src = require('./../../../assets/icons/sons.png');
                audioIcon.alt = 'Play sound';
                audioIcon.style.width = "50px";
                audioIcon.style.cursor = "pointer";
                audioIcon.dataset.soundPath = sound;
                audioIcon.addEventListener("click", () => {
                    const audio = new Audio(sound);
                    audio.play();
                    selectAudioIcon(audioIcon, sound);
                });
                audioIconsContainer.appendChild(audioIcon);
            });

            sectionExercice.appendChild(audioIconsContainer);

            const validateButton = document.createElement("button");
            validateButton.textContent = "Vérifier";
            validateButton.style.backgroundColor = "green";
            validateButton.style.color = "white";
            validateButton.style.border = "none";
            validateButton.style.padding = "10px 20px";
            validateButton.style.cursor = "pointer";
            validateButton.style.marginTop = "20px";
            
            validateButton.addEventListener("click", validateAnswer);
            sectionExercice.appendChild(validateButton);
        }

        resultMessage = document.createElement("p");
        resultMessage.style.fontWeight = "bold";
        resultMessage.style.marginTop = "10px";
        resultMessage.style.textAlign = "center";
        sectionExercice.appendChild(resultMessage);

        exerciseContainer.appendChild(sectionExercice);
    }

    function selectAudioIcon(icon, sound) {
        if (selectedSoundPath) {
            const previouslySelectedIcon = document.querySelector('img[style*="border: 2px solid blue"]');
            if (previouslySelectedIcon) {
                previouslySelectedIcon.style.border = "";
            }
        }
        selectedSoundPath = sound;
        icon.style.border = "2px solid blue";
    }

    function validateAnswer() {
        if (!selectedSoundPath) {
            resultMessage.textContent = "Veuillez sélectionner un son.";
            return;
        }

        const isSoundToLetterMode = toggleSwitch.checked;
        let isCorrectAnswer = false;

        if (isSoundToLetterMode) {
            const droppedLetter = document.querySelector(".section-exercice div[data-dropped-letter]").textContent.trim();
            isCorrectAnswer = droppedLetter === currentLetter;
        } else {
            isCorrectAnswer = selectedSoundPath === currentSound;
        }

        if (isCorrectAnswer) {
            resultMessage.textContent = "Bravo, tu as réussi !";
            toggleReplayButton(true);
        } else {
            resultMessage.textContent = "Dommage, ce n'est pas la bonne réponse. Réessaie encore !";
        }
    }
    
    function toggleReplayButton(show) {
        if (show) {
            replayButton.style.display = "block";
        } else {
            replayButton.style.display = "none";
        }
    }

    function getRandomAudio(exclude) {
        const keys = Object.keys(audioFiles).filter(key => key !== exclude);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        return audioFiles[randomKey];
    }

    toggleSwitch.addEventListener("change", () => {
        toggleReplayButton(false);
        updateExercice();
    });

    replayButton.addEventListener("click", () => {
        toggleReplayButton(false);
        updateExercice();
        resultMessage.textContent = "";
    });

    updateExercice();
    modalBody.appendChild(exerciseContainer);
}