import { updateDays } from "./inscrire.js";
import { choixCompte } from "./connexion.js";

/**
 * Inscription d'un enfant.
 * @param {Object} adulte - L'objet adulte contenant les informations nécessaires.
 * @param {string} adulte.username - Le nom d'utilisateur de l'adulte.
 * @param {string} [adulte.nom] - Le nom de l'adulte (optionnel).
 * @param {string} [adulte.prenom] - Le prénom de l'adulte (optionnel).
 */
export function InscriptionEnfant(adulte) 
{
  if (typeof adulte !== 'object' || adulte === null || !adulte.username) {
    throw new Error("Le paramètre adulte doit être un objet valide avec une propriété 'username'.");
  }

  let emplacement = document.getElementById("bloc_connexion");

  emplacement.innerHTML = "";

  let royaume = document.createElement("h1");
  royaume.textContent = "Le Royaume des Lettres";

  let titre = document.createElement("h2");
  titre.textContent = "Inscription de l'enfant";

  let form = document.createElement("form");

  let labelEnfant = document.createElement("label");
  labelEnfant.textContent = "L'Enfant :";

  let labelEnfantNom = document.createElement("label");
  labelEnfantNom.textContent = "Nom";
  let inputEnfantNom = document.createElement("input");
  inputEnfantNom.setAttribute("required", "");

  let labelEnfantPrenom = document.createElement("label");
  labelEnfantPrenom.textContent = "Prénom";
  let inputEnfantPrenom = document.createElement("input");
  inputEnfantPrenom.setAttribute("required", "");

  let labelEnfantDateNaiss = document.createElement("label");
  labelEnfantDateNaiss.textContent = "Date de naissance";

  let labelJour = document.createElement("label");
  labelJour.textContent = "Jour";
  labelJour.id = "lJour";

  let labelMois = document.createElement("label");
  labelMois.textContent = "Mois";
  labelMois.id = "lMois";

  let labelAnnee = document.createElement("label");
  labelAnnee.textContent = "Annee";
  labelAnnee.id = "lAnnee";

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

  let inputEnfantDateNaissJour = document.createElement("select");
  inputEnfantDateNaissJour.setAttribute("required", "");
  inputEnfantDateNaissJour.appendChild(optionVide1);

  for (let i = 1; i <= 31; i++) {
    const option = document.createElement("option");
    if (i < 10) {
      option.value = "0" + i;
      option.textContent = "0" + i;
    }
    else {
      option.value = i;
      option.textContent = i;
    }
    inputEnfantDateNaissJour.appendChild(option);
  }

  let slash1 = document.createElement("label");
  slash1.textContent = "/";

  let inputEnfantDateNaissMois = document.createElement("select");
  inputEnfantDateNaissMois.setAttribute("required", "");
  inputEnfantDateNaissMois.appendChild(optionVide2);

  for (let i = 1; i <= 12; i++) {
    const option = document.createElement("option");
    if (i < 10) {
      option.value = "0" + i;
      option.textContent = "0" + i;
    }
    else {
      option.value = i;
      option.textContent = i;
    }
    inputEnfantDateNaissMois.appendChild(option);
  }

  inputEnfantDateNaissMois.addEventListener("change", function () {
    updateDays(
      inputEnfantDateNaissJour,
      parseInt(inputEnfantDateNaissJour.value),
      parseInt(this.value),
      parseInt(inputEnfantDateNaissAnnee.value)
    );
  });

  let slash2 = document.createElement("label");
  slash2.textContent = "/";

  let inputEnfantDateNaissAnnee = document.createElement("select");
  inputEnfantDateNaissAnnee.setAttribute("required", "");
  inputEnfantDateNaissAnnee.appendChild(optionVide3);

  const dateCourante = new Date();
  const anneeCourante = dateCourante.getFullYear();

  for (let i = anneeCourante - 3; i >= anneeCourante - 18; i--) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    inputEnfantDateNaissAnnee.appendChild(option);
  }

  inputEnfantDateNaissAnnee.addEventListener("change", function () {
    updateDays(
      inputEnfantDateNaissJour,
      parseInt(inputEnfantDateNaissJour.value),
      parseInt(inputEnfantDateNaissMois.value),
      parseInt(this.value)
    );
  });

  let labelEnfantCivilite = document.createElement("label");
  labelEnfantCivilite.textContent = "Civilité";
  let inputEnfantCivilite = document.createElement("select");

  let optionEnfantVide = document.createElement("option");
  optionEnfantVide.textContent = "";
  optionEnfantVide.value = "";
  optionEnfantVide.selected = true;

  let optionEnfantGarcon = document.createElement("option");
  optionEnfantGarcon.textContent = "Garçon";

  let optionEnfantFille = document.createElement("option");
  optionEnfantFille.textContent = "Fille";

  inputEnfantCivilite.appendChild(optionEnfantVide);
  inputEnfantCivilite.appendChild(optionEnfantGarcon);
  inputEnfantCivilite.appendChild(optionEnfantFille);
  inputEnfantCivilite.setAttribute("required", "");

  const labelDys = document.createElement("label");
  labelDys.textContent = "Votre enfant a-t-il été diagnostiqué avec un trouble spécifique des apprentissages (Dys)?";

  const checkBoxContainer = document.createElement("div");

  const divCheckOui = document.createElement("div");
  divCheckOui.style.display = "inline-flex";
  divCheckOui.style.alignItems = "center";
  divCheckOui.style.marginBottom = "10px"; // Ajoute un espace entre les options

  const labelOui = document.createElement("label");
  labelOui.textContent = " Oui";
  const checkboxDysOui = document.createElement("input");
  checkboxDysOui.type = "checkbox";
  checkboxDysOui.name = "diagnostic";
  checkboxDysOui.value = "Oui";
  labelOui.prepend(checkboxDysOui);

  checkboxDysOui.addEventListener("change", function () {
    if (checkboxDysOui.checked) checkboxDysNon.checked = false;
  });

  divCheckOui.appendChild(checkboxDysOui);
  divCheckOui.appendChild(labelOui);

  const divCheckNon = document.createElement("div");
  divCheckNon.style.display = "inline-flex";
  divCheckNon.style.alignItems = "center";

  const labelNon = document.createElement("label");
  labelNon.textContent = " Non";
  const checkboxDysNon = document.createElement("input");
  checkboxDysNon.type = "checkbox";
  checkboxDysNon.name = "diagnostic";
  checkboxDysNon.value = "Non";
  labelNon.prepend(checkboxDysNon);

  checkboxDysNon.addEventListener("change", function () {
    if (checkboxDysNon.checked) checkboxDysOui.checked = false;
  });

  divCheckNon.appendChild(checkboxDysNon);
  divCheckNon.appendChild(labelNon);

  checkBoxContainer.appendChild(divCheckOui);
  checkBoxContainer.appendChild(divCheckNon);
  
  let retour = document.createElement("button");
  retour.textContent = "Retour";

  let effac = document.createElement("button");
  effac.textContent = "Effacer";

  let inscrire2 = document.createElement("button");
  inscrire2.textContent = "S'inscrire";

  retour.addEventListener("click", () => choixCompte(adulte));
  effac.addEventListener("click", () =>
    effacerEnfant(
      inputEnfantNom,
      inputEnfantPrenom,
      inputEnfantDateNaissJour,
      inputEnfantDateNaissMois,
      inputEnfantDateNaissAnnee,
      inputEnfantCivilite
    )
  );

  form.appendChild(labelEnfantNom);
  form.appendChild(document.createElement("br"));

  form.appendChild(inputEnfantNom);
  form.appendChild(document.createElement("br"));
  form.appendChild(document.createElement("br"));

  form.appendChild(labelEnfantPrenom);
  form.appendChild(document.createElement("br"));

  form.appendChild(inputEnfantPrenom);
  form.appendChild(document.createElement("br"));
  form.appendChild(document.createElement("br"));

  form.appendChild(labelEnfantDateNaiss);
  form.appendChild(document.createElement("br"));

  form.appendChild(labelJour);
  form.appendChild(labelMois);
  form.appendChild(labelAnnee);
  form.appendChild(document.createElement("br"));

  form.appendChild(inputEnfantDateNaissJour);
  form.appendChild(slash1);
  form.appendChild(inputEnfantDateNaissMois);
  form.appendChild(slash2);
  form.appendChild(inputEnfantDateNaissAnnee);
  form.appendChild(document.createElement("br"));
  form.appendChild(document.createElement("br"));

  form.appendChild(labelEnfantCivilite);
  form.appendChild(document.createElement("br"));

  form.appendChild(inputEnfantCivilite);
  form.appendChild(document.createElement("br"));
  form.appendChild(document.createElement("br"));

  form.appendChild(labelDys);
  form.appendChild(document.createElement("br"));
  form.appendChild(document.createElement("br"));

  form.appendChild(checkBoxContainer);
  form.appendChild(document.createElement("br"));
  form.appendChild(document.createElement("br"));

  form.appendChild(retour);
  form.appendChild(effac);
  form.appendChild(inscrire2);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (form.checkValidity()) {
        ajouterEnfant(inputEnfantNom.value,
          inputEnfantPrenom.value,
          inputEnfantDateNaissJour.value,
          inputEnfantDateNaissMois.value,
          inputEnfantDateNaissAnnee.value,
          inputEnfantCivilite.value,
          adulte.username);
        choixCompte(adulte);
      } else {
        event.preventDefault();
      }
    });
  emplacement.appendChild(royaume);
  emplacement.appendChild(document.createElement("br"));

  emplacement.appendChild(titre);
  emplacement.appendChild(document.createElement("br"));

  emplacement.appendChild(labelEnfant);
  emplacement.appendChild(document.createElement("br"));
  emplacement.appendChild(form);
}


/**
 * Fonction pour effacer un enfant
 *
 * @export
 * @param {*} inputEnfantNom
 * @param {*} inputEnfantPrenom
 * @param {*} inputEnfantDateNaissJour
 * @param {*} inputEnfantDateNaissMois
 * @param {*} inputEnfantDateNaissAnnee
 * @param {*} inputEnfantCivilite
 */
export function effacerEnfant(
  inputEnfantNom,
  inputEnfantPrenom,
  inputEnfantDateNaissJour,
  inputEnfantDateNaissMois,
  inputEnfantDateNaissAnnee,
  inputEnfantCivilite
) {
  inputEnfantNom.value = "";
  inputEnfantPrenom.value = "";
  inputEnfantDateNaissJour.value = "";
  inputEnfantDateNaissMois.value = "";
  inputEnfantDateNaissAnnee.value = "";
  inputEnfantCivilite.value = "";
}


/**
 * Fonction permettant d'ajouter un enfant dans la base de données
 *
 * @param {*} nom
 * @param {*} prenom
 * @param {*} jour
 * @param {*} mois
 * @param {*} annee
 * @param {*} genre
 * @param {*} username
 */
function ajouterEnfant(nom, prenom, jour, mois, annee, genre, username) {
  fetch('http://localhost:3000/api/enfant/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nom, prenom, jour, mois, annee, genre, username }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.success)
        alert('Inscription de l\'enfant validée !');
      else
        alert('Erreur lors de l\'ajout de l\'enfant.');
    })
    .catch(error => {
      alert('Une erreur est survenue : ' + error.message);
    });
}
