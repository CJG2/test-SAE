import a_sound from "./../assets/sons/lettres/a.mp3";
import b_sound from "./../assets/sons/lettres/b.mp3";
import c_sound from "./../assets/sons/lettres/c.mp3";
import d_sound from "./../assets/sons/lettres/d.mp3";
import e_sound from "./../assets/sons/lettres/e.mp3";
import f_sound from "./../assets/sons/lettres/f.mp3";
import g_sound from "./../assets/sons/lettres/g.mp3";
import h_sound from "./../assets/sons/lettres/h.mp3";
import i_sound from "./../assets/sons/lettres/i.mp3";
import j_sound from "./../assets/sons/lettres/j.mp3";
import k_sound from "./../assets/sons/lettres/k.mp3";
import l_sound from "./../assets/sons/lettres/l.mp3";
import m_sound from "./../assets/sons/lettres/m.mp3";
import n_sound from "./../assets/sons/lettres/n.mp3";
import o_sound from "./../assets/sons/lettres/o.mp3";
import p_sound from "./../assets/sons/lettres/p.mp3";
import q_sound from "./../assets/sons/lettres/q.mp3";
import r_sound from "./../assets/sons/lettres/r.mp3";
import s_sound from "./../assets/sons/lettres/s.mp3";
import t_sound from "./../assets/sons/lettres/t.mp3";
import u_sound from "./../assets/sons/lettres/u.mp3";
import v_sound from "./../assets/sons/lettres/v.mp3";
import w_sound from "./../assets/sons/lettres/w.mp3";
import x_sound from "./../assets/sons/lettres/x.mp3";
import y_sound from "./../assets/sons/lettres/y.mp3";
import z_sound from "./../assets/sons/lettres/z.mp3";


/**
 * Initialise un carrousel d'alphabet interactif.
 * Cette fonction configure un carrousel permettant de faire défiler les lettres de l'alphabet
 * via des boutons "Précédent" et "Suivant". Les lettres sont affichées dans un élément HTML.
 *
 * @function
 * @export
 *
 * @description
 * - Recherche trois éléments HTML :
 *   - Un élément avec l'ID `#letter` pour afficher la lettre courante.
 *   - Un bouton avec l'ID `#prev-button` pour passer à la lettre précédente.
 *   - Un bouton avec l'ID `#next-button` pour passer à la lettre suivante.
 * - Ajoute des gestionnaires d'événements aux boutons pour modifier la lettre affichée.
 * - Affiche un message d'erreur dans la console si l'un des éléments requis est manquant.
 *
 * @throws {Error} Si les éléments requis ne sont pas présents dans le DOM.
 */
export function initAlphabetCarousel() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let currentIndex = 0;

  const letterDisplay = document.querySelector("#letter");
  const prevButton = document.querySelector("#prev-button");
  const nextButton = document.querySelector("#next-button");

  // Vérification de l'existence des éléments
  if (!letterDisplay || !prevButton || !nextButton) {
    console.error("Éléments du carrousel manquants");
    return;
  }

  // Fonction pour afficher la lettre courante
  function afficherLettre() {
    letterDisplay.textContent = alphabet[currentIndex];
    letterDisplay.addEventListener("click", () => {
      playPreviewLetters(currentIndex);
    })
  }

  prevButton.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + alphabet.length) % alphabet.length;
    afficherLettre();
  });

  nextButton.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % alphabet.length;
    afficherLettre();
  });

  // Affichage initial
  afficherLettre();
}

/**
 * Fonction qui permet de jouer les lettres du carrousel lorsqu'il sont cliqués 
 * @param {*} currentIndex 
 */
function playPreviewLetters(currentIndex) {
  const tabSound = [a_sound, b_sound, c_sound, d_sound, e_sound, f_sound, g_sound, h_sound, i_sound,
                    j_sound, k_sound, l_sound, m_sound, n_sound, o_sound, p_sound, q_sound, r_sound,
                    s_sound, t_sound, u_sound, v_sound, w_sound, x_sound, y_sound, z_sound];

  try {
    const audio = new Audio(tabSound[currentIndex]);
    audio.play();
  } catch (error) {
    alert("Erreur lors de la lecture du fichier audio");
  }

}
