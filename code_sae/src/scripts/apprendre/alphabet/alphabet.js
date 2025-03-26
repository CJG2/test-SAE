import "./../../../styles/alphabet.css";
import convertPath from "./../../../assets/icons/convertImage_Icon.png";

// Importation des sons des lettres
import a_sound from "./../../../assets/sons/lettres/a.mp3";
import b_sound from "./../../../assets/sons/lettres/b.mp3";
import c_sound from "./../../../assets/sons/lettres/c.mp3";
import d_sound from "./../../../assets/sons/lettres/d.mp3";
import e_sound from "./../../../assets/sons/lettres/e.mp3";
import f_sound from "./../../../assets/sons/lettres/f.mp3";
import g_sound from "./../../../assets/sons/lettres/g.mp3";
import h_sound from "./../../../assets/sons/lettres/h.mp3";
import i_sound from "./../../../assets/sons/lettres/i.mp3";
import j_sound from "./../../../assets/sons/lettres/j.mp3";
import k_sound from "./../../../assets/sons/lettres/k.mp3";
import l_sound from "./../../../assets/sons/lettres/l.mp3";
import m_sound from "./../../../assets/sons/lettres/m.mp3";
import n_sound from "./../../../assets/sons/lettres/n.mp3";
import o_sound from "./../../../assets/sons/lettres/o.mp3";
import p_sound from "./../../../assets/sons/lettres/p.mp3";
import q_sound from "./../../../assets/sons/lettres/q.mp3";
import r_sound from "./../../../assets/sons/lettres/r.mp3";
import s_sound from "./../../../assets/sons/lettres/s.mp3";
import t_sound from "./../../../assets/sons/lettres/t.mp3";
import u_sound from "./../../../assets/sons/lettres/u.mp3";
import v_sound from "./../../../assets/sons/lettres/v.mp3";
import w_sound from "./../../../assets/sons/lettres/w.mp3";
import x_sound from "./../../../assets/sons/lettres/x.mp3";
import y_sound from "./../../../assets/sons/lettres/y.mp3";
import z_sound from "./../../../assets/sons/lettres/z.mp3";

//Importations des données relatives au consignes 

import ennonceSound from "./../../../assets/sons/descriptionMJetA/description_apprendre/voix_apprendre_alphabet 1.mp3";
import { Consignes } from "./../../consignes/consignes.js";

/**
 * Fonction qui permet de jouer le son des lettres du carrousel lorsqu'elles sont cliquées.
 * @param {number} currentIndex - Index de la lettre à jouer
 */
function playPreviewLetters(currentIndex) {
  const tabSound = [
    a_sound, b_sound, c_sound, d_sound, e_sound, f_sound, g_sound, h_sound, i_sound,
    j_sound, k_sound, l_sound, m_sound, n_sound, o_sound, p_sound, q_sound, r_sound,
    s_sound, t_sound, u_sound, v_sound, w_sound, x_sound, y_sound, z_sound
  ];

  try {
    const audio = new Audio(tabSound[currentIndex]);
    audio.play();
  } catch (error) {
    alert("Erreur lors de la lecture du fichier audio");
  }
}

/**
 * Fonction principale pour gérer l'alphabet dans la page apprendre.
 * @export
 * @param {HTMLElement} container - Élément dans lequel afficher l'alphabet
 */
export function AlphabetFunction(container) {
  const lettresMaj = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lettresMin = "abcdefghijklmnopqrstuvwxyz";
  let taille = true;
  let indice = 0;

  const emplacement = document.createElement("div");
  emplacement.id = "alphabet";

  const buttonEmplacement = document.createElement("div");
  buttonEmplacement.id = "buttonEmplacement";

  const precedent = document.createElement("button");
  precedent.textContent = "< Précédent";
  precedent.addEventListener("click", lettrePrecedente);

  const suivant = document.createElement("button");
  suivant.textContent = "Suivant >";
  suivant.addEventListener("click", lettreSuivant);

  const convertImage = document.createElement("img");
  convertImage.id = "convertImage";
  convertImage.alt = "Convertir";
  convertImage.src = convertPath;
  convertImage.addEventListener("click", change);

  buttonEmplacement.appendChild(precedent);
  buttonEmplacement.appendChild(convertImage);
  buttonEmplacement.appendChild(suivant);

  new Consignes(emplacement, ennonceSound);

  // Ajouter les boutons et le carrousel au conteneur
  container.appendChild(emplacement);
  container.appendChild(buttonEmplacement);

  /** Fonction pour afficher la lettre courante */
  function alphabet() {
    emplacement.textContent = ""; // Nettoyer le contenu actuel
    const lettre = taille ? lettresMaj[indice] : lettresMin[indice];
    const span = document.createElement("span");
    span.textContent = lettre;
    emplacement.appendChild(span);
  }

  /** Fonction pour passer à la lettre précédente */
  function lettrePrecedente() {
    indice = (indice > 0) ? indice - 1 : lettresMaj.length - 1;
    alphabet();
  }

  /** Fonction pour passer à la lettre suivante */
  function lettreSuivant() {
    indice = (indice < lettresMaj.length - 1) ? indice + 1 : 0;
    alphabet();
  }

  /** Fonction pour changer la casse de la lettre */
  function change() {
    taille = !taille;
    alphabet();
  }

  // Ajouter un seul event listener pour jouer le son sur click
  emplacement.addEventListener("click", () => playPreviewLetters(indice));

  // Initialiser avec la première lettre
  alphabet();
}
