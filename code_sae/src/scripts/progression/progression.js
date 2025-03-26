import { recupererExercice, recupererDernierExerciceFait } from "../mini_jeux/listeDeMots/listeDeMots";
import { recupererEnfantsDUnResponsable } from "../profil/profil.js";
import returnArrow from "./../../assets/icons/returnArrow.png";

import "./../../styles/main.css";
import "./../../styles/caroussel.css";
import "./../../styles/navigation.css";
import "./../../styles/progression.css";
import "./../../styles/profil.css";

const adulteConnecte = JSON.parse(sessionStorage.getItem("adulteConnecte"));
const enfantConnecte = JSON.parse(sessionStorage.getItem("enfantConnecte"));
let idExoAssociation = 1; // ID pour le jeu d'association
let idExoMotsATrou = 6;
let idExoMotsCroises = 11; // ID pour le jeu Mots Croisés
let idExoListeMots = 16;

let tabExos = [];

/**
 * Fonction pour récupérer tous les exercices réalisés par un enfant donné
 *
 * @param {number} id_enfant - L'ID de l'enfant dont on veut récupérer les exercices réalisés
 * @returns {Promise<Array>} - Retourne une promesse contenant un tableau des exercices réalisés
 */
async function getExerciceRealiseById(id_enfant)  
{
    const reponse = await fetch("https://test-sae.onrender.com/api/realiser");

    const exercicesRealiser = await reponse.json();
    const tabExosRealiser = exercicesRealiser.filter(exerciceRealiser => exerciceRealiser.id_enfant === id_enfant);

    return tabExosRealiser;
}


/**
 * Calcule la progression de l'enfant dans l'exercice.
 * 
 * @async
 * @returns {Promise<number>} - Retourne un pourcentage représentant la progression de l'enfant.
*/ 
async function compteProgression() 
{
  const tabEnfants = await recupererEnfantsDUnResponsable();
  progression(tabEnfants[0]);
  const divButton = document.querySelector("#button_container");
  for (let i = 0; i < tabEnfants.length; i++) 
  {
    let compte = document.createElement("button");
    compte.className = "compteEnfantProfil";
    compte.textContent = tabEnfants[i].prenom_enfant;
    compte.addEventListener("click", () => progression(tabEnfants[i]));
    divButton.appendChild(compte);
  }
}

function calculerTauxReussite(exosListeMots, scoreAttendu)
{
  let tauxReussite = -1;
  if (exosListeMots.length > 0) 
    {
      let reussi = 0;
      for (let i = 0; i < exosListeMots.length; i++) 
      {
        if (exosListeMots[i] >= scoreAttendu) 
          reussi++;
      }
  
      tauxReussite = (reussi / exosListeMots.length) * 100;
    } 
    return tauxReussite;
}

/**
 * Suivi de la progression de l'enfant dans l'exercice.
 * 
 * @async
 * @param {Object} enfant - L'objet représentant l'enfant dont on suit la progression.
*/ 
async function progression(enfant)
{
  let tabExos = await getExerciceRealiseById(enfant.id_enfant);

  const gauche = document.querySelector("#conteneur-gauche");
  const droite = document.querySelector("#conteneur-droite");
  const listeContainer = document.querySelector("#liste-de-mots");
  const croisesContainer = document.querySelector("#mots-croises");
  const motImageContainer = document.querySelector("#Mot-image");
  const trouContainer = document.querySelector("#Mot-a-trou");
  const emplacement = document.querySelector("#chrono");

  // Nettoyage des conteneurs
  listeContainer.innerHTML = "";
  croisesContainer.innerHTML = "";
  motImageContainer.innerHTML = "";
  trouContainer.innerHTML = "";
  emplacement.innerHTML = "";

  // Mise à jour du titre
  const titreProgression = document.querySelector("#app > h2");
  titreProgression.textContent = "Progression de " + enfant.prenom_enfant;

  let titreListeMots = document.createElement("h2");
  titreListeMots.textContent = "Liste de Mots";
  listeContainer.appendChild(titreListeMots);

  let exosListeMots = [];
  let allExosListeMots = await recupererExercice("Liste de Mots");

  for (let difficulte = 0; difficulte < allExosListeMots.length; difficulte++) 
  {
    exosListeMots[difficulte] = [];
    for (let i = 0; i < tabExos.length; i++) 
    {
      if (tabExos[i].id_exercice == allExosListeMots[difficulte].id_exercice)
        exosListeMots[difficulte].push(tabExos[i].score);
    }
  }

  if (exosListeMots.length > 0 ) 
  {
    let tauxReussite1 = calculerTauxReussite(exosListeMots[0], 70);
    if(tauxReussite1 >= 0)
    {
      let listeMot1 = document.createElement("h4");
      listeMot1.textContent = "Taux de réussite du niveau 1 : " + tauxReussite1.toFixed(2) + "%";
      listeContainer.appendChild(listeMot1);
    }
  
    else 
    {
      let listeMot1 = document.createElement("h4");
      listeMot1.textContent = "Pas encore d'exercices réalisés pour le niveau 1.";
      listeContainer.appendChild(listeMot1);
    }

    let tauxReussite2 = calculerTauxReussite(exosListeMots[1], 75);
    if(tauxReussite2 >= 0)
    {
      let listeMot2 = document.createElement("h4");
      listeMot2.textContent = "Taux de réussite du niveau 2 : " + tauxReussite2.toFixed(2) + "%";
      listeContainer.appendChild(listeMot2);
    }

    else 
    {
      let listeMot2 = document.createElement("h4");
      listeMot2.textContent = "Pas encore d'exercices réalisés pour le niveau 2.";
      listeContainer.appendChild(listeMot2);
    }

    let tauxReussite3 = calculerTauxReussite(exosListeMots[2], 80);
    if(tauxReussite3 >= 0)
    {
      let listeMot3 = document.createElement("h4");
      listeMot3.textContent = "Taux de réussite du niveau 3 : " + tauxReussite3.toFixed(2) + "%";
      listeContainer.appendChild(listeMot3);
    }

    else 
    {
      let listeMot3 = document.createElement("h4");
      listeMot3.textContent = "Pas encore d'exercices réalisés pour le niveau 3.";
      listeContainer.appendChild(listeMot3);
    }

    let tauxReussite4 = calculerTauxReussite(exosListeMots[3], 85);
    if(tauxReussite4 >= 0)
    {
      let listeMot4 = document.createElement("h4");
      listeMot4.textContent = "Taux de réussite du niveau 4 : " + tauxReussite4.toFixed(2) + "%";
      listeContainer.appendChild(listeMot4);
    }

    else 
    {
      let listeMot4 = document.createElement("h4");
      listeMot4.textContent = "Pas encore d'exercices réalisés pour le niveau 4.";
      listeContainer.appendChild(listeMot4);
    }

    let tauxReussite5 = calculerTauxReussite(exosListeMots[4], 90);
    if(tauxReussite5 >= 0)
    {
      let listeMot5 = document.createElement("h4");
      listeMot5.textContent = "Taux de réussite du niveau 5 : " + tauxReussite5.toFixed(2) + "%";
      listeContainer.appendChild(listeMot5);
    }

    else 
    {
      let listeMot5 = document.createElement("h4");
      listeMot5.textContent = "Pas encore d'exercices réalisés pour le niveau 5.";
      listeContainer.appendChild(listeMot5);
    }
  }
  
  let titreCroises = document.createElement("h2");
  titreCroises.textContent = "Mots Croisés";
  croisesContainer.appendChild(titreCroises);

  let exosMotsCroises = [];
  let allExosMotsCroises = await recupererExercice("Mot croisés");

  for (let difficulte = 0; difficulte < allExosMotsCroises.length; difficulte++) 
  {
    exosMotsCroises[difficulte] = [];
    for (let i = 0; i < tabExos.length; i++) 
    {
      if (tabExos[i].id_exercice == allExosMotsCroises[difficulte].id_exercice)
        exosMotsCroises[difficulte].push(tabExos[i].score);
    }
  }

  if (exosMotsCroises.length > 0 ) 
  {
    let tauxReussite1 = calculerTauxReussite(exosMotsCroises[0], 70);
    if(tauxReussite1 >= 0)
    {
      let motsCroises1 = document.createElement("h4");
      motsCroises1.textContent = "Taux de réussite du niveau 1 : " + tauxReussite1.toFixed(2) + "%";
      croisesContainer.appendChild(motsCroises1);
    }
  
    else 
    {
      let motsCroises1 = document.createElement("h4");
      motsCroises1.textContent = "Pas encore d'exercices réalisés pour le niveau 1.";
      croisesContainer.appendChild(motsCroises1);
    }

    let tauxReussite2 = calculerTauxReussite(exosMotsCroises[1], 75);
    if(tauxReussite2 >= 0)
    {
      let motsCroises2 = document.createElement("h4");
      motsCroises2.textContent = "Taux de réussite du niveau 2 : " + tauxReussite2.toFixed(2) + "%";
      croisesContainer.appendChild(motsCroises2);
    }

    else 
    {
      let motsCroises2 = document.createElement("h4");
      motsCroises2.textContent = "Pas encore d'exercices réalisés pour le niveau 2.";
      croisesContainer.appendChild(motsCroises2);
    }

    let tauxReussite3 = calculerTauxReussite(exosMotsCroises[2], 80);
    if(tauxReussite3 >= 0)
    {
      let motsCroises3 = document.createElement("h4");
      motsCroises3.textContent = "Taux de réussite du niveau 3 : " + tauxReussite3.toFixed(2) + "%";
      croisesContainer.appendChild(motsCroises3);
    }

    else 
    {
      let motsCroises3 = document.createElement("h4");
      motsCroises3.textContent = "Pas encore d'exercices réalisés pour le niveau 3.";
      croisesContainer.appendChild(motsCroises3);
    }

    let tauxReussite4 = calculerTauxReussite(exosMotsCroises[3], 85);
    if(tauxReussite4 >= 0)
    {
      let motsCroises4 = document.createElement("h4");
      motsCroises4.textContent = "Taux de réussite du niveau 4 : " + tauxReussite4.toFixed(2) + "%";
      croisesContainer.appendChild(motsCroises4);
    }

    else 
    {
      let motsCroises4 = document.createElement("h4");
      motsCroises4.textContent = "Pas encore d'exercices réalisés pour le niveau 4.";
      croisesContainer.appendChild(motsCroises4);
    }

    let tauxReussite5 = calculerTauxReussite(exosMotsCroises[4], 90);
    if(tauxReussite5 >= 0)
    {
      let motsCroises5 = document.createElement("h4");
      motsCroises5.textContent = "Taux de réussite du niveau 5 : " + tauxReussite5.toFixed(2) + "%";
      croisesContainer.appendChild(motsCroises5);
    }

    else 
    {
      let motsCroises5 = document.createElement("h4");
      motsCroises5.textContent = "Pas encore d'exercices réalisés pour le niveau 5.";
      croisesContainer.appendChild(motsCroises5);
    }
  }

  let titreMotImage = document.createElement("h2");
  titreMotImage.textContent = "1 Mot 1 Image";
  motImageContainer.appendChild(titreMotImage);

  let exosMotImage = [];
  let allExosMotImage = await recupererExercice("Associations");

  for (let difficulte = 0; difficulte < allExosMotImage.length; difficulte++) 
  {
    exosMotImage[difficulte] = [];
    for (let i = 0; i < tabExos.length; i++) 
    {
      if (tabExos[i].id_exercice == allExosMotImage[difficulte].id_exercice)
        exosMotImage[difficulte].push(tabExos[i].score);
    }
  }

  if (exosMotImage.length > 0 ) 
  {
    let tauxReussite1 = calculerTauxReussite(exosMotImage[0], 70);
    if(tauxReussite1 >= 0)
    {
      let motImage1 = document.createElement("h4");
      motImage1.textContent = "Taux de réussite du niveau 1 : " + tauxReussite1.toFixed(2) + "%";
      motImageContainer.appendChild(motImage1);
    }
  
    else 
    {
      let motImage1 = document.createElement("h4");
      motImage1.textContent = "Pas encore d'exercices réalisés pour le niveau 1.";
      motImageContainer.appendChild(motImage1);
    }

    let tauxReussite2 = calculerTauxReussite(exosMotImage[1], 75);
    if(tauxReussite2 >= 0)
    {
      let motImage2 = document.createElement("h4");
      motImage2.textContent = "Taux de réussite du niveau 2 : " + tauxReussite2.toFixed(2) + "%";
      motImageContainer.appendChild(motImage2);
    }

    else 
    {
      let motImage2 = document.createElement("h4");
      motImage2.textContent = "Pas encore d'exercices réalisés pour le niveau 2.";
      motImageContainer.appendChild(motImage2);
    }

    let tauxReussite3 = calculerTauxReussite(exosMotImage[2], 80);
    if(tauxReussite3 >= 0)
    {
      let motImage3 = document.createElement("h4");
      motImage3.textContent = "Taux de réussite du niveau 3 : " + tauxReussite3.toFixed(2) + "%";
      motImageContainer.appendChild(motImage3);
    }

    else 
    {
      let motImage3 = document.createElement("h4");
      motImage3.textContent = "Pas encore d'exercices réalisés pour le niveau 3.";
      motImageContainer.appendChild(motImage3);
    }

    let tauxReussite4 = calculerTauxReussite(exosMotImage[3], 85);
    if(tauxReussite4 >= 0)
    {
      let motImage4 = document.createElement("h4");
      motImage4.textContent = "Taux de réussite du niveau 4 : " + tauxReussite4.toFixed(2) + "%";
      motImageContainer.appendChild(motImage4);
    }

    else 
    {
      let motImage4 = document.createElement("h4");
      motImage4.textContent = "Pas encore d'exercices réalisés pour le niveau 4.";
      motImageContainer.appendChild(motImage4);
    }

    let tauxReussite5 = calculerTauxReussite(exosMotImage[4], 90);
    if(tauxReussite5 >= 0)
    {
      let motImage5 = document.createElement("h4");
      motImage5.textContent = "Taux de réussite du niveau 5 : " + tauxReussite5.toFixed(2) + "%";
      motImageContainer.appendChild(motImage5);
    }

    else 
    {
      let motImage5 = document.createElement("h4");
      motImage5.textContent = "Pas encore d'exercices réalisés pour le niveau 5.";
      motImageContainer.appendChild(motImage5);
    }
  }

  let titreTrou = document.createElement("h2");
  titreTrou.textContent = "Mots à trou";
  trouContainer.appendChild(titreTrou);

  let exosTrou = [];
  let allExosTrou = await recupererExercice("Mot à trou");

  for (let difficulte = 0; difficulte < allExosTrou.length; difficulte++) 
  {
    exosTrou[difficulte] = [];
    for (let i = 0; i < tabExos.length; i++) 
    {
      if (tabExos[i].id_exercice == allExosTrou[difficulte].id_exercice)
        exosTrou[difficulte].push(tabExos[i].score);
    }
  }

  if (exosTrou.length > 0 ) 
  {
    let tauxReussite1 = calculerTauxReussite(exosTrou[0], 70);
    if(tauxReussite1 >= 0)
    {
      let trou1 = document.createElement("h4");
      trou1.textContent = "Taux de réussite du niveau 1 : " + tauxReussite1.toFixed(2) + "%";
      trouContainer.appendChild(trou1);
    }
  
    else 
    {
      let trou1 = document.createElement("h4");
      trou1.textContent = "Pas encore d'exercices réalisés pour le niveau 1.";
      trouContainer.appendChild(trou1);
    }
    /*
    let tauxReussite2 = calculerTauxReussite(exosTrou[1], 75);
    if(tauxReussite2 >= 0)
    {
      let trou2 = document.createElement("h4");
      trou2.textContent = "Taux de réussite du niveau 2 : " + tauxReussite2.toFixed(2) + "%";
      trouContainer.appendChild(trou2);
    }

    else 
    {
      let trou2 = document.createElement("h4");
      trou2.textContent = "Pas encore d'exercices réalisés pour le niveau 2.";
      trouContainer.appendChild(trou2);
    }

    let tauxReussite3 = calculerTauxReussite(exosTrou[2], 80);
    if(tauxReussite3 >= 0)
    {
      let trou3 = document.createElement("h4");
      trou3.textContent = "Taux de réussite du niveau 3 : " + tauxReussite3.toFixed(2) + "%";
      trouContainer.appendChild(trou3);
    }

    else 
    {
      let trou3 = document.createElement("h4");
      trou3.textContent = "Pas encore d'exercices réalisés pour le niveau 3.";
      trouContainer.appendChild(trou3);
    }

    let tauxReussite4 = calculerTauxReussite(exosTrou[3], 85);
    if(tauxReussite4 >= 0)
    {
      let trou4 = document.createElement("h4");
      trou4.textContent = "Taux de réussite du niveau 4 : " + tauxReussite4.toFixed(2) + "%";
      trouContainer.appendChild(trou4);
    }

    else 
    {
      let trou4 = document.createElement("h4");
      trou4.textContent = "Pas encore d'exercices réalisés pour le niveau 4.";
      trouContainer.appendChild(trou4);
    }

    let tauxReussite5 = calculerTauxReussite(exosTrou[4], 90);
    if(tauxReussite5 >= 0)
    {
      let trou5 = document.createElement("h4");
      trou5.textContent = "Taux de réussite du niveau 5 : " + tauxReussite5.toFixed(2) + "%";
      trouContainer.appendChild(trou5);
    }

    else 
    {
      let trou5 = document.createElement("h4");
      trou5.textContent = "Pas encore d'exercices réalisés pour le niveau 5.";
      trouContainer.appendChild(trou5);
    }
    */
  }

  gauche.appendChild(listeContainer);
  gauche.appendChild(croisesContainer);
  droite.appendChild(motImageContainer);
  droite.appendChild(trouContainer);
}

compteProgression();
