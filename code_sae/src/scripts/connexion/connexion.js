import { inscription } from "./inscrire.js";
import { InscriptionEnfant } from "./inscrireEnfant.js";
import { loadImages } from "./../inclusionImage.js";
import { verifConnexion } from "./checks.js";

import seePasswordImage from "./../../assets/icons/seePasswordEye.png";
import hidePasswordImage from "./../../assets/icons/hidePasswordEye.png";

// Importation des styles
import "./../../styles/main.css"; // feuille de style générale
import "./../../styles/connexion.css";

document.addEventListener("DOMContentLoaded", loadImages);

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector("#bloc_connexion")) {  
    connexion();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Récupérer les données depuis sessionStorage
  const preRemplissage = JSON.parse(sessionStorage.getItem("preRemplissageFormulaire"));

  // Vérifier si les données existent
  if (preRemplissage) {
    // Préremplir les champs du formulaire
    const usernameInput = document.querySelectorAll(".Imail"); // Exemple de champ
    const passwordInput = document.querySelectorAll("Ipassword"); // Exemple de champ

    if (usernameInput) usernameInput.value = preRemplissage.username;
    if (passwordInput) passwordInput.value = preRemplissage.hash;

    // Optionnel : supprimer les données du sessionStorage après utilisation
    sessionStorage.removeItem("preRemplissageFormulaire");
  }
});

let chronoStartTime = null; // Heure de départ
let chronoInterval = null;
let emplacement = document.querySelector("#bloc_connexion");

/**
 * Fonction pour se connecter au compte adulte
 *
 * @export
 */
export function connexion() {
  if (emplacement) {
    emplacement.innerHTML = "";
  } else {
    console.warn("⚠️ Attention : #bloc_connexion est introuvable. Ce script ne devrait peut-être pas s'exécuter sur cette page.");
  }
  
  // Création du label et input pour l'identifiant
  let Lmail = document.createElement("label");
  Lmail.textContent = "Identifiant :";
  let Imail = document.createElement("input");
  Imail.className = "Imail";
  Imail.placeholder = "exemple@test.com";

  // Création du label et input pour le mot de passe
  let LpassWord = document.createElement("label");
  LpassWord.textContent = "Mot de passe :";
  let IpassWord = document.createElement("input");
  IpassWord.placeholder = "Votre mot de passe";
  IpassWord.type = "password";
  IpassWord.className = "Ipassword";

  // Bouton pour basculer la visibilité du mot de passe
  let togglePasswordButton = document.createElement("img");
  togglePasswordButton.className = "togglePassword";
  togglePasswordButton.src = seePasswordImage;
  togglePasswordButton.style = "margin-left: 5px; width: 5%; background-color: #f4538a; padding: 5px; border-radius: 50%; cursor: pointer;";

  togglePasswordButton.addEventListener("click", () => {
    // Vérifie le type actuel et bascule entre "password" et "text"
    const isPassword = IpassWord.type === "password";
    IpassWord.type = isPassword ? "text" : "password";

    // Change l'icône ou le texte du bouton
    togglePasswordButton.src = isPassword ? hidePasswordImage : seePasswordImage;
  });

  // Ajout de l'événement Enter pour valider la connexion
  IpassWord.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      verifConnexion(Imail.value, IpassWord.value, choixCompte);
    }
  });

  // Bouton "Mot de passe oublié"
  let FpassWord = document.createElement("label");
  FpassWord.textContent = "Mot de passe oublié ?";
  
  let FpassWordButton = document.createElement("button");
  FpassWordButton.className = "resetPasswordButton";
  FpassWordButton.textContent = "Réinitialiser le mot de passe";
  FpassWordButton.addEventListener("click", ForgetPassWord);

  // Boutons pour s'inscrire et se connecter
  let buttonDivInscrConnex = document.createElement("div");
  buttonDivInscrConnex.className = "buttonInscrConnect";

  let inscrire = document.createElement("button");
  inscrire.textContent = "S'inscrire";
  inscrire.addEventListener("click", inscription);

  let connect = document.createElement("button");
  connect.className = "submit";
  connect.textContent = "Se connecter";
  connect.addEventListener("click", () => {
    verifConnexion(Imail.value, IpassWord.value, choixCompte);
  });

  buttonDivInscrConnex.appendChild(inscrire);
  buttonDivInscrConnex.appendChild(connect);

  // Assemblage des éléments dans l'emplacement
  emplacement.appendChild(Lmail);
  emplacement.appendChild(document.createElement("br"));
  emplacement.appendChild(Imail);
  emplacement.appendChild(document.createElement("br"));
  emplacement.appendChild(LpassWord);
  emplacement.appendChild(document.createElement("br"));

  let passwordContainer = document.createElement("div");
  passwordContainer.className = "passwordContainer";
  passwordContainer.appendChild(IpassWord);
  passwordContainer.appendChild(togglePasswordButton);

  emplacement.appendChild(passwordContainer);
  emplacement.appendChild(document.createElement("br"));
  emplacement.appendChild(FpassWord);
  emplacement.appendChild(FpassWordButton);
  emplacement.appendChild(document.createElement("br"));
  emplacement.appendChild(buttonDivInscrConnex);
}


/** Fontion lorsque l'utilisateur oublie son mot de passe */
function ForgetPassWord() {
  let emplacement = document.querySelector("#bloc_connexion");

  if (emplacement) {
    emplacement.innerHTML = "";
  } else {
    console.warn("⚠️ Attention : #bloc_connexion est introuvable. Ce script ne devrait peut-être pas s'exécuter sur cette page.");
  }

  let Lmail = document.createElement("label");
  Lmail.textContent = "Adresse mail de récupération (identifiant) : ";
  let Imail = document.createElement("input");
  Imail.placeholder = "exemple@mail.com";

  
  let envoyerMailRecup = document.createElement("button");
  envoyerMailRecup.textContent = "Envoyer le mail de récupération";
  envoyerMailRecup.className = "envoyerMailRecup";
  envoyerMailRecup.addEventListener("click", () => {
    alert("Mail de confirmation envoyé. Vérifiez vos spams ;)");
  });
  
  let retour = document.createElement("button");
  retour.className = "resetPswd_return";
  retour.textContent = "Annuler";
  retour.addEventListener("click", connexion);
  
  let divButton = document.createElement("div");
  divButton.className = "buttonMailRecupOrReturn";
  divButton.appendChild(retour);
  divButton.appendChild(envoyerMailRecup);

  emplacement.appendChild(Lmail);
  emplacement.appendChild(document.createElement("br"));
  emplacement.appendChild(Imail);
  emplacement.appendChild(document.createElement("br"));
  emplacement.appendChild(divButton);
}

/**
 * Permet de choisir dans quel compte se logger ou d'accéder au compte adulte
 *
 * @export
 * @param {*} adulte
 */
export function choixCompte(adulte) {
  if (emplacement) {
    emplacement.innerHTML = "";
  } else {
    console.warn("⚠️ Attention : #bloc_connexion est introuvable. Ce script ne devrait peut-être pas s'exécuter sur cette page.");
  }
  const divAdult = document.createElement("div");
  divAdult.id = "divAdult";
  const divEnfant = document.createElement("div");
  divEnfant.id = "divEnfant";
  const intituleEnfant = document.createElement('h3');
  intituleEnfant.textContent = "Compte des enfants :";
  divEnfant.appendChild(intituleEnfant)
  const divButton = document.createElement("div");
  divButton.id = "divButton";

  let intituleChoixCompte = document.createElement("h2");
  intituleChoixCompte.style.textAlign = "center";
  intituleChoixCompte.textContent = "Choix des comptes";
  emplacement.appendChild(intituleChoixCompte);

  let intituleAdulte = document.createElement("h3");
  intituleAdulte.textContent = "Votre compte :";

  let compteAdult = document.createElement("button");
  compteAdult.className = "compteAdult";
  compteAdult.textContent = adulte.nom_adulte + " " + adulte.prenom_adulte;

  compteAdult.addEventListener("click", function () {
    // Sauvegarder les informations de l'utilisateur dans localStorage
    localStorage.setItem(
      "userLoggedIn",
      JSON.stringify({
        type: "adulte",
        nom: adulte.nom_adulte,
        prenom: adulte.prenom_adulte,
        username: adulte.username,
        hash: adulte.hash,
      })
    );

    // Sauvegarder le rôle pour le contrôle d'accès
    localStorage.setItem("role", "adulte");

    window.location.href = "/progression.html";
  });

  divAdult.appendChild(intituleAdulte)
  divAdult.appendChild(compteAdult);
  emplacement.appendChild(divAdult);
  
  fetch("https://test-sae.onrender.com/api/enfant")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur de serveur");
      }
      return response.json();
    })
    .then((data) => {
      // Filtrer les enfants liés à l'utilisateur adulte connecté
      const tabEnfants = data.filter(
        (enfant) => enfant.username === adulte.username
      );

      const enfantListeDiv = document.createElement('div');
      enfantListeDiv.className = "enfantListeDiv";

      for (let i = 0; i < tabEnfants.length; i++) {
        // Créer un bouton pour chaque enfant
        let compteEnfant = document.createElement("button");
        compteEnfant.className = "boutonCompteEnfant";
        compteEnfant.textContent = tabEnfants[i].nom_enfant + " " + tabEnfants[i].prenom_enfant;

        
        enfantListeDiv.appendChild(compteEnfant);
        

        // Informations de l'enfant connecté
        const enfantConnecte = {
          id: tabEnfants[i].id_enfant,
          nom: tabEnfants[i].nom_enfant,
          prenom: tabEnfants[i].prenom_enfant,
          dateNaissance: tabEnfants[i].date_naissance,
          genre: tabEnfants[i].genre,
          username: tabEnfants[i].username,
          dateCreation: tabEnfants[i].date_creation,
        };

        // Ajouter un gestionnaire d'événements au clic
        compteEnfant.addEventListener("click", function () {
          console.log(enfantConnecte);

          // Sauvegarder dans sessionStorage
          sessionStorage.setItem(
            "enfantConnecte",
            JSON.stringify(enfantConnecte)
          );

          // Sauvegarder dans localStorage pour l'accueil
          localStorage.setItem(
            "userLoggedIn",
            JSON.stringify({
              type: "enfant",
              nom: enfantConnecte.nom,
              prenom: enfantConnecte.prenom,
            })
          );

            // Démarrer le chronomètre
            const startTime = Date.now();
            localStorage.setItem("chronoStart", startTime.toString());

            // Rediriger vers la page d'accueil
            window.location.href = "/accueil.html";
        });

        // Ajouter le bouton dans le conteneur parent
        divEnfant.appendChild(enfantListeDiv);
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des enfants :", error);
    });
  
  emplacement.appendChild(document.createElement('hr'));
  emplacement.appendChild(divEnfant);

  let ajoutCompte = document.createElement("button");
  ajoutCompte.textContent = "Ajouter un compte";

  ajoutCompte.addEventListener("click", () => InscriptionEnfant(adulte));

  let retour = document.createElement("button");
  retour.textContent = "Retour";

  retour.addEventListener("click", connexion);

  divButton.appendChild(retour);
  divButton.appendChild(ajoutCompte);

  emplacement.appendChild(document.createElement('hr'));
  emplacement.appendChild(divButton);
}

export function startChrono() {
  // Vérifie si le chrono est déjà actif
  if (localStorage.getItem("chronoStatus") === "active") return;

  const existingElapsedTime = parseInt(localStorage.getItem("chronoElapsedTime"), 10) || 0;
  const startTime = Date.now();
  localStorage.setItem("chronoStart", startTime);
  localStorage.setItem("chronoStatus", "active");

  window.chronoInterval = setInterval(() => {
    const elapsedTime = Date.now() - startTime + existingElapsedTime;
    localStorage.setItem("chronoElapsedTime", elapsedTime); // Mettre à jour le temps total
    console.log("Temps écoulé :", formatTime(elapsedTime)); // Mettre à jour l'affichage si nécessaire
  }, 1000);
}

export function stopChrono() 
{
  if (localStorage.getItem("chronoStatus") !== "active") return;

  clearInterval(window.chronoInterval);
  window.chronoInterval = null; // Réinitialise le gestionnaire global
  const startTime = parseInt(localStorage.getItem("chronoStart"), 10);
  const elapsedTime = Date.now() - startTime + (parseInt(localStorage.getItem("chronoElapsedTime"), 10) || 0);

  localStorage.setItem("chronoElapsedTime", elapsedTime);
  localStorage.setItem("chronoStatus", "stopped");
  console.log("Chrono arrêté. Temps total :", formatTime(elapsedTime));
}


export function resetChrono() 
{
  clearInterval(window.chronoInterval);
  localStorage.removeItem("chronoStart");
  localStorage.removeItem("chronoElapsedTime");
  localStorage.setItem("chronoStatus", "stopped");
  console.log("Chrono réinitialisé.");
}

export function formatTime(ms) 
{
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}
