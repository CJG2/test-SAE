import { loadImages } from "./../inclusionImage.js";
import { initAlphabetCarousel } from "./../carousel.js";
import { openModal } from "./popUp_exercice.js";
import { jeuMotAtrou } from "./motATrou/motAtrou.js";
import { jeuAssociation } from "./association/associationGame.js";
import { jeuMotsCroises } from "./motscroises/motscroises.js";
import { jeuListeDeMots } from "./listeDeMots/listeDeMots.js";
import { stopChrono } from "../connexion/connexion.js";

//importation des styles
import "./../../styles/main.css"; // feuille de style générale
import "./../../styles/caroussel.css";
import "./../../styles/navigation.css";
import "./../../styles/miniJeux.css";
import "./../../styles/modal.css";
import "./../../styles/associationGame.css";
import "./../../styles/motscroises.css";
import "./../../styles/listeDeMots.css";

// Initialisation du carrousel quand le DOM est chargé
document.addEventListener("DOMContentLoaded", initAlphabetCarousel);
document.addEventListener("DOMContentLoaded", loadImages);

// ajout des description des mini jeux
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
      stopChrono(); // Arrêter le chrono et sauvegarder le temps écoulé
      sessionStorage.clear(); // Supprimer les données de session

      // Rediriger vers la page de connexion
      window.location.href = "/connexion.html";
    });
  }

  const listeDescription = [
    "Associe chaque mot à l'image correspondante.",
    "Complète les lettres manquantes pour chaque mot.",
    "Devine les mots avec leurs descriptions.",
    "Retrouve le même mot dans la liste de mots de droite et de gauche",
  ];
  // Bouton pour le mini-jeu : 1 Mot 1 Image
  const description_Association = document.querySelector(
    "#minijeuxAssociation #description"
  );
  const description_text_Association = document.createElement("p");
  description_text_Association.textContent = listeDescription[0];
  description_Association.appendChild(description_text_Association);

  // Bouton pour le mini-jeu : Mots à Trou
  const description_MotsATrou = document.querySelector(
    "#minijeuxMotsATrou #description"
  );
  const description_text_MotsATrou = document.createElement("p");
  description_text_MotsATrou.textContent = listeDescription[1];
  description_MotsATrou.appendChild(description_text_MotsATrou);

  // Bouton pour le mini-jeu : Mots Croisés
  const description_MotsCroises = document.querySelector(
    "#minijeuxMotsCroises #description"
  );
  const description_text_MotsCroises = document.createElement("p");
  description_text_MotsCroises.textContent = listeDescription[2];
  description_MotsCroises.appendChild(description_text_MotsCroises);

  // Bouton pour le mini-jeu : Liste de mots
  const description_ListeDeMots = document.querySelector(
    "#minijeuxMotsListe #description"
  );
  const description_text_ListeDeMots = document.createElement("p");
  description_text_ListeDeMots.textContent = listeDescription[3];
  description_ListeDeMots.appendChild(description_text_ListeDeMots);

  const association_miniJeux = document.querySelector("#minijeuxAssociation");
  association_miniJeux.addEventListener("click", () => {
    openModal(jeuAssociation);
  });

  const motATrou_miniJeux = document.querySelector("#minijeuxMotsATrou");
  motATrou_miniJeux.addEventListener("click", () => {
    openModal(jeuMotAtrou);
  });

  const motsCroises_miniJeux = document.querySelector("#minijeuxMotsCroises");
  motsCroises_miniJeux.addEventListener("click", () => {
    openModal(jeuMotsCroises);
  });

  const listeDeMots_miniJeux = document.querySelector("#minijeuxMotsListe");
  listeDeMots_miniJeux.addEventListener("click", () => {
    openModal(jeuListeDeMots);
  });

  // Gestion de l'événement "beforeunload" pour arrêter le chrono
  window.addEventListener("beforeunload", () => {
    stopChrono(); // Arrêter et sauvegarder le temps avant de quitter
  });
});
