import successSound from "./../../../assets/sons/appSound/goodAnswer.mp3";
import failSound from "./../../../assets/sons/appSound/wrongAnswer.mp3";

import ennonceSound from "./../../../assets/sons/descriptionMJetA/description_apprendre/voix_apprendre_lectureDesSyllabes 1.mp3";
import { Consignes } from "./../../consignes/consignes.js";

/**
 * Exercice pour la lecture de syllabe
 *
 * @export
 * @async
 * @param {*} modalBody
 * @returns {*}
 */
export async function exerciceLectureSyllabe(modalBody) {
  const normalizeString = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase();
  };

  const loadWordBank = async () => {
    try {
      const response = await fetch("https://test-sae.onrender.com/api/mot");
      if (!response.ok) throw new Error("Erreur lors du chargement des mots.");
      return await response.json();
    } catch (error) {
      console.error("Erreur :", error);
      return [];
    }
  };

  const generateExercises = (words, numExercises = 3) => {
    const filteredWords = words
      .filter((word) => word.syllabes.split("/").length > 2)
      .sort(() => 0.5 - Math.random());

    return Array.from({ length: numExercises }, (_, i) => {
      const selectedWord = filteredWords[i % filteredWords.length];

      if (!selectedWord) return null;

      const syllabe = selectedWord.syllabes.split("/")[0].toLowerCase();
      const bonneReponse = selectedWord.mot;

      const distracteurs = filteredWords
        .filter((word) => word !== selectedWord && word.mot)
        .slice(0, 3);

      return {
        syllabe,
        mots: [selectedWord, ...distracteurs].sort(() => 0.5 - Math.random()),
        bonneReponse: selectedWord.mot,
        imageSrc: `./assets/images/${normalizeString(
          selectedWord.mot
        )}.png`,
      };
    }).filter((exercice) => exercice !== null);
  };

  const words = await loadWordBank();
  if (words.length === 0) {
    modalBody.textContent =
      "Impossible de charger les mots. Réessayez plus tard.";
    return;
  }

  let points = 0;
  let niveau = 1;
  let currentPage = 0;
  const exercicesParPage = 3;

  const displayExercises = (page) => {
    modalBody.innerHTML = "";

    const exercices = generateExercises(words, exercicesParPage);

    const exerciseContainer = document.createElement("div");
    exerciseContainer.classList.add("exercice-syllabe");

    new Consignes(exerciseContainer, ennonceSound);

    const titre = document.createElement("h2");
    titre.textContent = "Lecture de Syllabes";
    const instructions = document.createElement("p");
    instructions.textContent =
      "Trouve le mot qui correspond à la syllabe donnée.";

    const scoreContainer = document.createElement("div");
    scoreContainer.classList.add("score-container");
    const pointsDisplay = document.createElement("p");
    pointsDisplay.textContent = `Points : ${points} | Niveau : ${niveau}`;
    scoreContainer.appendChild(pointsDisplay);

    scoreContainer.style.position = "absolute";
    scoreContainer.style.top = "10px";
    scoreContainer.style.right = "50px";

    exerciseContainer.appendChild(titre);
    exerciseContainer.appendChild(instructions);
    exerciseContainer.appendChild(scoreContainer);

    let answeredCount = 0;

    exercices.forEach((exercice) => {
      if (!exercice) return;

      const sectionExercice = document.createElement("div");
      sectionExercice.classList.add("section-exercice");

      const consigne = document.createElement("p");
      consigne.textContent = `Trouve un mot qui contient la syllabe "${exercice.syllabe}".`;

      const imageElement = document.createElement("img");
      imageElement.src = exercice.imageSrc;
      imageElement.alt = exercice.bonneReponse;
      imageElement.classList.add("image-exercice");
      imageElement.style.width = "100px";
      imageElement.style.height = "100px";
      imageElement.style.objectFit = "cover";

      sectionExercice.appendChild(consigne);
      sectionExercice.appendChild(imageElement);

      const choixContainer = document.createElement("div");
      choixContainer.classList.add("choix-container");

      let alreadyAnswered = false;

      exercice.mots.forEach((motObj) => {
        if (!motObj || !motObj.mot) return;

        const boutonChoix = document.createElement("button");
        boutonChoix.classList.add("mot-button");
        boutonChoix.textContent = motObj.mot;

        boutonChoix.addEventListener("click", () => {
          if (alreadyAnswered) return;
          alreadyAnswered = true;
          answeredCount++;

          choixContainer.querySelectorAll("button").forEach((btn) => {
            btn.style.backgroundColor = "";
            btn.style.color = "";
            btn.disabled = true;
          });

          if (motObj.mot === exercice.bonneReponse) {
            boutonChoix.style.backgroundColor = "green";
            boutonChoix.style.color = "white";
            points++;
          } else {
            boutonChoix.style.backgroundColor = "red";
            boutonChoix.style.color = "white";
          }

          pointsDisplay.textContent = `Points : ${points} | Niveau : ${niveau}`;

          if (points >= 5 * niveau) {
            const goodAudio = new Audio(successSound);
            goodAudio.play();
            niveau++;
            pointsDisplay.textContent = `Points : ${points} | Niveau : ${niveau}`;
            alert(`Bravo ! Tu passes au niveau ${niveau} !`);
          }

          if (answeredCount === exercicesParPage) {
            nextButton.style.display = "block";
          }
        });

        choixContainer.appendChild(boutonChoix);
      });

      sectionExercice.appendChild(choixContainer);
      exerciseContainer.appendChild(sectionExercice);
    });

    const nextButton = document.createElement("button");
    nextButton.textContent = "Suivant ➡";
    nextButton.classList.add("next-button");
    nextButton.style.display = "none";
    nextButton.addEventListener("click", () => {
      displayExercises(page + 1);
    });

    exerciseContainer.appendChild(nextButton);
    modalBody.appendChild(exerciseContainer);
  };

  displayExercises(currentPage);
}
