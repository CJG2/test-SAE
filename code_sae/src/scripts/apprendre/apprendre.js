import { initAlphabetCarousel } from "./../carousel.js";
import { loadImages } from "./../inclusionImage.js";
import { openModal } from "./popUp.js";
import { AlphabetFunction } from "./alphabet/alphabet.js";
import { ecrireMot_Apprendre } from "./ecrire/ecrire.js";
import { exerciceLectureSyllabe } from "./syllabe/exerciceSyllabe.js";
import { exerciceAssociationSonLettre } from "./sonToImage/sonToImage.js";
import { stopChrono } from "../connexion/connexion.js";
import { changeFont } from "../font.js";

// Importation des styles
import "./../../styles/main.css";
import "./../../styles/caroussel.css";
import "./../../styles/navigation.css";
import "./../../styles/apprendre.css";
import "./../../styles/syllabe.css";
import "./../../styles/modal.css";
import "./../../styles/lectureSyllabe.css";

changeFont();

// Initialisation du carrousel et autres actions au chargement du DOM
document.addEventListener("DOMContentLoaded", initAlphabetCarousel);

document.addEventListener("DOMContentLoaded", loadImages);

document.addEventListener("DOMContentLoaded", () => {
  // Récupérer l'utilisateur connecté depuis localStorage
  const userLoggedIn = JSON.parse(localStorage.getItem("userLoggedIn"));

  // Vérifier si un utilisateur est connecté et si c'est un compte enfant
  if (!userLoggedIn || userLoggedIn.type !== "enfant") {
    // Si ce n'est pas un compte enfant, rediriger vers la page de progression
    window.location.href = "./progression.html";
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
      window.location.href = "./connexion.html";
    });
  }

  document.getElementById('logoApplication').addEventListener('click', function() {
    window.location.href = "./accueil.html";
  });

  // Création des descriptions des exercices
  const listeDescription = [
    "Trouve le son correspondant à la bonne lettre.",
    "Apprends à écrire de manière intéractive les mots qui te sont présentés.",
    "Apprends à lire les syllabes des mots qui te sont présentés.",
  ];

  const description_Son = document.querySelector("#exoSon #description");
  const descriptionParagraphe_S = document.createElement("p");
  descriptionParagraphe_S.textContent = listeDescription[0];
  description_Son.appendChild(descriptionParagraphe_S);

  const description_Ecrire = document.querySelector("#exoEcrire #description");
  const descriptionParagraphe_E = document.createElement("p");
  descriptionParagraphe_E.textContent = listeDescription[1];
  description_Ecrire.appendChild(descriptionParagraphe_E);

  const ecrire_apprendre = document.querySelector("#exoEcrire");
  ecrire_apprendre.addEventListener("click", (e) => {
    e.preventDefault();
    setTimeout(() => {
      openModal(ecrireMot_Apprendre);
    }, 300);
  });

  const description_Lecture = document.querySelector(
    "#exoLecture #description"
  );
  const descriptionParagraphe_L = document.createElement("p");
  descriptionParagraphe_L.textContent = listeDescription[2];
  description_Lecture.appendChild(descriptionParagraphe_L);

  const lectureDeSyllabe = document.querySelector("#exoLecture");
  lectureDeSyllabe.addEventListener("click", (e) => {
    e.preventDefault();
    setTimeout(() => {
      openModal(exerciceLectureSyllabe);
    }, 300);
  });

  const sonalettre = document.querySelector("#exoSon");
  sonalettre.addEventListener("click", (e) => {
    e.preventDefault();
    setTimeout(() => {
      openModal(exerciceAssociationSonLettre);
    }, 300);
  });

  // Gestion de l'événement "beforeunload" pour arrêter le chrono
  window.addEventListener("beforeunload", () => {
    stopChrono(); // Arrêter et sauvegarder le temps avant de quitter
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const menubar = document.querySelector(".menubar");

  const logoutLinkMobile = document.querySelector(".menubar #logout-link");
  if (logoutLinkMobile) {
    logoutLinkMobile.addEventListener("click", (e) => {
      e.preventDefault();

      localStorage.removeItem("userLoggedIn");
      sessionStorage.removeItem("enfantConnecte");
      sessionStorage.removeItem("adulteConnecte");
      sessionStorage.clear();

      window.location.href = "./connexion.html";
    });
  }

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("hamburger-active");
    menubar.classList.toggle("active");
  });

  document.addEventListener("click", (event) => {
    if (!hamburger.contains(event.target) && !menubar.contains(event.target)) {
      hamburger.classList.remove("hamburger-active");
      menubar.classList.remove("active");
    }
  });
});
