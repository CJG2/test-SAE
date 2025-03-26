import { randint } from "./../../connexion/hachage.js";
import { stockerExercice} from "./../listeDeMots/listeDeMots.js";
import vraiIcon from "./../../../assets/icons/vrai.png";
import fauxIcon from "./../../../assets/icons/faux.png";

import goodAnswerSound from "./../../../assets/sons/appSound/goodAnswer.mp3";
import badAnswerSound from "./../../../assets/sons/appSound/wrongAnswer.mp3";
import { styleText } from "util";

import ennonceSound from "./../../../assets/sons/descriptionMJetA/description_minijeux/voix_minijeux_motsATrou.mp3";
import { Consignes } from "./../../consignes/consignes.js";

let scoreAttendu = 70;
let tabExos=[];
let compteur=0;
let niv=0;
let idExo=6;
const enfantConnecte = JSON.parse(sessionStorage.getItem('enfantConnecte'));

const emplacement = document.getElementById("modal-body");
emplacement.style.backgroundImage = "url('./../assets/images/fondChateau.png')";
emplacement.style.backgroundRepeat = "no-repeat";
emplacement.style.backgroundSize = "cover";
emplacement.style.backgroundPosition = "center";

let motAtrouElement = document.createElement("h2");
motAtrouElement.style.fontSize = "300%";
motAtrouElement.style.fontWeight = "bold";
motAtrouElement.style.color = "#000";
motAtrouElement.style.textAlign = "center";
motAtrouElement.style.marginBottom = "20px";

let divSuivant = document.createElement("div");
divSuivant.style.textAlign = "right";

let suivant = document.createElement("button");
suivant.textContent = "Suivant";
buttonStyle(suivant);

divSuivant.appendChild(suivant);

let nbErreurTotal = 0;
let nbErreur = 0;
let score =0;

function normalizeString(str) 
{
  let lowerCaseStr = str.toLowerCase();
  let normalizedStr = lowerCaseStr.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  return normalizedStr;
}

async function motsExo(nbMot) {
  let motsAleatoires = [];
  try {
    const response = await fetch("https://test-sae.onrender.com/api/mot");
    if (!response.ok) {
      throw new Error("Erreur de serveur");
    }
    const data = await response.json();
    let tabMot = data;

    tabMot = tabMot.filter(mot => mot.syllabes.split("/").filter(s => s !== "").length > 1);

    for (let i = 0; i < nbMot && tabMot.length > 0; i++) {
      let indexAleatoire = randint(0, tabMot.length - 1);
      let motSelectionne = tabMot[indexAleatoire];
      let nomImage=normalizeString(motSelectionne.mot);

      motsAleatoires.push({
        mot: motSelectionne.mot,
        syllabes: motSelectionne.syllabes,
        image_src: "./../../../assets/images/"+nomImage+".png",     //motSelectionne.image_src,
      });

      tabMot.splice(indexAleatoire, 1);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des mots :", error);
  }
  return motsAleatoires;
}

function retour() 
{
  let retour = document.createElement("button");
  retour.textContent = "Retour";

  buttonStyle(retour);

  retour.addEventListener("click", function () {
    window.location.href = "./miniJeux.html";
  });
  emplacement.appendChild(retour);
}

function bonneReponse(mot, image, nbErreur) 
{
  emplacement.innerHTML = "";

  emplacement.style.display = "block";
  emplacement.style.width = "100%";

  let img = document.createElement("img");
  img.src = image;

  img.style.width = "30%";
  img.style.height = "auto";
  img.style.display = "block";
  img.style.margin = "0 auto";

  let imgIcon = document.createElement("img");
  imgIcon.src = vraiIcon;

  imgIcon.style.width = "5%";
  imgIcon.style.height = "auto";

  motAtrouElement.textContent = mot;

  let erreur = document.createElement("p");
  erreur.textContent = "Nombres d'erreurs : " + nbErreur;
  textStyle(erreur);

  nbErreur = 0;

  emplacement.appendChild(motAtrouElement);
  emplacement.appendChild(img);
  emplacement.appendChild(document.createElement("br"));
  emplacement.appendChild(erreur);
  emplacement.appendChild(imgIcon);
  emplacement.appendChild(document.createElement("br"));
  retour();
  emplacement.appendChild(suivant);
}

function mauvaiseReponse() 
{
  nbErreur += 1;
  nbErreurTotal += 1;

  let imgIcon = document.createElement("img");
  imgIcon.src = fauxIcon;

  imgIcon.style.width = "5%";
  imgIcon.style.height = "auto";

  emplacement.appendChild(imgIcon);
}

async function finExo()
{
  emplacement.innerHTML = "";

  tabExos = await recupererExercice();
  idExo = tabExos[niv].id_exercice;

  let scoreAttendu=tabExos[niv].score_attendu;

  if(scoreAttendu<90)
  {
    if (score>scoreAttendu)
      niv+=1;
    else if (scoreAttendu>70)
      niv-=1;
  }
  
  let textScoreAttendu = document.createElement("p");
  textScoreAttendu.textContent = "Score attendu : " + scoreAttendu;

  styleText(scoreAttendu);
  
  let message = document.createElement("h2");
  message.textContent = "Fin de l'exo";
  
  let erreurTotal = document.createElement("p");
  erreurTotal.textContent = "Nombres d'erreurs : " + nbErreurTotal;

  score = 100 - nbErreurTotal*5;
  
  let textScore = document.createElement("p");
  textScore.textContent = "Score : " + score;

  message.style.fontSize = "300%";

  textStyle(textScoreAttendu);
  textStyle(textScore);
  textStyle(erreurTotal);
  
  emplacement.appendChild(message);
  emplacement.appendChild(erreurTotal);
  emplacement.appendChild(document.createElement("br"));
  emplacement.appendChild(textScoreAttendu);
  emplacement.appendChild(document.createElement("br"));
  emplacement.appendChild(textScore);

  let nbTentative = await recupererDernierExerciceFait();
  stockerExercice(enfantConnecte.id, idExo, nbTentative, score);

  retour();
}

/** 
 * Cette fonction crer un trou dans un mot, elle prend en paramètre un tableau de string qui représente des syllabes
 * et un entier qui représente l'indice de la syllabe à couper
 * @param {[string]}syllabes
 * @param {int}trou
 * @returns {string}
 * Cette fonction renvoie une chaine de caracteres string qui représente le mot couper avec un - à la place de chaque lettre coupé
*/

function faireUnTrou(syllabes, trou) 
{
  let motAtrou = "";
  let trouSyllabes = syllabes.slice();
  trouSyllabes[trou] = "-".repeat(trouSyllabes[trou].length);
  for (let j = 0; j < trouSyllabes.length; j++) {
    motAtrou += trouSyllabes[j];
  }
  return motAtrou;
}


/**
 * Cette fonction crer le jeu interactif
 * @param {string}mot le mot d'origine qui doit être couper
 * @param {[string]}syllabes le tableau de syllabes du mot à découper
 * @param {int}trou l'indice de la syllabes à découper
 * @param {string}image le chemin/lien de l'image associer au mot à découper
 * @export
 */

async function exo(mot, syllabes, trou, image) 
{
  emplacement.innerHTML = "";

  emplacement.style.display = "block";
  emplacement.style.width = "100%";

  let divSylButton = document.createElement("div");

  divSylButton.style.textAlign = "center";

  motAtrouElement.textContent = faireUnTrou(syllabes, trou);

  let img = document.createElement("img");
  img.src = image;

  img.style.width = "30%";
  img.style.height = "auto";
  img.style.display = "block";
  img.style.margin = "0 auto";

  emplacement.appendChild(motAtrouElement);
  emplacement.appendChild(img);
  emplacement.appendChild(document.createElement("br"));

  nbErreur = 0;

  let voyelles=["a", "e", "i", "o", "u"];
  let x=randint(0, 3);
  let y;

  for (let i = 0; i < 4; i++)
  {
    if (i==x)
    {
      let sylButton = document.createElement("button");
      sylButton.textContent = syllabes[trou];
      buttonStyle(sylButton);

      divSylButton.appendChild(sylButton);

      sylButton.textContent = syllabes[trou];
      sylButton.addEventListener("click", () =>{
        const goodAnswer = new Audio(goodAnswerSound);
        goodAnswer.play();
        bonneReponse(mot, image, nbErreur)
      });
    }
    else
    {
      for (let j=0; j<syllabes[trou].length; j++)
      {
        if(syllabes[trou][j]=="a" || 
           syllabes[trou][j]=="à" ||
           syllabes[trou][j]=="â" ||
           syllabes[trou][j]=="A" || 
           syllabes[trou][j]=="e" || 
           syllabes[trou][j]=="é" ||
           syllabes[trou][j]=="è" ||
           syllabes[trou][j]=="ê" ||
           syllabes[trou][j]=="ë" ||
           syllabes[trou][j]=="E" || 
           syllabes[trou][j]=="É" ||
           syllabes[trou][j]=="i" ||
           syllabes[trou][j]=="î" || 
           syllabes[trou][j]=="ï" ||
           syllabes[trou][j]=="I" || 
           syllabes[trou][j]=="o" || 
           syllabes[trou][j]=="ô" ||
           syllabes[trou][j]=="ö" ||
           syllabes[trou][j]=="O" || 
           syllabes[trou][j]=="u" || 
           syllabes[trou][j]=="û" ||
           syllabes[trou][j]=="U" || 
           syllabes[trou][j]=="y" ||
           syllabes[trou][j]=="Y")
        {
          do
            {
              y=randint(0, voyelles.length-1);
            }
          while(voyelles[y]==syllabes[trou][j]);

          let newSyllabes = syllabes[trou].slice(0, j) + voyelles[y] + syllabes[trou].slice(j + 1);
          voyelles.splice(y, 1);
        
          let sylButton = document.createElement("button");
          sylButton.textContent = syllabes[trou];
          buttonStyle(sylButton);
          divSylButton.appendChild(sylButton);

          sylButton.textContent = newSyllabes;
          sylButton.addEventListener("click", () => {
            const wrongAnswer = new Audio(badAnswerSound);
            wrongAnswer.play();
            mauvaiseReponse();
          });
          break;
        }
      }
    }
  }

  emplacement.appendChild(divSylButton);
  emplacement.appendChild(document.createElement("br"));
  retour();
}

function afficherExercice(index, mots)
{

  emplacement.innerHTML = "";

  let char="";
  let tabSyllabes=[];

  for(let j=0; j<mots[index].syllabes.length; j++)
  {
    if (mots[index].syllabes[j]=="/")
    {
      tabSyllabes.push(char);
      char="";
    }
    else
      char+=mots[index].syllabes[j];
  }
    let trou=randint(0, tabSyllabes.length-1);
    exo(mots[index].mot, tabSyllabes, trou, mots[index].image_src);
}

export async function jeuMotAtrou()
{
  let mots = await motsExo(10);
  new Consignes(emplacement, ennonceSound);
  compteur=0;
  afficherExercice(compteur, mots);

  // Gestionnaire pour le bouton "Suivant"
  suivant.addEventListener("click", () => {
    compteur++;
    if (compteur < mots.length) {
      afficherExercice(compteur, mots);
    } 
    else 
    {
      finExo();
    }
  });
}

/**
 * Fonction qui permet de récupérer les exercices de la base de données
 *
 * @async
 * @returns {unknown}
 */
async function recupererExercice() 
{
    const reponse = await fetch("https://test-sae.onrender.com/api/exercice");

    const exercices = await reponse.json();

    tabExos = exercices.filter(exercice => exercice.libelle === "Mot à trou");
    return tabExos; // Retourne le tableau mis à jour
}

/**
 * Fonction qui permet de récupérer le numéro de la dernière tentative de l'enfant selon l'exercice voulu
 *
 * @export
 * @async
 * @returns {unknown}
 */
async function recupererDernierExerciceFait() 
{
  const reponse = await fetch("https://test-sae.onrender.com/api/realiser");

  const exercicesRealiser = await reponse.json();
  const tabExosRealiser = exercicesRealiser.filter(exerciceRealiser => exerciceRealiser.id_enfant === enfantConnecte.id && exerciceRealiser.id_exercice === idExo);
  let numTentative = tabExosRealiser.length;

  return numTentative;
}

function buttonStyle(button)
{
  button.style.fontSize = "250%";
  button.style.padding = "10px 20px";
  button.style.backgroundColor = " #F5DD61";
  button.style.color = "#000";
  button.style.border = "3px solid #FAA300";
  button.style.borderRadius = "15px";
  button.style.cursor = "pointer";
  button.style.margin = "20px";
  button.style.transition = "all 0.3s ease";
  button.addEventListener("mouseover", () => {
    button.style.backgroundColor = " #0056b3";
          });
          button.addEventListener("mouseout", () => {
            button.style.backgroundColor = " #F5DD61";
          });
}

function textStyle(text)
{
  text.style.fontSize = "200%";
  text.style.backgroundColor = " #F5DD61";
  text.style.border = "3px solid #FAA300";
  text.style.padding = "10px 20px";
  text.style.borderRadius = "15px";
  text.style.width = "auto";
  text.style.display = "inline-block";
  text.style.margin = "10px 0";
}