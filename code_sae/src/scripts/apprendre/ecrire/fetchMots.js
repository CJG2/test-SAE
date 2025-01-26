/**
 * Fonction pour récupérer les mots depuis l'API
 *
 * @returns {*}
 */
export async function fetchMot() {
  const reponse = await fetch("https://test-sae.onrender.com/api/mot");
  const words = await reponse.json(); // Parse le JSON dans une variable

  var listeMots = [];
  for (var i = 0; i < words.length; i++) {
    listeMots.push(words[i].mot); // Accède au mot avec words[i].mot
  }

  return listeMots;
}
