import { initAlphabetCarousel } from "./../carousel.js";
import { loadImages } from "./../inclusionImage.js";
import { stopChrono } from "../connexion/connexion.js";

// Importation des styles
import "./../../styles/main.css";
import "./../../styles/caroussel.css";
import "./../../styles/navigation.css";
import "./../../styles/accueil.css";

// Initialisation de la page après le chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
  const userLoggedIn = JSON.parse(localStorage.getItem("userLoggedIn"));

  if (!userLoggedIn || userLoggedIn.type !== "enfant") {
    window.location.href = "./progression.html";
    return;
  }

  // Gestion du bouton de déconnexion
  const logoutHandler = (e) => {
    e.preventDefault();
    localStorage.removeItem("userLoggedIn");
    sessionStorage.removeItem("enfantConnecte");
    sessionStorage.removeItem("adulteConnecte");
    sessionStorage.clear();
    window.location.href = "./connexion.html";
  };

  const logoutLink = document.querySelector("#logout-link");
  if (logoutLink) logoutLink.addEventListener("click", logoutHandler);

  const logoutLinkMobile = document.querySelector(".menubar #logout-link");
  if (logoutLinkMobile) logoutLinkMobile.addEventListener("click", logoutHandler);

  // Sélection du container principal
  const container = document.querySelector("#container");

  // 1. Création et ajout du message de bienvenue
  const welcomeMessage = document.createElement("h1");
  welcomeMessage.id = "welcomeMessage";
  welcomeMessage.textContent = `Bienvenue ${userLoggedIn.prenom} !`;
  container.appendChild(welcomeMessage);

  // 2. Création d'un div pour contenir les liens vers les autres pages
  const linksContainer = document.createElement("div");
  linksContainer.id = "linksContainer"; // ID pour styliser plus facilement avec CSS
  container.appendChild(linksContainer);

  // Fonction pour créer les liens
  const createNavLink = (imgId, text, url) => {
    const link = document.createElement("div");
    link.className = "linkExercice";

    const image = document.createElement("img");
    image.id = imgId;

    const description = document.createElement("p");
    description.textContent = text;

    link.appendChild(image);
    link.appendChild(document.createElement("hr"));
    link.appendChild(description);

    link.addEventListener("click", (e) => {
      e.preventDefault();
      setTimeout(() => {
        window.location.href = url;
      }, 300);
    });

    return link;
  };

  // Ajout des liens dans le linksContainer
  linksContainer.appendChild(
    createNavLink(
      "accueilLinkImagesApprendre",
      "Apprends à lire et à écrire avec des exercices !",
      "apprendre.html"
    )
  );

  linksContainer.appendChild(
    createNavLink(
      "accueilLinkImagesMiniGames",
      "Apprends en t'amusant avec des exercices !",
      "miniJeux.html"
    )
  );

  // Initialisation du carrousel
  initAlphabetCarousel();

  // Chargement des images
  loadImages();

  // Gestion du chrono avant de quitter la page
  window.addEventListener("beforeunload", stopChrono);
});

// Gestion du menu hamburger
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const menubar = document.querySelector(".menubar");

  if (hamburger && menubar) {
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
  }
});
