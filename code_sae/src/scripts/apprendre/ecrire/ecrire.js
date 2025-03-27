import { checkWordMatch } from "./process.js";
import "../../../styles/ecrire.css";

import { fetchMot } from "./fetchMots";

import ennonceSound from "./../../../assets/sons/descriptionMJetA/description_apprendre/voix_apprendre_ecrire 1.mp3";
import { Consignes } from "./../../consignes/consignes.js";

import "../../../styles/ecrire.css";

export async function ecrireMot_Apprendre(modalBody) {
    const container = document.createElement("div");
    container.id = "mainContainer";

    // Audio consignes
    const audio = new Audio(ennonceSound);
    audio.play();

    // Mot aléatoire
    const mots = ["chat", "chien", "pomme", "maison"];
    const mot = mots[Math.floor(Math.random() * mots.length)];

    // Affichage du mot
    const wordToWrite = document.createElement("h2");
    wordToWrite.textContent = `Écris le mot : ${mot}`;
    wordToWrite.className = "wordDisplay";

    // Canevas de dessin
    const canvasContainer = document.createElement("div");
    canvasContainer.className = "canvasContainer";

    const backgroundCanvas = document.createElement("canvas");
    backgroundCanvas.id = "backgroundCanvas";
    backgroundCanvas.width = 800;
    backgroundCanvas.height = 450;

    const drawingCanvas = document.createElement("canvas");
    drawingCanvas.id = "drawingCanvas";
    drawingCanvas.width = 800;
    drawingCanvas.height = 450;

    canvasContainer.appendChild(backgroundCanvas);
    canvasContainer.appendChild(drawingCanvas);

    // Dessin sur canvas
    const ctx = drawingCanvas.getContext("2d");
    let isDrawing = false;
    let lastX = 0, lastY = 0;

    function getCoordinates(e) {
        const rect = drawingCanvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * (drawingCanvas.width / rect.width),
            y: (e.clientY - rect.top) * (drawingCanvas.height / rect.height)
        };
    }

    function startDrawing(e) {
        isDrawing = true;
        const { x, y } = getCoordinates(e);
        lastX = x;
        lastY = y;
    }

    function draw(e) {
        if (!isDrawing) return;
        const { x, y } = getCoordinates(e);
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        lastX = x;
        lastY = y;
    }

    function stopDrawing() {
        isDrawing = false;
    }

    drawingCanvas.addEventListener("mousedown", startDrawing);
    drawingCanvas.addEventListener("mousemove", draw);
    drawingCanvas.addEventListener("mouseup", stopDrawing);
    drawingCanvas.addEventListener("mouseout", stopDrawing);

    drawingCanvas.addEventListener("touchstart", startDrawing);
    drawingCanvas.addEventListener("touchmove", draw);
    drawingCanvas.addEventListener("touchend", stopDrawing);

    // Boutons
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "buttonContainer";

    const checkButton = document.createElement("button");
    checkButton.id = "checkButton";
    checkButton.textContent = "Vérifier";
    checkButton.addEventListener("click", () => {
        checkWordMatch(mot, drawingCanvas);
    });

    const clearButton = document.createElement("button");
    clearButton.id = "clearButton";
    clearButton.textContent = "Effacer";
    clearButton.addEventListener("click", () => {
        ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    });

    buttonContainer.appendChild(checkButton);
    buttonContainer.appendChild(clearButton);

    // Ajout des éléments
    container.appendChild(wordToWrite);
    container.appendChild(canvasContainer);
    container.appendChild(buttonContainer);
    modalBody.appendChild(container);
}
