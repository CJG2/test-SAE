import Tesseract from 'tesseract.js';
import stringSimilarity from 'string-similarity';
import successSound from './../../../assets/sons/appSound/goodAnswer.mp3';
import failSound from './../../../assets/sons/appSound/wrongAnswer.mp3';

export function checkWordMatch(expectedWord, canvas) {
    const imageData = canvas.toDataURL();
    const goodAnswer = new Audio(successSound);
    const wrongAnswer = new Audio(failSound);

    Tesseract.recognize(imageData, 'fra', {
        logger: (m) => console.log(m),
    }).then(({ data: { text } }) => {
        const cleanedText = text.trim().toLowerCase();
        const cleanedWord = expectedWord.toLowerCase();

        const similarity = stringSimilarity.compareTwoStrings(cleanedText, cleanedWord);
        console.log(`Texte reconnu : ${cleanedText}, Similarité : ${similarity}`);

        if (similarity > 0.45) {
            goodAnswer.play();
            alert("Bravo, tu as bien écrit le mot !");
        } else {
            wrongAnswer.play();
            alert("Dommage, essaie encore !");
        }
    }).catch(err => console.error("Erreur Tesseract : ", err));
}
