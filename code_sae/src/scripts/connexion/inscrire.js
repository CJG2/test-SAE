import { connexion, choixCompte } from "./connexion.js";
import { hachage } from "./hachage.js";
import { Adulte, Enfant } from "../classes.js";

import seePasswordImage from "./../../assets/icons/seePasswordEye.png";
import hidePasswordImage from "./../../assets/icons/hidePasswordEye.png";


import "./../../styles/inscription.css";


/**
 * Fonction pour mettre à jour les jours d'un mois en fonction de celui ci (28 ou 29 pour février, 31 pour janvier, etc...)
 *
 * @export
 * @param {*} inputDateNaissJour
 * @param {*} jourSelec
 * @param {*} moisSelect
 * @param {*} anneeSelect
 */
export function updateDays(inputDateNaissJour, jourSelec, moisSelect, anneeSelect) {
  let tabMois = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  inputDateNaissJour.innerHTML = "";

  let nbrJours = tabMois[moisSelect - 1];

  if
    (
    moisSelect === 2 &&
    anneeSelect % 4 === 0 &&
    (anneeSelect % 100 !== 0 || anneeSelect % 400 === 0)
  )
    nbrJours = 29;

  for (let i = 1; i <= nbrJours; i++) {
    const option = document.createElement("option");
    if (i < 10) {
      option.value = "0" + i;
      option.textContent = "0" + i;
    }
    else {
      option.value = i;
      option.textContent = i;
    }
    inputDateNaissJour.appendChild(option);
  }

  const jourString = jourSelec < 10 ? "0" + jourSelec : jourSelec.toString();
  if (jourSelec <= nbrJours)
    inputDateNaissJour.value = jourString;
  else
    inputDateNaissJour.value = "";
}

/**
 * Vérifie que l'adresse e-mail entrée par l'utilisateur est valide
 *
 * @param {*} inputEmail
 * @returns {boolean}
 */
export function verifierEmail(inputEmail) {
  const modeleEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const Email = inputEmail.value.trim();

  if (!modeleEmail.test(Email)) {
    alert("Veuillez entrer une adresse e-mail valide.");
    return false;
  }
  return true;
}

/**
 * Vérifie que le mot de passe saisie par l'utilisateur est suffisamment sécurisé suivant certains critères
 *
 * @param {*} inputPassword
 * @returns {boolean}
 */
export function verifierPassword(inputPassword) {
  const modelePassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.-_()])[A-Za-z\d@$!%*?&.-_()]{12,}$/;
  const Password = inputPassword.value;

  if (!modelePassword.test(Password)) {
    alert("Le mot de passe doit contenir au moins 12 caractères, dont 1 majuscule, 1 chiffre et un caractère spécial(. - _ ! etc).");
    return false;
  }
  return true;
}


/**
 * Fonction pour vérifier si les confirmations correspondent
 *
 * @param {*} inputReponse
 * @param {*} inputConfirmReponse
 * @returns {boolean}
 */
export function verifierReponse(inputReponse, inputConfirmReponse) {
  if (inputReponse.value !== inputConfirmReponse.value) {
    alert("Le champ de saisie et le champ de confirmation sont différents");
    return false;
  }
  return true;
}

/**
 * Vérifie si le numéro de téléphone saisie par l'utilisateur est valide
 *
 * @param {*} inputNum
 * @returns {boolean}
 */
export function verifierNumTel(inputNum) {
  const num = inputNum.value.trim().replace(/\s+/g, " ");
  const modeleTel = /^0[1-9]([ .\-]?[0-9]{2}){4}$/; // Correction : le tiret est échappé \-
  if (!modeleTel.test(num)) {
    alert("Veuillez entrer un numéro de téléphone valide.");
    return false;
  }
  return true;
}


/**
 * Fonction pour chercher des pays dans une API openData
 *
 * @async
 * @param {*} inputPays
 * @returns {*}
 */
export async function fetchPays(inputPays) {
  let tabNomsPays = [];
  const urls = [
    "https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/curiexplore-pays/records?select=*&limit=72",
    "https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/curiexplore-pays/records?select=*&limit=72&offset=72",
    "https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/curiexplore-pays/records?select=*&limit=72&offset=144",
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.results) {
        data.results.forEach((result) => {
          let paysActuel = result.name_fr;
          if (paysActuel) tabNomsPays.push(paysActuel);
        });
      }
      else
        console.error("Aucune donnée trouvée dans la réponse.");

    }
    catch (error) { console.error("Erreur lors de la récupération des données :", error); }
  }

  tabNomsPays.sort();

  inputPays.innerHTML = "";

  let optionVide = document.createElement("option");
  optionVide.textContent = "";
  optionVide.value = "";
  optionVide.selected = true;
  inputPays.appendChild(optionVide);

  tabNomsPays.forEach((nomPays) => {
    const option = document.createElement("option");
    option.value = nomPays;
    option.textContent = nomPays;
    inputPays.appendChild(option);
  });
}


/**
 * Fonction qui lance l'inscription du responsable
 *
 * @export
 */
export function inscription() 
{
  let emplacement = document.querySelector("#bloc_connexion");
  emplacement.innerHTML = "";

  let titre = document.createElement("h2");
  titre.textContent = "S'inscrire";
  titre.className = "inscrireTitle";

  let form = document.createElement("form");

  let parent = document.createElement("label");
  parent.className = "responsableEnfantLabel"
  parent.textContent = "Responsable de l'enfant :";
  form.appendChild(parent);


  // nom du responsable
  let labelNom = document.createElement("label");
  labelNom.textContent = "Nom *";
  labelNom.className = "labelNom";
  let inputNom = document.createElement("input");
  inputNom.setAttribute("required", "");
  inputNom.placeholder = "Votre nom";
  inputNom.type = "text";
  inputNom.className = "inputNom";
  let divNom = document.createElement('div');
  divNom.className = "divNom";
  divNom.appendChild(labelNom);
  divNom.appendChild(inputNom);
  form.appendChild(divNom);


  // prénom du responsable
  let labelPrenom = document.createElement("label");
  labelPrenom.textContent = "Prénom *";
  labelPrenom.className = "labelPrenom";
  let inputPrenom = document.createElement("input");
  inputPrenom.setAttribute("required", "");
  inputPrenom.placeholder = "Votre prénom";
  inputPrenom.type = "text";
  inputPrenom.className = "inputPrenom";
  let divPrenom = document.createElement('div');
  divPrenom.className = "divPrenom";
  divPrenom.appendChild(labelPrenom);
  divPrenom.appendChild(inputPrenom);
  form.appendChild(document.createElement('hr'));
  form.appendChild(divPrenom);


  // date de naissance du responsable
  let labelDateNaiss = document.createElement("label");
  labelDateNaiss.textContent = "Date de naissance *";

  let optionVide = document.createElement("option");
  optionVide.textContent = "";
  optionVide.value = "";
  optionVide.selected = true;

  let optionVide1 = document.createElement("option");
  optionVide1.textContent = "";
  optionVide1.value = "";
  optionVide1.selected = true;

  let optionVide2 = document.createElement("option");
  optionVide2.textContent = "";
  optionVide2.value = "";
  optionVide2.selected = true;

  let optionVide3 = document.createElement("option");
  optionVide3.textContent = "";
  optionVide3.value = "";
  optionVide3.selected = true;

  let inputDateNaissJour = document.createElement("select");
  inputDateNaissJour.setAttribute("required", "");
  inputDateNaissJour.appendChild(optionVide1);

  for (let i = 1; i <= 31; i++) 
  {
    const option = document.createElement("option");
    if (i < 10) 
    {
      option.value = "0" + i;
      option.textContent = "0" + i;
    } 
    else 
    {
      option.value = i;
      option.textContent = i;
    }
    inputDateNaissJour.appendChild(option);
  }

  let slash1 = document.createElement("label");
  slash1.textContent = "/";

  let inputDateNaissMois = document.createElement("select");
  inputDateNaissMois.setAttribute("required", "");
  inputDateNaissMois.appendChild(optionVide2);

  for (let i = 1; i <= 12; i++) 
  {
    const option = document.createElement("option");
    if (i < 10) 
    {
      option.value = "0" + i;
      option.textContent = "0" + i;
    } 
    else 
    {
      option.value = i;
      option.textContent = i;
    }
    inputDateNaissMois.appendChild(option);
  }

  inputDateNaissMois.addEventListener("change", function () {
    updateDays(
      inputDateNaissJour,
      parseInt(inputDateNaissJour.value),
      parseInt(this.value),
      parseInt(inputDateNaissAnnee.value)
    );
  });

  let slash2 = document.createElement("label");
  slash2.textContent = "/";

  let inputDateNaissAnnee = document.createElement("select");
  inputDateNaissAnnee.setAttribute("required", "");
  inputDateNaissAnnee.appendChild(optionVide3);

  const dateCourante = new Date();
  const anneeCourante = dateCourante.getFullYear();

  for (let i = anneeCourante - 18; i >= anneeCourante - 100; i--) 
  {
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
  });

  let divNaissanceParent = document.createElement('div');
  divNaissanceParent.className = "divNaissanceParent";

  let selectsNaissanceParent = document.createElement('div');
  selectsNaissanceParent.className = "selectsNaissanceParent";

  divNaissanceParent.appendChild(labelDateNaiss);
  selectsNaissanceParent.appendChild(inputDateNaissJour);
  selectsNaissanceParent.appendChild(slash1);
  selectsNaissanceParent.appendChild(inputDateNaissMois);
  selectsNaissanceParent.appendChild(slash2);
  selectsNaissanceParent.appendChild(inputDateNaissAnnee);
  divNaissanceParent.appendChild(selectsNaissanceParent);
  form.appendChild(document.createElement('hr'));
  form.appendChild(divNaissanceParent);


  // Genre du responsable
  let labelCivilite = document.createElement("label");
  labelCivilite.textContent = "Civilité *";
  labelCivilite.className = "labelCivilite";
  labelCivilite.setAttribute("for", "civilite");
  let inputCivilite = document.createElement("select");
  inputCivilite.id = "civilite";
  inputCivilite.setAttribute("required", "");

  let optionGenreVide = document.createElement("option");
  optionGenreVide.textContent = "";
  optionGenreVide.value = "";
  optionGenreVide.selected = true;
  inputCivilite.appendChild(optionGenreVide);

  // Option Homme
  let optionHomme = document.createElement("option");
  optionHomme.textContent = "Homme";
  optionHomme.value = "H";

  // Option Femme
  let optionFemme = document.createElement("option");
  optionFemme.textContent = "Femme";
  optionFemme.value = "F";

  // Ajouter les options au select
  inputCivilite.appendChild(optionHomme);
  inputCivilite.appendChild(optionFemme);

  let genreDiv = document.createElement('div');
  genreDiv.className = "genreDiv";
  genreDiv.appendChild(labelCivilite);
  genreDiv.appendChild(inputCivilite);

  form.appendChild(document.createElement('hr'));
  form.appendChild(genreDiv);



  // email du responsable
  let labelEmail = document.createElement("label");
  labelEmail.textContent = "Adresse mail *";
  labelEmail.className = "labelEmail";
  let inputEmail = document.createElement("input");
  inputEmail.setAttribute("required", "");
  inputEmail.type = "email";
  inputEmail.placeholder = "exemple@mail.com";
  inputEmail.className = "inputEmail";
  let emailDiv = document.createElement('div');
  emailDiv.className = "emailDiv";
  emailDiv.appendChild(labelEmail);
  emailDiv.appendChild(inputEmail);
  form.appendChild(document.createElement('hr'));
  form.appendChild(emailDiv);


  // confirmation du mail du responsable
  let labelConfirmEmail = document.createElement("label");
  labelConfirmEmail.textContent = "Confirmer votre adresse mail *";
  labelConfirmEmail.className = "labelConfirmEmail";
  let inputConfirmEmail = document.createElement("input");
  inputConfirmEmail.setAttribute("required", "");
  inputConfirmEmail.type = "email";
  inputConfirmEmail.placeholder = "exemple@mail.com";
  inputConfirmEmail.className = "inputConfirmEmail";
  let confirmEmailDiv = document.createElement('div');
  confirmEmailDiv.className = "confirmEmailDiv";
  confirmEmailDiv.appendChild(labelConfirmEmail);
  confirmEmailDiv.appendChild(inputConfirmEmail);
  form.appendChild(document.createElement('hr'));
  form.appendChild(confirmEmailDiv);


  // Création du label pour le mot de passe
  let labelPassword = document.createElement("label");
  labelPassword.textContent = "Mot de passe *";
  labelPassword.className = "labelPassword";

  // Création du champ input pour le mot de passe
  let inputPassword = document.createElement("input");
  inputPassword.setAttribute("required", ""); // Champ obligatoire
  inputPassword.type = "password"; // Type par défaut : password
  inputPassword.name = "password";
  inputPassword.placeholder = "Votre mot de passe";
  inputPassword.id = "password";

  let informationPassword = document.createElement("p");
  informationPassword.style = "font-family: arial, sans-serif; font-size: 12px; color: #666;";
  informationPassword.textContent = "Le mot de passe doit contenir au minimum : 12 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial parmi : @ $ ! % * ? & . - _ ( )";

  // Conteneur pour le champ de mot de passe et le bouton de bascule
  let passwordDiv = document.createElement("div");
  passwordDiv.className = "passwordDiv";
  passwordDiv.style.display = "flex"; // Alignement horizontal
  passwordDiv.style.alignItems = "center";

  // Ajout du champ input dans le conteneur
  passwordDiv.appendChild(inputPassword);
  passwordDiv.appendChild(informationPassword);

  // Création du bouton pour basculer la visibilité
  let togglePasswordButton = document.createElement("img");
  togglePasswordButton.className = "togglePassword";
  togglePasswordButton.src = seePasswordImage; // Image pour afficher le mot de passe
  togglePasswordButton.style = "margin-left: 5px; width: 5%; background-color: #f4538a; padding: 5px; border-radius: 50%; cursor: pointer;";

  // Ajout de l'événement pour basculer la visibilité du mot de passe
  togglePasswordButton.addEventListener("click", () => {
    // Vérifie le type actuel et bascule entre "password" et "text"
    const isPassword = inputPassword.type === "password";
    inputPassword.type = isPassword ? "text" : "password";

    // Change l'image de l'icône en fonction de l'état
    togglePasswordButton.src = isPassword ? hidePasswordImage : seePasswordImage;
  });

  // Ajout du bouton de bascule dans le conteneur
  passwordDiv.appendChild(togglePasswordButton);

  // Ajout du label et du conteneur au formulaire
  form.appendChild(document.createElement("hr")); // Ligne de séparation
  form.appendChild(labelPassword);
  form.appendChild(passwordDiv);



  // confirmation du mot de passe du responsable
  let labelConfirmPassword = document.createElement("label");
  labelConfirmPassword.textContent = "Confirmer votre mot de passe *";
  labelConfirmPassword.className = "labelConfirmPassword";
  let inputConfirmPassword = document.createElement("input");
  inputConfirmPassword.setAttribute("required", "");
  inputConfirmPassword.type = "password";
  inputConfirmPassword.name = "confirmPassword";
  inputConfirmPassword.placeholder = "Votre mot de passe";
  inputConfirmPassword.id = "confirmPassword";
  let confirmPasswordDiv = document.createElement('div');
  confirmPasswordDiv.className = "confirmPasswordDiv";
  confirmPasswordDiv.appendChild(labelConfirmPassword);
  confirmPasswordDiv.appendChild(inputConfirmPassword);
  form.appendChild(confirmPasswordDiv);


  // numéro de téléphone du responsable
  let labelNum = document.createElement("label");
  labelNum.textContent = "Numéro de téléphone *";
  labelNum.className = "labelNum";
  let inputNum = document.createElement("input");
  inputNum.setAttribute("required", "");
  inputNum.setAttribute("type", "tel");
  inputNum.className = "inputNum";
  inputNum.placeholder = "06 12 34 56 78";
  inputNum.setAttribute("pattern", "^0[1-9]([ .\-]?[0-9]{2}){4}$");
  let telephoneDiv = document.createElement("div")
  telephoneDiv.className = "telephoneDiv";
  telephoneDiv.appendChild(labelNum);
  telephoneDiv.appendChild(inputNum);
  form.appendChild(document.createElement('hr'));
  form.appendChild(telephoneDiv);


  // pays du reponsable
  let labelPays = document.createElement("label");
  labelPays.textContent = "Pays *";
  labelPays.className = "labelPays";
  let inputPays = document.createElement("select");
  inputPays.setAttribute("required", "");
  inputPays.id = "idPays";
  fetchPays(inputPays);
  let paysDiv = document.createElement("div");
  paysDiv.className = "paysDiv";
  paysDiv.appendChild(labelPays);
  paysDiv.appendChild(inputPays);
  form.appendChild(document.createElement('hr'));
  form.appendChild(paysDiv);


  let retour = document.createElement("button");
  retour.type = "button";
  retour.textContent = "Retour";
  let effac = document.createElement("button");
  effac.type = "button";
  effac.textContent = "Effacer";
  let sinscrire = document.createElement("button");
  sinscrire.textContent = "S'inscrire";
  sinscrire.type = "submit";
  sinscrire.className = "inscrireButton";

  let buttonsInscriptionDiv = document.createElement("div");
  buttonsInscriptionDiv.className = "buttonsInscriptionDiv";
  buttonsInscriptionDiv.appendChild(retour);
  buttonsInscriptionDiv.appendChild(effac);
  buttonsInscriptionDiv.appendChild(sinscrire)

  retour.addEventListener("click", connexion);
  effac.addEventListener("click", () =>
    effacerParent(
      inputNom,
      inputPrenom,
      inputDateNaissJour,
      inputDateNaissMois,
      inputDateNaissAnnee,
      inputCivilite,
      inputEmail,
      inputConfirmEmail,
      inputPassword,
      inputConfirmPassword,
      inputNum,
      inputPays
    )
  );

  const champsObligatoire = document.createElement("label");
  champsObligatoire.id = "champsObligatoires";
  champsObligatoire.textContent = "* Champs obligatoires";
  form.appendChild(champsObligatoire);

  form.appendChild(document.createElement('hr'));
  form.appendChild(buttonsInscriptionDiv);

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const isFormValid = form.checkValidity();
    const isEmailValid = verifierEmail(inputEmail);
    const isEmailConfirmed = verifierReponse(inputEmail, inputConfirmEmail);
    const isPasswordValid = verifierPassword(inputPassword);
    const isNumValid = verifierNumTel(inputNum);
    const isPasswordConfirmed = verifierReponse(
      inputPassword,
      inputConfirmPassword
    );

    if (
      isFormValid &&
      isEmailValid &&
      isEmailConfirmed &&
      isPasswordValid &&
      isPasswordConfirmed &&
      isNumValid
    ) {

      const mdp = hachage(inputPassword.value, true);
      ajouterAdulte(
        inputEmail.value,
        mdp.hash,
        inputNom.value,
        inputPrenom.value,
        inputDateNaissJour.value,
        inputDateNaissMois.value,
        inputDateNaissAnnee.value,
        inputCivilite.value,
        inputPays.value,
        mdp.sel,
        inputNum.value
      );
    }
  });

  emplacement.appendChild(document.createElement("br"));
  emplacement.appendChild(document.createElement("br"));

  emplacement.appendChild(titre);
  emplacement.appendChild(document.createElement("br"));
  emplacement.appendChild(document.createElement("br"));
  emplacement.appendChild(form);
}


/** Fonction pour confirmer l'inscription */
function confirmInscription() {
  let emplacement = document.querySelector("#bloc_connexion");

  emplacement.innerHTML = "";

  let titre = document.createElement("h2");
  titre.textContent = "Votre inscription a bien été pris en compte";

  let info = document.createElement("p");
  info.textContent = 'Merci pour votre inscription, pour retourner à la page de connexion cliquez sur le bouton "OK".';

  let ok = document.createElement("button");
  ok.textContent = "OK";
  ok.addEventListener("click", connexion); // lien vers la page de connexion

  emplacement.appendChild(document.createElement("br"));
  emplacement.appendChild(document.createElement("br"));

  emplacement.appendChild(titre);
  emplacement.appendChild(document.createElement("br"));
  emplacement.appendChild(document.createElement("br"));

  emplacement.appendChild(info);
  emplacement.appendChild(document.createElement("br"));
  emplacement.appendChild(document.createElement("br"));

  emplacement.appendChild(ok);
}


/**
 * Fonction pour effacer le contenu des champs lors de l'inscription
 *
 * @param {*} inputNom
 * @param {*} inputPrenom
 * @param {*} inputDateNaissJour
 * @param {*} inputDateNaissMois
 * @param {*} inputDateNaissAnnee
 * @param {*} inputCivilite
 * @param {*} inputEmail
 * @param {*} inputConfirmEmail
 * @param {*} inputPassword
 * @param {*} inputConfirmPassword
 * @param {*} inputNum
 * @param {*} inputPays
 */
function effacerParent(
  inputNom,
  inputPrenom,
  inputDateNaissJour,
  inputDateNaissMois,
  inputDateNaissAnnee,
  inputCivilite,
  inputEmail,
  inputConfirmEmail,
  inputPassword,
  inputConfirmPassword,
  inputNum,
  inputPays
) {
  inputNom.value = "";
  inputPrenom.value = "";
  inputDateNaissJour.value = "";
  inputDateNaissMois.value = "";
  inputDateNaissAnnee.value = "";
  inputCivilite.value = "";
  inputEmail.value = "";
  inputConfirmEmail.value = "";
  inputPassword.value = "";
  inputConfirmPassword.value = "";
  inputNum.value = "";
  inputPays.value = "";
}


/**
 * Fonction pour ajouter un adulte dans la base de données
 *
 * @param {*} email
 * @param {*} password
 * @param {*} nom
 * @param {*} prenom
 * @param {*} jour
 * @param {*} mois
 * @param {*} annee
 * @param {*} civilite
 * @param {*} pays
 * @param {*} sel
 */
function ajouterAdulte(email, password, nom, prenom, jour, mois, annee, civilite, pays, sel, telephone) {
  fetch('https://test-sae.onrender.com/api/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, nom, prenom, jour, mois, annee, civilite, pays, sel, telephone }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.success)
        confirmInscription();
      else
        alert('Erreur lors de l\'ajout de l\'adulte.');
    })
    .catch(error => {
      console.error('Erreur lors de l\'ajout de l\'adulte :', error);
      alert('Une erreur est survenue : ' + error.message);
    });
}