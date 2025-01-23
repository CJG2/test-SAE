import CryptoJS from "crypto-js";

/**
 * Fonction pour générer un nombre entier aléatoire entre le min et le max
 *
 * @param {*} min
 * @param {*} max
 * @returns {*}
 */
export function randint(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Fonction qui retourne un sel aléatoire pour le hachage du mot de passe
 *
 * @returns {string}
 */
function genereSel() {
  const alphabet =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
  let sel = "";
  const tailleSel = randint(4, 8);

  for (let i = 0; i < tailleSel; i++) {
    const indice = randint(0, alphabet.length - 1);
    sel += alphabet[indice];
  }
  return sel;
}

/**
 * Fonction assurant le hachage des mots de passe avec le sel visant à sécuriser les mots de passe des utilisateurs
 *
 * @export
 * @param {*} mdp
 * @returns {{hash: any, sel: string}}
 */
export function hachage(mdp, bool) {
  let sel = "";
  if (bool) {
    // Vérifie si bool est vrai
    sel = genereSel();
    mdp += sel;
  }

  const hash = CryptoJS.SHA3(mdp, { outputLength: 512 }).toString(
    CryptoJS.enc.Hex
  );

  if (bool) return { hash, sel };

  return hash;
}
