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
    console.log("🔹 Fonction checkWordMatch lancée");

    const drawingCanvas = document.getElementById("drawingCanvas");
    if (!drawingCanvas) {
        console.error("❌ Canvas non trouvé !");
        return;
    }

    const imageData = drawingCanvas.toDataURL("image/png");
    console.log("📷 Image Data récupérée :", imageData.length > 100 ? "OK" : "⚠️ VIDE !");

    // Vérifie si l'image a bien été récupérée
    if (imageData.length < 100) {
        alert("Problème avec le canvas, l'image ne se génère pas !");
        return;
    }

    // Charger le son
    const goodAnswer = new Audio(successSound);
    const wrongAnswer = new Audio(failSound);

    try {
        console.log("🔍 Début de la reconnaissance de texte...");
        const { data: { text } } = await Tesseract.recognize(imageData, 'fra', {
            logger: (m) => console.log("📝 Log Tesseract:", m),
            corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@latest/tesseract-core.wasm.js',
            workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@latest/src/worker.js',
        });

        console.log("✅ Texte reconnu :", text);
        if (!text.trim()) {
            alert("Tesseract n'a reconnu aucun texte. Essaye d'écrire plus lisiblement !");
            return;
        }

        // Nettoyage du texte reconnu
        const cleanedText = text.trim().toLowerCase();
        const cleanedWord = word.toLowerCase();

        // Supprime les accents
        const texteReconnuSansAccents = removeAccents(cleanedText);
        const motSansAccents = removeAccents(cleanedWord);

        // Mesurer la similarité entre le texte reconnu et le mot attendu
        const similarity = stringSimilarity.compareTwoStrings(texteReconnuSansAccents, motSansAccents);
        console.log(`📊 Similarité calculée : ${similarity}`);

        if (similarity > 0.45) {
            console.log("🎉 Mot correct !");
            goodAnswer.play();
            alert("Bravo, tu as bien écrit le mot !");
            modalBody.innerHTML = "";
            ecrireMot_Apprendre(modalBody);
        } else {
            console.log("❌ Mot incorrect !");
            wrongAnswer.play();
            alert("Dommage, essaie encore !");
        }
    } catch (error) {
        console.error("🚨 Erreur dans Tesseract :", error);
        alert("Une erreur est survenue lors de la reconnaissance du texte.");
    }
}