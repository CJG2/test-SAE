import { fetchMot } from "./fetchMots";
import { checkWordMatch } from "./process";

import "../../../styles/ecrire.css";

/**
 * Fonction pour sélectionner des mots aléatoires dans la liste de mots récupérés par l'API
*
* @param {*} liste
* @returns {*}
*/
function selectRandomWord(liste) {
  if (!Array.isArray(liste) || liste.length === 0) {
    throw new Error("La liste doit être un tableau non vide.");
  }
  const randomIndex = Math.floor(Math.random() * liste.length);
  return liste[randomIndex];
}

/**
 * Fonction principale pour afficher l'application
*
* @export
* @async
* @param {*} modalBody
 * @returns {*}
 */
export async function ecrireMot_Apprendre(modalBody) {
  // Utiliser le modalBody comme conteneur principal
  const container = document.createElement("div");
  container.id = "mainContainer";
  
  // Récupérer les mots via l'API (assurer que fetchMot() retourne une liste de mots)
  const mots = await fetchMot(); // Cette ligne attend que fetchMot() renvoie les mots
  if (!mots || mots.length === 0) {
    throw new Error("Aucun mot disponible.");
  }
  
  // Sélectionner un mot aléatoire
  const mot = selectRandomWord(mots);
  
  // Affichage du mot à écrire
  const wordToWrite = document.createElement("h2");
  wordToWrite.textContent = `Écris le mot : ${mot}`;
  wordToWrite.style =
  "text-align: center; font-family: 'Joti-One', sans-serif; color: #333;";
  
  // Création des canevas superposés
  const canvasContainer = document.createElement("div");
  canvasContainer.style = `
  position: relative; 
  width: 100%; 
        height: 450px; 
        margin: 20px 0; 
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        `;
        
  // Canevas de fond pour le texte de référence
  const backgroundCanvas = document.createElement("canvas");
  backgroundCanvas.id = "backgroundCanvas";
  backgroundCanvas.width = 800;
  backgroundCanvas.height = 450;
  backgroundCanvas.style = `
  width: 100%; 
  height: 100%; 
  position: absolute; 
  top: 0; 
  left: 0; 
  z-index: 0; 
  background-color: #f5f5f5;
  `;
  const bgCtx = backgroundCanvas.getContext("2d");
  bgCtx.font = "150px 'Cursive'";
  bgCtx.fillStyle = "rgba(0, 0, 0, 0.15)";
  bgCtx.textAlign = "center";
  bgCtx.textBaseline = "middle";
  bgCtx.fillText(mot, backgroundCanvas.width / 2, backgroundCanvas.height / 2);
  
  // Canevas interactif pour le dessin
  const drawingCanvas = document.createElement("canvas");
  drawingCanvas.id = "drawingCanvas";
  drawingCanvas.width = 800;
  drawingCanvas.height = 450;
  drawingCanvas.style = `
  width: 100%; 
  height: 100%; 
  position: absolute; 
  top: 0; 
  left: 0; 
  z-index: 1; 
  border: none;
  cursor: crosshair;
  `;
  const ctx = drawingCanvas.getContext("2d");
  ctx.lineWidth = 8;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#000";
  
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;
  
  /**
   * Fonction pour obtenir les coordonnées (adaptées à la taille du canvas)
  *
  * @param {*} e
  * @param {*} canvas
  * @returns {{x: number, y: number}}
  */
 function getCoordinates(e, canvas) {
   const rect = canvas.getBoundingClientRect();
   if (e.touches) {
     const touch = e.touches[0];
     return {
        x: (touch.clientX - rect.left) * (canvas.width / rect.width),
        y: (touch.clientY - rect.top) * (canvas.height / rect.height),
      };
    } else {
      return {
        x: (e.clientX - rect.left) * (canvas.width / rect.width),
        y: (e.clientY - rect.top) * (canvas.height / rect.height),
      };
    }
  }

  /**
   * Fonction pour commencer à dessiner
  *
  * @param {*} e
  */
 function startDrawing(e) {
   e.preventDefault(); // Empêche les comportements par défaut
   isDrawing = true;
   const { x, y } = getCoordinates(e, drawingCanvas);
   lastX = x;
   lastY = y;
  }
  
  /**
   * Fonction pour dessiner sur le canevas
  *
  * @param {*} e
   */
  function draw(e) {
    if (!isDrawing) return;
    e.preventDefault(); // Empêche le comportement par défaut
    const { x, y } = getCoordinates(e, drawingCanvas);
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    lastX = x;
    lastY = y;
  }
  
  /**
   * Fonction pour arrêter de dessiner
  *
  * @param {*} e
  */
 function stopDrawing(e) {
   e.preventDefault();
   isDrawing = false;
  }
  
  // Attacher les événements pour la souris
  drawingCanvas.addEventListener("mousedown", startDrawing);
  drawingCanvas.addEventListener("mousemove", draw);
  drawingCanvas.addEventListener("mouseup", stopDrawing);
  drawingCanvas.addEventListener("mouseout", stopDrawing);
  
  // Attacher les événements pour le tactile
  drawingCanvas.addEventListener("touchstart", startDrawing);
  drawingCanvas.addEventListener("touchmove", draw);
  drawingCanvas.addEventListener("touchend", stopDrawing);
  drawingCanvas.addEventListener("touchcancel", stopDrawing);

  // Boutons de contrôle
  const buttonContainer = document.createElement("div");
  buttonContainer.style = "text-align: center; margin-top: 20px;";
  
  const checkButton = document.createElement("button");
  checkButton.textContent = "Vérifier";
  checkButton.style = `
  padding: 10px 20px; 
  margin: 5px; 
  font-size: 16px; 
  background-color: #28a745; 
  color: #fff; 
  border: none; 
  border-radius: 4px; 
  cursor: pointer;
  `;
  checkButton.addEventListener("click", () => {
    checkWordMatch(mot, modalBody);
  });
  
  const clearButton = document.createElement("button");
  clearButton.textContent = "Effacer";
  clearButton.style = `
  padding: 10px 20px; 
  margin: 5px; 
  font-size: 16px; 
  background-color: #dc3545; 
  color: #fff; 
  border: none; 
  border-radius: 4px; 
  cursor: pointer;
  `;
  clearButton.addEventListener("click", () => {
    ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
  });
  
  buttonContainer.appendChild(checkButton);
  buttonContainer.appendChild(clearButton);
  
  // Ajouter les canevas et les boutons au panneau
  canvasContainer.appendChild(backgroundCanvas);
  canvasContainer.appendChild(drawingCanvas);
  
  const writingPanel = document.createElement("div");
  writingPanel.id = "writingPanel";
  writingPanel.appendChild(wordToWrite);
  writingPanel.appendChild(canvasContainer);
  writingPanel.appendChild(buttonContainer);
  
  // Ajouter le panneau au modalBody
  modalBody.appendChild(writingPanel);
}
