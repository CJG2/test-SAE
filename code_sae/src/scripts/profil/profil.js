import { loadImages } from "./../inclusionImage.js";
import {
  verifierEmail,
  verifierPassword,
  verifierNumTel,
  fetchPays,
  updateDays,
} from "../connexion/inscrire.js";
import { hachage } from "../connexion/hachage.js";

//importation des styles
import "./../../styles/main.css"; // feuille de style générale
import "./../../styles/caroussel.css";
import "./../../styles/navigation.css";
import "./../../styles/profil.css";

import seePasswordImage from "./../../assets/icons/seePasswordEye.png";
import hidePasswordImage from "./../../assets/icons/hidePasswordEye.png";

const adulteConnecte = JSON.parse(sessionStorage.getItem("adulteConnecte"));
var emplacement = document.createElement("div");
emplacement.id = "profil";

document.addEventListener("DOMContentLoaded", loadImages);

document.addEventListener("DOMContentLoaded", () => {
  emplacement = document.querySelector("#profil");

  const userRole = localStorage.getItem("role");

  // nécessite que le compte connecté soit un compte adulte
  if (userRole !== "adulte") {
    window.location.href = "accueil.html";
    return;
  }

  loadImages();
  profilParent();
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

/**
 * @async
 * Fonction qui permet de consulter et modifier le profil d'un Responsable
 */
async function profilParent() 
{
  const adulteConnecte = JSON.parse(sessionStorage.getItem("adulteConnecte"));
  
  let buttonContainer = document.querySelector("#changerProfil");

  buttonContainer.innerHTML = "";
  emplacement.innerHTML = "";

  let compteParent = document.createElement("button");
  compteParent.className = "compteParentProfil";
  compteParent.textContent = adulteConnecte.nom + " " + adulteConnecte.prenom;
  console.log(compteParent);
  compteParent.addEventListener("click", () => profilParent());
  buttonContainer.appendChild(compteParent);
  buttonContainer.appendChild(document.createElement("br"));

  const tabEnfants = await recupererEnfantsDUnResponsable();
  for (let i = 0; i < tabEnfants.length; i++) 
  {
    let compte = document.createElement("button");
    compte.className = "compteEnfantProfil";
    compte.textContent = tabEnfants[i].prenom_enfant;
    console.log(compte);
    console.log(tabEnfants[i]);
    compte.addEventListener("click", () => profilEnfant(tabEnfants[i]));
    buttonContainer.appendChild(compte);
  }

  let form = document.createElement("form");

  let parent = document.createElement("h3");
  parent.className = "responsableEnfantLabel";
  parent.textContent = "Informations du responsable de l'enfant :";
  form.appendChild(parent);

  // nom du responsable
  let labelNom = document.createElement("label");
  labelNom.textContent = "Nom :";
  labelNom.className = "labelNom";
  let inputNom = document.createElement("input");
  inputNom.setAttribute("required", "");
  inputNom.value = adulteConnecte.nom;
  inputNom.type = "text";
  inputNom.className = "inputNom";
  let divNom = document.createElement("div");
  divNom.className = "divNom";
  divNom.appendChild(labelNom);
  divNom.appendChild(inputNom);
  form.appendChild(divNom);

  // prénom du responsable
  let labelPrenom = document.createElement("label");
  labelPrenom.textContent = "Prénom :";
  labelPrenom.className = "labelPrenom";
  let inputPrenom = document.createElement("input");
  inputPrenom.setAttribute("required", "");
  inputPrenom.value = adulteConnecte.prenom;
  inputPrenom.type = "text";
  inputPrenom.className = "inputPrenom";
  let divPrenom = document.createElement("div");
  divPrenom.className = "divPrenom";
  divPrenom.appendChild(labelPrenom);
  divPrenom.appendChild(inputPrenom);
  form.appendChild(document.createElement("hr"));
  form.appendChild(divPrenom);

  // date de naissance du responsable
  let labelDateNaiss = document.createElement("label");
  labelDateNaiss.textContent = "Date de naissance :";

  let dateString = adulteConnecte.dateNaissance;
  let date = new Date(dateString);
  const annee = date.getUTCFullYear(); // Année
  const month = date.getUTCMonth() + 1; // Mois (commence à 0, donc + 1)
  const day = date.getUTCDate(); // Jour
  const mois = month.toString().padStart(2, "0");
  const jour = day.toString().padStart(2, "0");

  let inputDateNaissJour = document.createElement("select");
  let inputDateNaissMois = document.createElement("select");
  let inputDateNaissAnnee = document.createElement("select");

  let dateNaiss = `${annee}/${mois}/${jour}`;
  inputDateNaissJour.setAttribute("required", "");

  for (let i = 1; i <= 31; i++) {
    const option = document.createElement("option");
    if (i < 10) {
      option.value = "0" + i;
      option.textContent = "0" + i;
    } else {
      option.value = i;
      option.textContent = i;
    }
    inputDateNaissJour.appendChild(option);
  }
  inputDateNaissJour.addEventListener("change", function () {
    dateNaiss =
      inputDateNaissAnnee.value +
      "/" +
      inputDateNaissMois.value +
      "/" +
      inputDateNaissJour.value;
  });

  inputDateNaissJour.value = jour;
  let slash1 = document.createElement("label");
  slash1.textContent = "/";

  inputDateNaissMois.setAttribute("required", "");

  for (let i = 1; i <= 12; i++) {
    const option = document.createElement("option");
    if (i < 10) {
      option.value = "0" + i;
      option.textContent = "0" + i;
    } else {
      option.value = i;
      option.textContent = i;
    }
    inputDateNaissMois.appendChild(option);
  }

  inputDateNaissMois.value = mois;
  inputDateNaissMois.addEventListener("change", function () {
    updateDays(
      inputDateNaissJour,
      parseInt(inputDateNaissJour.value),
      parseInt(this.value),
      parseInt(inputDateNaissAnnee.value)
    );
    dateNaiss =
      inputDateNaissAnnee.value +
      "/" +
      inputDateNaissMois.value +
      "/" +
      inputDateNaissJour.value;
  });

  inputDateNaissMois.value = mois;
  let slash2 = document.createElement("label");
  slash2.textContent = "/";

  inputDateNaissAnnee.setAttribute("required", "");

  const dateCourante = new Date();
  const anneeCourante = dateCourante.getFullYear();

  for (let i = anneeCourante - 18; i >= anneeCourante - 100; i--) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    inputDateNaissAnnee.appendChild(option);
  }

  inputDateNaissAnnee.addEventListener("change", function () {
    updateDays(
      inputDateNaissJour,
      parseInt(inputDateNaissJour.value),
      parseInt(inputDateNaissMois.value),
      parseInt(this.value)
    );
    dateNaiss =
      inputDateNaissAnnee.value +
      "/" +
      inputDateNaissMois.value +
      "/" +
      inputDateNaissJour.value;
  });

  inputDateNaissAnnee.value = annee;
  let divNaissanceParent = document.createElement("div");
  divNaissanceParent.className = "divNaissanceParent";

  let selectsNaissanceParent = document.createElement("div");
  selectsNaissanceParent.className = "selectsNaissanceParent";

  divNaissanceParent.appendChild(labelDateNaiss);
  selectsNaissanceParent.appendChild(inputDateNaissJour);
  selectsNaissanceParent.appendChild(slash1);
  selectsNaissanceParent.appendChild(inputDateNaissMois);
  selectsNaissanceParent.appendChild(slash2);
  selectsNaissanceParent.appendChild(inputDateNaissAnnee);
  divNaissanceParent.appendChild(selectsNaissanceParent);
  form.appendChild(document.createElement("hr"));
  form.appendChild(divNaissanceParent);

  // Genre du responsable
  let labelCivilite = document.createElement("label");
  labelCivilite.textContent = "Civilité :";
  labelCivilite.className = "labelCivilite";
  labelCivilite.setAttribute("for", "civilite");
  let inputCivilite = document.createElement("select");
  inputCivilite.id = "civilite";
  inputCivilite.setAttribute("required", "");

  // Option Homme
  let optionHomme = document.createElement("option");
  optionHomme.textContent = "Homme";
  optionHomme.value = "H";

  // Option Femme
  let optionFemme = document.createElement("option");
  optionFemme.textContent = "Femme";
  optionFemme.value = "F";

  if (adulteConnecte.genre === "H") optionHomme.selected = true;
  else optionFemme.selected = true;

  // Ajouter les options au select
  inputCivilite.appendChild(optionHomme);
  inputCivilite.appendChild(optionFemme);

  let genreDiv = document.createElement("div");
  genreDiv.className = "genreDiv";
  genreDiv.appendChild(labelCivilite);
  genreDiv.appendChild(inputCivilite);

  form.appendChild(document.createElement("hr"));
  form.appendChild(genreDiv);

  // email du responsable
  let labelEmail = document.createElement("label");
  labelEmail.textContent = "Adresse mail :";
  labelEmail.className = "labelEmail";
  let inputEmail = document.createElement("input");
  inputEmail.setAttribute("required", "");
  inputEmail.type = "email";
  inputEmail.value = adulteConnecte.username;
  inputEmail.className = "inputEmail";
  let emailDiv = document.createElement("div");
  emailDiv.className = "emailDiv";
  emailDiv.appendChild(labelEmail);
  emailDiv.appendChild(inputEmail);
  form.appendChild(document.createElement("hr"));
  form.appendChild(emailDiv);

  // mot de passe du responsable
  let labelPassword = document.createElement("label");
  labelPassword.textContent = "Mot de passe :";
  labelPassword.className = "labelPassword";
  let modifPassword = document.createElement("button");
  modifPassword.textContent = "Modifier mon mot de passe";
  modifPassword.addEventListener("click", verifierMotDePasse);

  let passwordDiv = document.createElement("div");
  passwordDiv.className = "passwordDiv";
  passwordDiv.appendChild(labelPassword);
  passwordDiv.appendChild(modifPassword);
  form.appendChild(document.createElement("hr"));
  form.appendChild(passwordDiv);

  // numéro de téléphone du responsable
  let labelNum = document.createElement("label");
  labelNum.textContent = "Numéro de téléphone :";
  labelNum.className = "labelNum";
  let inputNum = document.createElement("input");
  inputNum.setAttribute("required", "");
  inputNum.setAttribute("type", "tel");
  inputNum.className = "inputNum";
  inputNum.value = adulteConnecte.tel;
  inputNum.setAttribute("pattern", "^0[1-9]([ .-]?[0-9]{2}){4}$");
  let telephoneDiv = document.createElement("div");
  telephoneDiv.className = "telephoneDiv";
  telephoneDiv.appendChild(labelNum);
  telephoneDiv.appendChild(inputNum);
  form.appendChild(document.createElement("hr"));
  form.appendChild(telephoneDiv);

  // pays du reponsable
  let labelPays = document.createElement("label");
  labelPays.textContent = "Pays :";
  labelPays.className = "labelPays";

  let inputPays = document.createElement("select");
  inputPays.setAttribute("required", "");
  inputPays.id = "idPays";
  fetchPays(inputPays).then(() => {
    inputPays.value = adulteConnecte.nationalite;
  });

  let paysDiv = document.createElement("div");
  paysDiv.className = "paysDiv";
  paysDiv.appendChild(labelPays);
  paysDiv.appendChild(inputPays);
  form.appendChild(document.createElement("hr"));
  form.appendChild(paysDiv);

  let annuler = document.createElement("button");
  annuler.type = "button";
  annuler.textContent = "Annuler";

  let enregistrer = document.createElement("button");
  enregistrer.textContent = "Enregistrer";
  enregistrer.type = "submit";
  enregistrer.className = "enregistrerButton";

  enregistrer.addEventListener("click", () => {
    miseAJourAdulte(
      inputEmail.value,
      inputNom.value,
      adulteConnecte.hash,
      adulteConnecte.sel,
      inputPrenom.value,
      dateNaiss,
      inputCivilite.value,
      inputPays.value,
      inputNum.value,
      adulteConnecte.username
    );
  });

  let buttonsProfilDiv = document.createElement("div");
  buttonsProfilDiv.className = "buttonsProfilDiv";
  buttonsProfilDiv.appendChild(annuler);
  buttonsProfilDiv.appendChild(enregistrer);

  annuler.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Permet un défilement fluide
    });
    profilParent();
  });

  form.appendChild(document.createElement("hr"));
  form.appendChild(buttonsProfilDiv);

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const isFormValid = form.checkValidity();
    const isEmailValid = verifierEmail(inputEmail);
    const isNumValid = verifierNumTel(inputNum);

    if (isFormValid && isEmailValid && isNumValid)
      console.log("Formulaire correct");
  });

  emplacement.appendChild(document.createElement("br"));
  emplacement.appendChild(document.createElement("br"));
  emplacement.appendChild(form);
}

/**
 * @async
 * Fonction qui permet de consulter et modifier le profil d'un Enfant
 */
async function profilEnfant(enfant) 
{
  let buttonContainer = document.querySelector("#changerProfil");

  buttonContainer.innerHTML = "";
  emplacement.innerHTML = "";

  let compteParent = document.createElement("button");
  compteParent.className = "compteParentProfil";
  compteParent.textContent = adulteConnecte.nom + " " + adulteConnecte.prenom;
  console.log(compteParent);
  compteParent.addEventListener("click", () => profilParent());
  buttonContainer.appendChild(compteParent);
  buttonContainer.appendChild(document.createElement("br"));

  const tabEnfants = await recupererEnfantsDUnResponsable();
  for (let i = 0; i < tabEnfants.length; i++) 
  {
    let compte = document.createElement("button");
    compte.className = "compteEnfantProfil";
    compte.textContent = tabEnfants[i].prenom_enfant;
    console.log(compte);
    console.log(tabEnfants[i]);
    compte.addEventListener("click", () => profilEnfant(tabEnfants[i]));
    buttonContainer.appendChild(compte);
  }

  let form = document.createElement("form");

  let infoEnfant = document.createElement("h3");
  infoEnfant.className = "enfantLabel";
  infoEnfant.textContent = "Informations de l'enfant :";
  form.appendChild(infoEnfant);

  // nom de l'enfant
  let labelEnfantNom = document.createElement("label");
  labelEnfantNom.textContent = "Nom :";
  labelEnfantNom.className = "labelEnfantNom";
  let inputEnfantNom = document.createElement("input");
  inputEnfantNom.setAttribute("required", "");
  inputEnfantNom.value = enfant.nom_enfant;
  inputEnfantNom.type = "text";
  inputEnfantNom.className = "inputNom";
  let divNom = document.createElement("div");
  divNom.className = "inputEnfantNom";
  divNom.appendChild(labelEnfantNom);
  divNom.appendChild(inputEnfantNom);
  form.appendChild(divNom);

  // prénom de l'Enfant
  let labelEnfantPrenom = document.createElement("label");
  labelEnfantPrenom.textContent = "Prénom :";
  labelEnfantPrenom.className = "labelEnfantPrenom";
  let inputEnfantPrenom = document.createElement("input");
  inputEnfantPrenom.setAttribute("required", "");
  inputEnfantPrenom.value = enfant.prenom_enfant;
  inputEnfantPrenom.type = "text";
  inputEnfantPrenom.className = "inputEnfantPrenom";
  let divPrenom = document.createElement("div");
  divPrenom.className = "divPrenom";
  divPrenom.appendChild(labelEnfantPrenom);
  divPrenom.appendChild(inputEnfantPrenom);
  form.appendChild(document.createElement("hr"));
  form.appendChild(divPrenom);

  // Date de naissance de l'enfant
  let labelDateNaiss = document.createElement("label");
  labelDateNaiss.textContent = "Date de naissance :";

  const dateString = enfant.date_naissance;
  const date = new Date(dateString);
  const annee = date.getUTCFullYear(); // Année
  const month = date.getUTCMonth() + 1; // Mois (commence à 0, donc + 1)
  const day = date.getUTCDate(); // Jour
  const mois = month.toString().padStart(2, "0");
  const jour = day.toString().padStart(2, "0");

  let inputEnfantDateNaissJour = document.createElement("select");
  let inputEnfantDateNaissMois = document.createElement("select");
  let inputEnfantDateNaissAnnee = document.createElement("select");

  let dateNaiss = `${annee}/${mois}/${jour}`;
  inputEnfantDateNaissJour.setAttribute("required", "");

  // Ajouter les options pour les jours
  for (let i = 1; i <= 31; i++) {
    const option = document.createElement("option");
    option.value = i < 10 ? `0${i}` : `${i}`;
    option.textContent = option.value;
    inputEnfantDateNaissJour.appendChild(option);
  }
  inputEnfantDateNaissJour.value = jour; // Valeur par défaut

  // Mettre à jour `dateNaiss` lorsque le jour change
  inputEnfantDateNaissJour.addEventListener("change", function () {
    dateNaiss =
      inputEnfantDateNaissAnnee.value +
      "/" +
      inputEnfantDateNaissMois.value +
      "/" +
      inputEnfantDateNaissJour.value;
  });

  let slash1 = document.createElement("label");
  slash1.textContent = "/";

  inputEnfantDateNaissMois.setAttribute("required", "");

  // Ajouter les options pour les mois
  for (let i = 1; i <= 12; i++) {
    const option = document.createElement("option");
    option.value = i < 10 ? `0${i}` : `${i}`;
    option.textContent = option.value;
    inputEnfantDateNaissMois.appendChild(option);
  }
  inputEnfantDateNaissMois.value = mois; // Valeur par défaut

  // Mettre à jour `dateNaiss` lorsque le mois change
  inputEnfantDateNaissMois.addEventListener("change", function () {
    updateDays(
      inputEnfantDateNaissJour,
      parseInt(inputEnfantDateNaissJour.value),
      parseInt(this.value),
      parseInt(inputEnfantDateNaissAnnee.value)
    );
    dateNaiss =
      inputEnfantDateNaissAnnee.value +
      "/" +
      inputEnfantDateNaissMois.value +
      "/" +
      inputEnfantDateNaissJour.value;
  });

  let slash2 = document.createElement("label");
  slash2.textContent = "/";

  inputEnfantDateNaissAnnee.setAttribute("required", "");

  // Ajouter les options pour les années
  const dateCourante = new Date();
  const anneeCourante = dateCourante.getFullYear();

  for (let i = anneeCourante - 3; i >= anneeCourante - 18; i--) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    inputEnfantDateNaissAnnee.appendChild(option);
  }
  inputEnfantDateNaissAnnee.value = annee; // Valeur par défaut

  // Mettre à jour `dateNaiss` lorsque l'année change
  inputEnfantDateNaissAnnee.addEventListener("change", function () {
    updateDays(
      inputEnfantDateNaissJour,
      parseInt(inputEnfantDateNaissJour.value),
      parseInt(inputEnfantDateNaissMois.value),
      parseInt(this.value)
    );
    dateNaiss =
      inputEnfantDateNaissAnnee.value +
      "/" +
      inputEnfantDateNaissMois.value +
      "/" +
      inputEnfantDateNaissJour.value;
  });

  let divNaissanceEnfant = document.createElement("div");
  divNaissanceEnfant.className = "divNaissanceEnfant";

  let selectsNaissanceEnfant = document.createElement("div");
  selectsNaissanceEnfant.className = "selectsNaissanceEnfant";

  divNaissanceEnfant.appendChild(labelDateNaiss);
  selectsNaissanceEnfant.appendChild(inputEnfantDateNaissJour);
  selectsNaissanceEnfant.appendChild(slash1);
  selectsNaissanceEnfant.appendChild(inputEnfantDateNaissMois);
  selectsNaissanceEnfant.appendChild(slash2);
  selectsNaissanceEnfant.appendChild(inputEnfantDateNaissAnnee);
  divNaissanceEnfant.appendChild(selectsNaissanceEnfant);
  form.appendChild(document.createElement("hr"));
  form.appendChild(divNaissanceEnfant);

  // Genre de l'Enfant
  let labelEnfantCivilite = document.createElement("label");
  labelEnfantCivilite.textContent = "Civilité :";
  labelEnfantCivilite.className = "labelEnfantCivilite";
  labelEnfantCivilite.setAttribute("for", "civilite");
  let inputEnfantCivilite = document.createElement("select");
  inputEnfantCivilite.id = "civilite";
  inputEnfantCivilite.setAttribute("required", "");

  // Option Homme
  let optionHomme = document.createElement("option");
  optionHomme.textContent = "Garçon";
  optionHomme.value = "M";

  // Option Femme
  let optionFemme = document.createElement("option");
  optionFemme.textContent = "Fille";
  optionFemme.value = "F";

  if (enfant.genre === "M") optionHomme.selected = true;
  else optionFemme.selected = true;

  // Ajouter les options au select
  inputEnfantCivilite.appendChild(optionHomme);
  inputEnfantCivilite.appendChild(optionFemme);

  let genreDiv = document.createElement("div");
  genreDiv.className = "genreDiv";
  genreDiv.appendChild(labelEnfantCivilite);
  genreDiv.appendChild(inputEnfantCivilite);

  form.appendChild(document.createElement("hr"));
  form.appendChild(genreDiv);

  let annuler = document.createElement("button");
  annuler.type = "button";
  annuler.textContent = "Annuler";

  let enregistrer = document.createElement("button");
  enregistrer.textContent = "Enregistrer";
  enregistrer.type = "submit";
  enregistrer.className = "inscrireButton";
  enregistrer.addEventListener("click", () => {
    miseAJourEnfant(
      inputEnfantNom.value,
      inputEnfantPrenom.value,
      dateNaiss,
      inputEnfantCivilite.value,
      enfant.id_enfant
    );
  });

  let buttonsProfilDiv = document.createElement("div");
  buttonsProfilDiv.className = "buttonsProfilDiv";
  buttonsProfilDiv.appendChild(annuler);
  buttonsProfilDiv.appendChild(enregistrer);

  annuler.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Permet un défilement fluide
    });
    profilEnfant(enfant);
  });

  form.appendChild(document.createElement("hr"));
  form.appendChild(buttonsProfilDiv);

  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  emplacement.appendChild(document.createElement("br"));
  emplacement.appendChild(document.createElement("br"));

  //emplacement.appendChild(titre);
  emplacement.appendChild(document.createElement("br"));
  emplacement.appendChild(document.createElement("br"));
  emplacement.appendChild(form);
}

/**
 * Fonction qui demande à l'utilisateur de saisir son mot de passe actuel pour accèder à la modification de son mot de passe
 */
function verifierMotDePasse() {
  let buttonContainer = document.querySelector("#changerProfil");

  buttonContainer.innerHTML = "";
  emplacement.innerHTML = "";

  let labelConfirmPassword = document.createElement("label");
  labelConfirmPassword.textContent = "Saisissez votre mot de passe actuel : ";

  let inputConfirmPassword = document.createElement("input");
  inputConfirmPassword.setAttribute("required", "");
  inputConfirmPassword.type = "password";
  inputConfirmPassword.name = "password";
  inputConfirmPassword.id = "password";

  // Création du bouton pour basculer la visibilité
  let togglePasswordButton = document.createElement("img");
  togglePasswordButton.className = "togglePassword";
  togglePasswordButton.src = seePasswordImage; // Image pour afficher le mot de passe
  togglePasswordButton.style =
    "margin-left: 5px; width: 5%; background-color: #f4538a; padding: 5px; border-radius: 50%; cursor: pointer;";

  // Ajout de l'événement pour basculer la visibilité du mot de passe
  togglePasswordButton.addEventListener("click", () => {
    // Vérifie le type actuel et bascule entre "password" et "text"
    const isPassword = inputConfirmPassword.type === "password";
    inputConfirmPassword.type = isPassword ? "text" : "password";

    // Change l'image de l'icône en fonction de l'état
    togglePasswordButton.src = isPassword
      ? hidePasswordImage
      : seePasswordImage;
  });

  let suivant = document.createElement("button");
  suivant.textContent = "Suivant";
  suivant.addEventListener("click", () => {
    if (
      adulteConnecte.hash ===
      hachage(inputConfirmPassword.value + adulteConnecte.sel, false)
    ) {
      console.log("Hash BDD : " + adulteConnecte.hash);
      console.log(
        "Nouveau Hash : " +
          hachage(inputConfirmPassword.value + adulteConnecte.sel, false)
      );
      modifierMotDePasse();
    }
  });

  let retour = document.createElement("button");
  retour.textContent = "Retour";
  retour.addEventListener("click", profilParent);

  let divButton = document.createElement("div");

  divButton.appendChild(retour);
  divButton.appendChild(suivant);
  emplacement.appendChild(labelConfirmPassword);
  emplacement.appendChild(inputConfirmPassword);
  emplacement.appendChild(togglePasswordButton);
  emplacement.appendChild(divButton);
}

/**
 * Fonction qui permet à l'utilisateur de saisir son nouveau mot de passe
 */
function modifierMotDePasse() {
  let buttonContainer = document.querySelector("#changerProfil");

  buttonContainer.innerHTML = "";
  emplacement.innerHTML = "";

  let labelNewPassword = document.createElement("label");
  labelNewPassword.textContent = "Saisissez votre mot nouveau mot de passe : ";

  let inputNewPassword = document.createElement("input");
  inputNewPassword.setAttribute("required", "");
  inputNewPassword.type = "password";
  inputNewPassword.name = "password";
  inputNewPassword.id = "password";

  let informationPassword = document.createElement("p");
  informationPassword.style =
    "font-family: arial, sans-serif; font-size: 12px; color: #666;";
  informationPassword.textContent =
    "Le mot de passe doit contenir au minimum : 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial parmi : @ $ ! % * ? & . - _ ( )";

  // Création du bouton pour basculer la visibilité
  let togglePasswordButton = document.createElement("img");
  togglePasswordButton.className = "togglePassword";
  togglePasswordButton.src = seePasswordImage; // Image pour afficher le mot de passe
  togglePasswordButton.style =
    "margin-left: 5px; width: 5%; background-color: #f4538a; padding: 5px; border-radius: 50%; cursor: pointer;";

  // Ajout de l'événement pour basculer la visibilité du mot de passe
  togglePasswordButton.addEventListener("click", () => {
    // Vérifie le type actuel et bascule entre "password" et "text"
    const isPassword = inputNewPassword.type === "password";
    inputNewPassword.type = isPassword ? "text" : "password";

    // Change l'image de l'icône en fonction de l'état
    togglePasswordButton.src = isPassword
      ? hidePasswordImage
      : seePasswordImage;
  });

  let suivant = document.createElement("button");
  suivant.textContent = "Suivant";
  suivant.addEventListener("click", () => {
    if (verifierPassword(inputNewPassword)) {
      const tabMDP = hachage(inputNewPassword.value, true);
      miseAJourMDPAdulte(tabMDP.hash, tabMDP.sel, adulteConnecte.username);
    }
  });

  let annuler = document.createElement("button");
  annuler.textContent = "Annuler";
  annuler.addEventListener("click", profilParent);

  let divButton = document.createElement("div");

  divButton.appendChild(annuler);
  divButton.appendChild(suivant);
  emplacement.appendChild(labelNewPassword);
  emplacement.appendChild(inputNewPassword);
  emplacement.appendChild(togglePasswordButton);
  emplacement.appendChild(informationPassword);
  emplacement.appendChild(divButton);
}

/**
 * Fonction qui permet de récupérer les enfants selon un responsable
 *
 * @export
 * @async
 */
export async function recupererEnfantsDUnResponsable() {
  const reponse = await fetch("https://test-sae.onrender.com/api/enfant");

  const enfants = await reponse.json();
  const tabenfants = enfants.filter(
    (enfant) => enfant.username === adulteConnecte.username
  );
  return tabenfants;
}

/**
 * Fonction qui permet de récupérer un adulte selon son username (mail)
 *
 * @export
 * @async
 */
export async function recupererResponsable(nouveauMail) {
  try {
    const response = await fetch(
      "https://test-sae.onrender.com/api/responsable"
    );
    const responsables = await response.json();

    const leResponsable = responsables.find(
      (responsable) => responsable.username === nouveauMail
    ); // Utilisez `find` au lieu de `filter`

    if (!leResponsable) {
      console.error("Responsable non trouvé avec ce username :", nouveauMail);
      return;
    }

    const adulteConnecte = {
      username: leResponsable.username,
      hash: leResponsable.hash,
      sel: leResponsable.sel,
      nom: leResponsable.nom_adulte,
      prenom: leResponsable.prenom_adulte,
      dateNaissance: leResponsable.date_naissance,
      genre: leResponsable.genre,
      nationalite: leResponsable.nationalite,
      dateCreation: leResponsable.date_creation,
      tel: leResponsable.numeroTelephone,
    };

    sessionStorage.setItem("adulteConnecte", JSON.stringify(adulteConnecte));
    console.log("Adulte connecté mis à jour :", adulteConnecte);
  } catch (error) {
    console.error("Erreur lors de la récupération du responsable :", error);
  }
}

/**
 * Fonction qui permet de mettre à jour les informations d'un enfant
 *
 * @async
 * @param newNom
 * @param newPrenom
 * @param newDateNaiss
 * @param newGenre
 * @param dys
 * @param id
 */
async function miseAJourEnfant(newNom, newPrenom, newDateNaiss, newGenre, dys, id) {
  console.log("Données envoyées :", {
    newNom,
    newPrenom,
    newDateNaiss,
    newGenre,
    dys,
    id,
  });
  try {
    const response = await fetch(
      "https://test-sae.onrender.com/api/enfant/update",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newNom, newPrenom, newDateNaiss, newGenre, dys, id }),
      }
    );

    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

    const data = await response.json();
    console.log("Réponse du serveur :", data);

    if (data.success) {
      console.log("La modification des données de l'Enfant est réussie.");
      const tabEnfants = await recupererEnfantsDUnResponsable();
      const enfant = tabEnfants.find((enf) => enf.id_enfant === id);
      window.scrollTo({
        top: 0,
        behavior: "smooth", // Permet un défilement fluide
      });
      profilEnfant(enfant);
    } else alert("Erreur lors de la mise à jour des informations de l'Enfant.");
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour des informations de l'Enfant :",
      error
    );
    alert("Une erreur est survenue : " + error.message);
  }
}

/**
 * Fonction qui permet de mettre à jour le username des enfants selon le username de leurs responsable
 *
 * @async
 * @param newUsername
 * @param username
 */
async function miseAJourUsernameEnfant(newUsername, username) {
  console.log("Données envoyées :", { newUsername, username });

  fetch("https://test-sae.onrender.com/api/enfant/updateUsername", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newUsername, username }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Réponse du serveur :", data);
      if (data.success)
        console.log("Mise à jour du username de l'Enfant réussi.");
      else alert("Erreur lors de mise à jour du username de l'enfant.");
    })
    .catch((error) => {
      console.error(
        "Erreur lors de mise à jour du username de l'enfant :",
        error
      );
      alert("Une erreur est survenue : " + error.message);
    });
}

/**
 * Fonction qui permet de modifier les informations d'un responsable
 * @async
 * @param newUsername
 * @param newNom
 * @param hash
 * @param sel
 * @param newPrenom
 * @param newDateNaiss
 * @param newGenre
 * @param newNationalite
 * @param telephone
 * @param username
 */
async function miseAJourAdulte(
  newUsername,
  newNom,
  hash,
  sel,
  newPrenom,
  newDateNaiss,
  newGenre,
  newNationalite,
  telephone,
  username
) {
  console.log("Données envoyées :", {
    newUsername,
    newNom,
    hash,
    sel,
    newPrenom,
    newDateNaiss,
    newGenre,
    newNationalite,
    telephone,
    username,
  });

  try {
    const response = await fetch("https://test-sae.onrender.com/api/responsable/update",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newUsername,
          newNom,
          hash,
          sel,
          newPrenom,
          newDateNaiss,
          newGenre,
          newNationalite,
          telephone,
          username,
        }),
      }
    );

    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

    const data = await response.json();
    console.log("Réponse du serveur :", data);

    if (data.success) {
      console.log("La modification des données du responsable est réussie.");

      // Mettre à jour les informations stockées
      await recupererResponsable(newUsername);

      // Mettre à jour les enfants si le username a changé
      if (newUsername !== username) {
        await miseAJourUsernameEnfant(newUsername, username);
        await recupererEnfantsDUnResponsable();
      }

      window.scrollTo({
        top: 0,
        behavior: "smooth", // Permet un défilement fluide
      });
      // Recharger l'interface avec les nouvelles données
      profilParent();
    } else
      alert("Erreur lors de la mise à jour des informations du responsable.");
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour des informations du responsable :",
      error
    );
    alert("Une erreur est survenue : " + error.message);
  }
}

/**
 * Fonction qui permet de modifier le mot de passe du responsable
 *
 * @async
 * @param newPassword
 * @param newSel
 * @param username
 */
function miseAJourMDPAdulte(newPassword, newSel, username) {
  console.log("Données envoyées :", { newPassword, newSel, username });

  fetch("https://test-sae.onrender.com/api/responsable/updateMDP", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newPassword, newSel, username }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Réponse du serveur :", data);
      if (data.success) window.location.href = "/connexion.html";
      else alert("Erreur lors de mise à jour du mot de passe du responsable.");
    })
    .catch((error) => {
      console.error(
        "Erreur lors de mise à jour du mot de passe du responsable. :",
        error
      );
      alert("Une erreur est survenue : " + error.message);
    });
}

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

      window.location.href = "/connexion.html";
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
