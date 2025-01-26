import { initAlphabetCarousel } from "./../carousel.js";
import { loadImages } from "./../inclusionImage.js";
import { openModal } from "./popUp.js";
import { AlphabetFunction } from "./alphabet/alphabet.js";
import { ecrireMot_Apprendre } from "./ecrire/ecrire.js";
import { exerciceLectureSyllabe } from "./syllabe/exerciceSyllabe.js";
import { exerciceAssociationSonLettre } from "./sonToImage/sonToImage.js";
import { stopChrono } from "../connexion/connexion.js";

// Importation des styles
import "./../../styles/main.css";
import "./../../styles/caroussel.css";
import "./../../styles/navigation.css";
import "./../../styles/apprendre.css";
import "./../../styles/syllabe.css";
import "./../../styles/modal.css";
import "./../../styles/lectureSyllabe.css";

// Initialisation du carrousel et autres actions au chargement du DOM
document.addEventListener("DOMContentLoaded", initAlphabetCarousel);

document.addEventListener("DOMContentLoaded", loadImages);

document.addEventListener("DOMContentLoaded", () => {
  // Récupérer l'utilisateur connecté depuis localStorage
  const userLoggedIn = JSON.parse(localStorage.getItem("userLoggedIn"));

  // Vérifier si un utilisateur est connecté et si c'est un compte enfant
  if (!userLoggedIn || userLoggedIn.type !== "enfant") {
    // Si ce n'est pas un compte enfant, rediriger vers la page de progression
    window.location.href = "/progression.html";
    return;
  }

  // Configuration du bouton de déconnexion
  const logoutLink = document.querySelector("#logout-link");
  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();

      // Supprimer les données de connexion
      localStorage.removeItem("userLoggedIn");
      sessionStorage.removeItem("enfantConnecte");
      sessionStorage.removeItem("adulteConnecte");
      //stopChrono(); // Arrêter le chrono et sauvegarder le temps écoulé
      //sessionStorage.clear(); // Supprimer les données de session
      
      // Rediriger vers la page de connexion
      window.location.href = "/test-SAE/code_sae/dist/connexion.html";
    });
  }

  // Création des descriptions des exercices
  const listeDescription = [
    "Apprends le son de chaque lettre de l'alphabet, et savoir les reconnaître que ce soit en majuscule ou en minuscule.",
    "Trouve le son correspondant à la bonne lettre.",
    "Apprends à écrire de manière intéractive le mot qui te sont présentés.",
    "Apprends à lire les syllabes des mots qui te sont présentés.",
  ];

  const description_Alphabet = document.querySelector(
    "#exoAlphabet #description"
  );
  const descriptionParagraphe_A = document.createElement("p");
  descriptionParagraphe_A.textContent = listeDescription[0];
  description_Alphabet.appendChild(descriptionParagraphe_A);

  const alphabet_apprendre = document.querySelector("#exoAlphabet");
  alphabet_apprendre.addEventListener("click", () => {
    openModal(AlphabetFunction);
  });

  const description_Son = document.querySelector("#exoSon #description");
  const descriptionParagraphe_S = document.createElement("p");
  descriptionParagraphe_S.textContent = listeDescription[1];
  description_Son.appendChild(descriptionParagraphe_S);

  const description_Ecrire = document.querySelector("#exoEcrire #description");
  const descriptionParagraphe_E = document.createElement("p");
  descriptionParagraphe_E.textContent = listeDescription[2];
  description_Ecrire.appendChild(descriptionParagraphe_E);

  const ecrire_apprendre = document.querySelector("#exoEcrire");
  ecrire_apprendre.addEventListener("click", () => {
    openModal(ecrireMot_Apprendre);
  });

  const description_Lecture = document.querySelector(
    "#exoLecture #description"
  );
  const descriptionParagraphe_L = document.createElement("p");
  descriptionParagraphe_L.textContent = listeDescription[3];
  description_Lecture.appendChild(descriptionParagraphe_L);

  const lectureDeSyllabe = document.querySelector("#exoLecture");
  lectureDeSyllabe.addEventListener("click", () => {
    openModal(exerciceLectureSyllabe);
  });

  const sonalettre = document.querySelector("#exoSon");
  sonalettre.addEventListener("click", () => {
    openModal(exerciceAssociationSonLettre);
  });

  // Gestion de l'événement "beforeunload" pour arrêter le chrono
  window.addEventListener("beforeunload", () => {
    stopChrono(); // Arrêter et sauvegarder le temps avant de quitter
  });
});
