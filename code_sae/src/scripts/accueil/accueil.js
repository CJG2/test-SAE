import { initAlphabetCarousel } from "./../carousel.js";
import { loadImages } from "./../inclusionImage.js";
import { stopChrono } from "../connexion/connexion.js";

//importation des styles
import "./../../styles/main.css"; // feuille de style générale
import "./../../styles/caroussel.css";
import "./../../styles/navigation.css";
import "./../../styles/accueil.css";

// Initialisation du carrousel et configuration de la page
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
      sessionStorage.clear(); // Supprimer les données de session

      // Rediriger vers la page de connexion
      window.location.href = "/code_sae/dist/connexion.html";
    });
  }

  // Affiche un message personnalisé sur la page d'accueil
  const welcomeMessage = document.createElement("h1");
  welcomeMessage.id = "welcomeMessage";
  if (userLoggedIn.type === "enfant") {
    welcomeMessage.textContent = `Bienvenue ${userLoggedIn.prenom} !`;
  }

  const container = document.querySelector("#container");

  container.prepend(welcomeMessage);
  initAlphabetCarousel();

  const enfantConnecte = JSON.parse(sessionStorage.getItem("enfantConnecte"));
  console.log(enfantConnecte);

  // lien vers la page apprendre
  const linkApprendre = document.createElement("div");
  linkApprendre.className = "linkExercice";

  const imageApprendre = document.createElement("img");
  imageApprendre.id = "accueilLinkImagesApprendre";

  const descriptionAppr = document.createElement("p");
  descriptionAppr.textContent =
    "Apprends à lire et à écrire avec des exercices !";

  linkApprendre.appendChild(imageApprendre);
  linkApprendre.appendChild(document.createElement("hr"));
  linkApprendre.appendChild(descriptionAppr);

  linkApprendre.addEventListener("click", function () {
    window.location.href = "/apprendre.html";
  });

  // lien vers la page Mini-jeux
  const linkMiniGames = document.createElement("div");
  linkMiniGames.className = "linkExercice";

  const imageMiniGame = document.createElement("img");
  imageMiniGame.id = "accueilLinkImagesMiniGames";

  const descriptionMiGa = document.createElement("p");
  descriptionMiGa.textContent = "Apprends en t'amusant avec des exercices !";

  linkMiniGames.appendChild(imageMiniGame);
  linkMiniGames.appendChild(document.createElement("hr"));
  linkMiniGames.appendChild(descriptionMiGa);

  linkMiniGames.addEventListener("click", function () {
    window.location.href = "/miniJeux.html";
  });

  container.appendChild(linkApprendre);
  container.appendChild(linkMiniGames);

  loadImages();

  // Gestion de l'événement "beforeunload" pour arrêter le chrono
  window.addEventListener("beforeunload", () => {
    stopChrono(); // Arrêter et sauvegarder le temps avant de quitter
  });
});
