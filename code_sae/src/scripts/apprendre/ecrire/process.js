import Tesseract from 'tesseract.js';
import stringSimilarity from 'string-similarity';

import { ecrireMot_Apprendre } from './ecrire';

import successSound from './../../../assets/sons/appSound/goodAnswer.mp3';
import failSound from './../../../assets/sons/appSound/wrongAnswer.mp3';

/**
 * Fonction qui permet de supprimer les accents des mots
 *
 * @param {*} str
 * @returns {*}
 */
function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Fonction pour vérifier si le mot écrit correspond
 *
 * @async
 * @param {*} word
 * @param {*} modalBody
 * @returns {*}
 */
export async function checkWordMatch(word, modalBody) {
    alert("Vérification en cours...");
    const drawingCanvas = document.getElementById("drawingCanvas");
    const imageData = drawingCanvas.toDataURL();
    // Charger le son
    const goodAnswer = new Audio(successSound);
    const wrongAnswer = new Audio(failSound);

    // Utilisation de Tesseract.js pour la reconnaissance de texte
    Tesseract.recognize(imageData, 'fra', {
        logger: (m) => console.log(m),
    }).then(({ data: { text } }) => {
        const cleanedText = text.trim().toLowerCase();
        const cleanedWord = word.toLowerCase();

        // Supprimer les accents pour comparaison
        const texteReconnuSansAccents = removeAccents(cleanedText);
        const motSansAccents = removeAccents(cleanedWord);

        // Mesurer la similarité entre le texte reconnu et le mot attendu
        const similarity = stringSimilarity.compareTwoStrings(texteReconnuSansAccents, motSansAccents);
        console.log(`Texte reconnu : ${cleanedText}`);
        console.log(`Similarité : ${similarity}`);

        // Si la similarité est supérieure à 0.5 (50%), on considère que c'est correct
        if (similarity > 0.45) {
            goodAnswer.play(); // Jouer le son de réussite
            alert("Bravo, tu as bien écrit le mot !");
            modalBody.innerHTML = ""; // Nettoyer le conteneur
            ecrireMot_Apprendre(modalBody); // Relancer le processus
        } else {
            wrongAnswer.play(); // Jouer le son d'erreur
            alert("Dommage, essaie encore !");
        }
    });
}
