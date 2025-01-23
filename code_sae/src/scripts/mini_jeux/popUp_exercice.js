// popUp_exercice.js

/**
 * Fonction pour afficher le modal et exécuter une fonction de l'exercice
 *
 * @export
 * @param {*} exerciceFunction
 */
export function openModal(exerciceFunction) {
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");

  // Réinitialiser le contenu du modal
  modalBody.innerHTML = "";

  // Appeler la fonction de l'exercice pour afficher son contenu
  exerciceFunction(modalBody);

  // Afficher le modal
  modal.style.display = "flex";
}

/**
 * Fonction pour fermer le modal
 *
 * @export
 */
export function closeModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
  document.getElementById("modal-body").innerHTML = ""; // Vider le contenu du modal
}

// Attacher l'événement de fermeture au bouton de fermeture du modal
document.querySelector(".close-button").addEventListener("click", closeModal);

// Fermer le modal si on clique en dehors du contenu
window.addEventListener("click", (event) => {
  if (event.target === document.getElementById("modal")) {
    closeModal();
  }
});
