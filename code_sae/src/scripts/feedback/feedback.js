import { loadImages } from "./../inclusionImage.js";

//importation des styles
import "./../../styles/main.css"; // feuille de style générale
import "./../../styles/navigation.css";
import "./../../styles/feedback.css";
import "./../../styles/navigation.css";

document.addEventListener("DOMContentLoaded", () => {
  /**
   * Vérifie si l'utilisateur est connecté et si c'est bien un compte adulte
   */
  const userLoggedIn = JSON.parse(localStorage.getItem("userLoggedIn"));
  const currentPath = window.location.pathname;
  const publicPages = ["/connexion.html"];

  if (!userLoggedIn) {
    if (!publicPages.includes(currentPath)) {
      window.location.href = "/connexion.html";
      return;
    }
  } else {
    if (userLoggedIn.type !== "adulte") {
      if (!publicPages.includes(currentPath)) {
        window.location.href = "/accueil.html";
        return;
      }
    }
  }

  document.getElementById('logoApplication').addEventListener('click', function() {
    window.location.href = "/profil.html";
  });

  /**
   * Gère la déconnexion de l'utilisateur
   */
  const logoutLink = document.querySelector("#logout-link");
  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();

      localStorage.removeItem("userLoggedIn");
      sessionStorage.removeItem("enfantConnecte");
      sessionStorage.removeItem("adulteConnecte");

      window.location.href = "/connexion.html";
    });
  }
});

/**
 * Crée et affiche le formulaire pour que l'utilisateur saisisse son avis
 */
function createFeedbackForm() {
  const container = document.querySelector("#container");

  const form = document.createElement("form");
  form.className = "feedback-form";

  form.innerHTML = `
      <div class="form-group">
        <label for="rating">Note générale de l'application :</label>
        <div class="rating-container">
          ${[1, 2, 3, 4, 5]
            .map(
              (num) => `
            <input type="radio" id="star${num}" name="rating" value="${num}">
            <label for="star${num}">★</label>
          `
            )
            .join("")}
        </div>
      </div>
  
      <div class="form-group">
        <label for="usageFrequency">Fréquence d'utilisation :</label>
        <select id="usageFrequency" name="usageFrequency" required>
          <option value="">Sélectionnez une option</option>
          <option value="daily">Tous les jours</option>
          <option value="weekly">Plusieurs fois par semaine</option>
          <option value="monthly">Quelques fois par mois</option>
          <option value="rarely">Rarement</option>
        </select>
      </div>
  
      <div class="form-group">
        <label for="childProgress">Comment évaluez-vous les progrès de votre enfant ?</label>
        <select id="childProgress" name="childProgress" required>
          <option value="">Sélectionnez une option</option>
          <option value="excellent">Excellents progrès</option>
          <option value="good">Bons progrès</option>
          <option value="moderate">Progrès modérés</option>
          <option value="slow">Progrès lents</option>
        </select>
      </div>
  
      <div class="form-group">
        <label for="positivePoints">Points positifs de l'application :</label>
        <textarea id="positivePoints" name="positivePoints" rows="4" placeholder="Qu'appréciez-vous dans l'application ?"></textarea>
      </div>
  
      <div class="form-group">
        <label for="improvementPoints">Points à améliorer :</label>
        <textarea id="improvementPoints" name="improvementPoints" rows="4" placeholder="Quelles sont vos suggestions d'amélioration ?"></textarea>
      </div>
  
      <button type="submit" class="submit-btn">Envoyer mon avis</button>
    `;

  /*form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const feedback = {
      rating: formData.get("rating"),
      usageFrequency: formData.get("usageFrequency"),
      childProgress: formData.get("childProgress"),
      positivePoints: formData.get("positivePoints"),
      improvementPoints: formData.get("improvementPoints"),
      userId: JSON.parse(localStorage.getItem("userLoggedIn")).id,
      timestamp: new Date().toISOString(),
    };

    try {
      console.log("Feedback envoyé:", feedback);

      showMessage("Merci pour votre feedback !", "success");
      form.reset();
    } catch (error) {
      showMessage("Une erreur est survenue. Veuillez réessayer.", "error");
    }
  });*/

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const feedback = {
      rating: formData.get("rating"),
      usageFrequency: formData.get("usageFrequency"),
      childProgress: formData.get("childProgress"),
      positivePoints: formData.get("positivePoints"),
      improvementPoints: formData.get("improvementPoints"),
      userId: JSON.parse(localStorage.getItem("userLoggedIn")).id,
      timestamp: new Date().toISOString(),
    };

    try {
      // Appel de la fonction pour envoyer le feedback à la BDD
      await ajouterFeedback(
        Date.now(), // Générer un ID unique basé sur le timestamp
        feedback.userId,
        feedback.rating,
        feedback.usageFrequency,
        feedback.childProgress,
        feedback.positivePoints,
        feedback.improvementPoints
      );

      showMessage("Merci pour votre feedback !", "success");
      form.reset();
    } catch (error) {
      showMessage("Une erreur est survenue. Veuillez réessayer.", "error");
    }
  });

  container.appendChild(form);
}

/**
 * Affiche temporairement un message remerciant l'utilisateur pour avoir donné son avis
 *
 * @param {string} message - Le contenu du message
 * @param {string} type - Le type de message, peut être "success" ou "error"
 */
function showMessage(message, type) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = message;

  const container = document.querySelector("#container");
  container.insertBefore(messageDiv, container.firstChild);

  setTimeout(() => messageDiv.remove(), 5000);
}

document.addEventListener("DOMContentLoaded", () => {
  createFeedbackForm();
});

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const menubar = document.querySelector(".menubar");

  const logoutLinkMobile = document.querySelector(".menubar #logout-link");
  if (logoutLinkMobile) {
    logoutLinkMobile.addEventListener("click", (e) => {
      e.preventDefault();

      localStorage.removeItem("userLoggedIn");
      sessionStorage.removeItem("enfantConnecte");
      sessionStorage.removeItem("adulteConnecte");
      sessionStorage.clear();

      window.location.href = "/connexion.html";
    });
  }

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("hamburger-active");
    menubar.classList.toggle("active");
  });

  document.addEventListener("click", (event) => {
    if (!hamburger.contains(event.target) && !menubar.contains(event.target)) {
      hamburger.classList.remove("hamburger-active");
      menubar.classList.remove("active");
    }
  });
});

function ajouterFeedback(
  numero_feedback,
  username,
  nb_etoiles,
  frequence,
  progres_enfant,
  point_fort,
  point_amelioration
) {
  fetch("https://test-sae.onrender.com/api/feedback/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      numero_feedback,
      username,
      nb_etoiles,
      frequence,
      progres_enfant,
      point_fort,
      point_amelioration,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) alert("envoi du feedback");
      else alert("Erreur lors de l'envoi du feedback");
    })
    .catch((error) => {
      alert("Une erreur est survenue : " + error.message);
    });
}
