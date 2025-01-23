import { loadImages } from "./../inclusionImage.js";
import { recupererEnfantsDUnResponsable } from "../profil/profil.js";
import { formatTime, resetChrono } from "../connexion/connexion.js";
import returnArrow from "./../../assets/icons/returnArrow.png";

//importation des styles
import "./../../styles/main.css";
import "./../../styles/caroussel.css";
import "./../../styles/navigation.css";
import "./../../styles/progression.css";
import "./../../styles/profil.css";

const adulteConnecte = JSON.parse(sessionStorage.getItem("adulteConnecte"));
const enfantConnecte = JSON.parse(sessionStorage.getItem("enfantConnecte"));
const emplacement = document.querySelector("#chrono");
let idExoMotsATrou = 6;
let idExoListeMots = 16;
let idExoAssociation = 21; // ID pour le jeu d'association
let nb_tentative;
let tabExos = [];
let chronoInterval;
let chronoStartTime;

/**
 * Récupère les données d'un exercice en cours ou disponible pour l'enfant.
 * 
 * @async
 * @returns {Promise<Object>} - Un objet contenant les informations sur l'exercice à récupérer.
*/ 
async function recupererExercice() {
  const reponse = await fetch("http://localhost:3000/api/exercice");
  const exercices = await reponse.json();

  tabExos = exercices.filter(
    (exercice) =>
      exercice.libelle === "Liste de Mots" ||
      exercice.libelle === "1 Mot 1 Image"
  );
  return tabExos;
}

/**
 * Récupère les données du dernier exercice effectué par l'enfant.
 * 
 * @async
 * @param {Object} enfant - L'objet représentant l'enfant dont on souhaite récupérer l'exercice.
 * @param {string} idExercice - L'identifiant de l'exercice dont on souhaite récupérer les données.
 * @returns {Promise<Object>} - Un objet contenant les informations du dernier exercice effectué.
*/ 
export async function recupererDernierExerciceFait(enfant, idExercice) {
  const reponse = await fetch("http://localhost:3000/api/realiser");
  const exercicesRealiser = await reponse.json();
  return exercicesRealiser.filter(
    (exerciceRealiser) =>
      exerciceRealiser.id_enfant === enfant.id_enfant &&
      exerciceRealiser.id_exercice === idExercice
  );
}

/**
 * Affiche le chronomètre dans l'interface utilisateur.
 * 
 * @returns {void}
*/ 
function afficherChrono() {
  const startTime = parseInt(localStorage.getItem("chronoStart"), 10);
  if (!startTime) return;

  const chronoElement = document.createElement("p");
  chronoElement.id = "chronoDisplay";
  emplacement.appendChild(chronoElement);

/** 
 * Met à jour le chronomètre de l'exercice.
 * 
 * @returns {void}
*/ 
  function updateChrono() {
    const elapsedTime = Date.now() - startTime;
    chronoElement.textContent = formatTime(elapsedTime);
  }

  updateChrono(); // Mettre à jour immédiatement
  chronoInterval = setInterval(updateChrono, 1000); // Sauvegarde de l'intervalle
}

/**
 * Calcule la progression de l'enfant dans l'exercice.
 * 
 * @async
 * @returns {Promise<number>} - Retourne un pourcentage représentant la progression de l'enfant.
*/ 
async function compteProgression() {
  const tabEnfants = await recupererEnfantsDUnResponsable();
  progression(tabEnfants[0]);
  const divButton = document.querySelector("#button_container");
  for (let i = 0; i < tabEnfants.length; i++) {
    let compte = document.createElement("button");
    compte.className = "compteEnfantProfil";
    compte.textContent = tabEnfants[i].prenom_enfant;
    compte.addEventListener("click", () => progression(tabEnfants[i]));
    divButton.appendChild(compte);
  }
}

/**
 * Affiche la progression de l'enfant dans une liste de mots.
 * 
 * @async
 * @param {Object} enfant - L'objet représentant l'enfant dont on suit la progression.
 * @param {HTMLElement} listeContainer - Conteneur DOM où la liste des mots sera affichée.
*/ 
async function afficherProgressionListeMots(enfant, listeContainer) {
  let lstDeMots = document.createElement("h2");
  lstDeMots.textContent = "Liste de Mots";

  let exerciceReussiTotal = 0;
  let nbrExoTotal = 0;
  let stats = {
    un: { reussi: 0, total: 0 },
    deux: { reussi: 0, total: 0 },
    trois: { reussi: 0, total: 0 },
    quatre: { reussi: 0, total: 0 },
    cinq: { reussi: 0, total: 0 },
  };

  for (let idExo = idExoListeMots; idExo < idExoListeMots + 5; idExo++) {
    const exercicesRealiser = await recupererDernierExerciceFait(enfant, idExo);
    for (let tentative of exercicesRealiser) {
      const niveau = idExo - idExoListeMots + 1;
      const seuil = 70 + (niveau - 1) * 5;
      const niveauKey = ["un", "deux", "trois", "quatre", "cinq"][niveau - 1];

      stats[niveauKey].total++;
      if (tentative.score >= seuil) {
        stats[niveauKey].reussi++;
        exerciceReussiTotal++;
      }
      nbrExoTotal++;
    }
  }

  listeContainer.appendChild(lstDeMots);
  listeContainer.appendChild(document.createElement("br"));

  Object.entries(stats).forEach(([niveau, data], index) => {
    let reussite = document.createElement("label");
    reussite.textContent =
      data.total === 0
        ? `Réussite Niveau ${index + 1} : Pas de donnée pour ce niveau`
        : `Réussite Niveau ${index + 1} : ${(
          (data.reussi / data.total) *
          100
        ).toFixed(2)}%`;
    listeContainer.appendChild(reussite);
    listeContainer.appendChild(document.createElement("br"));
    listeContainer.appendChild(document.createElement("br"));
  });

  let reussiteGlobale = document.createElement("label");
  reussiteGlobale.textContent =
    nbrExoTotal === 0
      ? "Réussite Globale : Pas de donnée pour cet exercice"
      : `Réussite Globale : ${(
        (exerciceReussiTotal / nbrExoTotal) *
        100
      ).toFixed(2)}%`;
  listeContainer.appendChild(reussiteGlobale);
}

/**
 * Affiche la progression de l'enfant dans un exercice basé sur un mot à trous.
 * 
 * @async
 * @param {Object} enfant - L'objet représentant l'enfant dont on suit la progression.
 * @param {HTMLElement} trouContainer - Conteneur DOM dans lequel l'affichage des mots à trous sera effectué.
*/ 
async function afficherProgressionMotsTrou(enfant, trouContainer) {
  let motATrou = document.createElement("h2");
  motATrou.textContent = "Mots à trou";

  let exerciceReussiTotal = 0;
  let nbrExoTotal = 0;
  let stats = {
    un: { reussi: 0, total: 0 },
    deux: { reussi: 0, total: 0 },
    trois: { reussi: 0, total: 0 },
    quatre: { reussi: 0, total: 0 },
    cinq: { reussi: 0, total: 0 },
  };

  for (let idExo = idExoMotsATrou; idExo < idExoMotsATrou + 5; idExo++) {
    const exercicesRealiser = await recupererDernierExerciceFait(enfant, idExo);
    for (let tentative of exercicesRealiser) {
      const niveau = idExo - idExoMotsATrou + 1;
      const seuil = 70 + (niveau - 1) * 5;
      const niveauKey = ["un", "deux", "trois", "quatre", "cinq"][niveau - 1];

      stats[niveauKey].total++;
      if (tentative.score >= seuil) {
        stats[niveauKey].reussi++;
        exerciceReussiTotal++;
      }
      nbrExoTotal++;
    }
  }

  trouContainer.appendChild(motATrou);
  trouContainer.appendChild(document.createElement("br"));

  let reussiteGlobale = document.createElement("label");
  reussiteGlobale.textContent =
    nbrExoTotal === 0
      ? "Réussite de L'exercice : Pas de donnée pour cet exercice"
      : `Réussite de L\'exercice : ${(
        (exerciceReussiTotal / nbrExoTotal) *
        100
      ).toFixed(2)}%`;
  trouContainer.appendChild(reussiteGlobale);
}

/**
 * Affiche la progression de l'enfant dans l'association.
 * Cette fonction gère les différentes étapes d'affichage liées à l'exercice, les mots à trouver, et le chronomètre.
 * 
 * @async
 * @param {Object} enfant - L'objet représentant l'enfant dont on suit la progression.
 * @param {HTMLElement} associationContainer - Conteneur DOM dans lequel les informations de progression de l'association seront affichées.
 */
async function afficherProgressionAssociation(enfant, associationContainer) {
  let titreAssociation = document.createElement("h2");
  titreAssociation.textContent = "1 Mot 1 Image";

  let exerciceReussiTotal = 0;
  let nbrExoTotal = 0;
  let stats = {
    facile: { reussi: 0, total: 0 },
    moyen: { reussi: 0, total: 0 },
    difficile: { reussi: 0, total: 0 },
  };

  const exercicesRealiser = await recupererDernierExerciceFait(
    enfant,
    idExoAssociation
  );

  for (let tentative of exercicesRealiser) {
    const difficulte = Math.floor(tentative.score / 100);
    const niveauKey =
      ["facile", "moyen", "difficile"][difficulte - 1] || "facile";

    stats[niveauKey].total++;
    if (tentative.score % 100 >= 70) {
      stats[niveauKey].reussi++;
      exerciceReussiTotal++;
    }
    nbrExoTotal++;
  }

  associationContainer.appendChild(titreAssociation);
  associationContainer.appendChild(document.createElement("br"));

  const niveaux = [
    { key: "facile", nom: "Facile" },
    { key: "moyen", nom: "Moyen" },
    { key: "difficile", nom: "Difficile" },
  ];

  niveaux.forEach(({ key, nom }) => {
    let reussite = document.createElement("label");
    reussite.textContent =
      stats[key].total === 0
        ? `Réussite Niveau ${nom} : Pas de donnée pour ce niveau`
        : `Réussite Niveau ${nom} : ${(
          (stats[key].reussi / stats[key].total) *
          100
        ).toFixed(2)}%`;
    associationContainer.appendChild(reussite);
    associationContainer.appendChild(document.createElement("br"));
    associationContainer.appendChild(document.createElement("br"));
  });

  let reussiteGlobale = document.createElement("label");
  reussiteGlobale.textContent =
    nbrExoTotal === 0
      ? "Réussite Globale : Pas de donnée pour cet exercice"
      : `Réussite Globale : ${(
        (exerciceReussiTotal / nbrExoTotal) *
        100
      ).toFixed(2)}%`;
  associationContainer.appendChild(reussiteGlobale);
}


/**
 * Suivi de la progression de l'enfant dans l'exercice.
 * 
 * @async
 * @param {Object} enfant - L'objet représentant l'enfant dont on suit la progression.
*/ 
async function progression(enfant) {
  const gauche = document.querySelector("#conteneur-gauche");
  const droite = document.querySelector("#conteneur-droite");
  const listeContainer = document.querySelector("#liste-de-mots");
  const trouContainer = document.querySelector("#Mot-a-trou");
  const associationContainer =
    document.querySelector("#association-game") ||
    document.createElement("section");
  associationContainer.id = "association-game";

  listeContainer.innerHTML = "";
  trouContainer.innerHTML = "";
  associationContainer.innerHTML = "";
  emplacement.innerHTML = "";

  const titreProgression = document.querySelector("#app > h2");
  titreProgression.textContent = "Progression de " + enfant.prenom_enfant;

  tabExos = await recupererExercice();

  if (tabExos.length === 0) {
    console.error("Aucun exercice disponible !");
    return;
  }

  await afficherProgressionListeMots(enfant, listeContainer);
  await afficherProgressionAssociation(enfant, associationContainer);
  await afficherProgressionMotsTrou(enfant, trouContainer);

  let titreChrono = document.createElement("h2");
  titreChrono.textContent = "Temps passé sur l'application";
  emplacement.appendChild(titreChrono);
  afficherChrono();

  gauche.appendChild(listeContainer);
  droite.appendChild(associationContainer);
  droite.appendChild(trouContainer);
}

document.addEventListener("DOMContentLoaded", loadImages);

document.addEventListener("DOMContentLoaded", () => {
  const userRole = localStorage.getItem("role");
  if (userRole !== "adulte") {
    window.location.href = "accueil.html";
    return;
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const userLoggedIn = JSON.parse(localStorage.getItem("userLoggedIn"));

  const currentPath = window.location.pathname;

  const publicPages = ["/connexion.html"];

  if (!userLoggedIn) {
    if (!publicPages.includes(currentPath)) {
      window.location.href = "/connexion.html";
      return;
    }
  } else {
    if (userLoggedIn.type !== "adulte") {
      if (!publicPages.includes(currentPath)) {
        window.location.href = "/accueil.html";
        return;
      }
    }
  }

  const logoutLink = document.querySelector("#logout-link");
  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();

      localStorage.removeItem("userLoggedIn");
      sessionStorage.removeItem("enfantConnecte");
      sessionStorage.removeItem("adulteConnecte");

      window.location.href = "/connexion.html";
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  loadImages();
  compteProgression();

  const adulteConnecte = JSON.parse(sessionStorage.getItem("adulteConnecte"));

  const retourCompteDivs = document.querySelectorAll(
    ".returnArrowToChoixCompte"
  );
  retourCompteDivs.forEach((retourCompteDiv) => {
    retourCompteDiv.addEventListener("click", () => {
      if (adulteConnecte) {
        sessionStorage.setItem(
          "preRemplissageFormulaire",
          JSON.stringify(adulteConnecte)
        );
      }
      window.location.href = "/connexion.html";
    });
  });

  const retourImage = document.createElement("img")
  retourImage.id = "#returnArrowImage";
  if (retourImage) {
    retourImage.src = returnArrow;
  } else {
    console.warn("⚠️ L'élément #returnArrowImage est introuvable. Vérifiez s'il est présent dans le HTML.");
  }
});
