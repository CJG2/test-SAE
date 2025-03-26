// feedbackController.js

const db = require("../config/db"); // Importer le pool de connexions

/**
 * Exemple de fonction pour récupérer tous les feedbacks
 *
 * @param {*} req
 * @param {*} res
 */
const getFeedback = async (req, res) => {
  try {
    const [results] = await db.execute("SELECT * FROM Feedback");
    res.json(results); // Retourner les résultats en JSON
  } catch (err) {
    console.error("Erreur lors de la récupération des feedbacks:", err);
    return res.status(500).json({ error: "Erreur de serveur" });
  }
};

const createFeedback = async (
  numero_feedback,
  username,
  nb_etoiles,
  frequence,
  progres_enfant,
  point_fort,
  point_amelioration
) => {
  const query = `
        INSERT INTO Feedback (numero_feedback,
  username,
  nb_etoiles,
  frequence,
  progres_enfant,
  point_fort,
  point_amelioration)
        VALUES (DEFAULT, ?, ?, ?, ?, ?, ?)
    `;
  try {
    const [results] = await db.execute(query, [
      numero_feedback,
      username,
      nb_etoiles,
      frequence,
      progres_enfant,
      point_fort,
      point_amelioration,
    ]);
    return results;
  } catch (err) {
    console.error("Erreur SQL:", err.message);
    throw err;
  }
};

module.exports = { getFeedback, createFeedback };
