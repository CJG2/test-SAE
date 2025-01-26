// realiserController.js

const db = require('../config/db'); // Importer le pool de connexions

/**
 * Exemple de fonction pour récupérer tous les exercices réalisés
 *
 * @param {*} req
 * @param {*} res
 */
const getExerciceRealise = async (req, res) => {
  try {
    const [results] = await db.execute('SELECT * FROM Realiser');
    res.json(results); // Retourner les résultats en JSON
  } catch (err) {
    console.error('Erreur lors de la récupération des exercices réalisés :', err);
    return res.status(500).json({ error: 'Erreur de serveur' });
  }
};

/**
 * Exemple de fonction pour récupérer tous les exercices réalisés par l'enfant numéro X
 *
 * @param {*} req
 * @param {*} res
 */
const getExerciceRealiseById = async (req, res) => {
  const { id } = req.params; // Récupérer l'ID de l'exercice depuis les paramètres de l'URL
  const query = 'SELECT * FROM Realiser WHERE id_enfant = ?';
  
  try {
    const [results] = await db.execute(query, [id]);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Exercice réalisé non trouvé' });
    }
    res.json(results[0]); // Retourner l'exercice réalisé trouvé
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'exercice réalisé:', err);
    return res.status(500).json({ error: 'Erreur de serveur' });
  }
};

/**
 * Fonction pour créer un exercice réalisé
 */
const createExerciceRealise = async (id_enfant, id_exercice, nb_tentative, score) => {
  const query = `
    INSERT INTO Realiser (id_enfant, id_exercice, nb_tentative, score)
    VALUES (?, ?, ?, ?)
  `;
  
  try {
    const [results] = await db.execute(query, [id_enfant, id_exercice, nb_tentative, score]);
    return results;
  } catch (err) {
    console.error('Erreur SQL:', err.message);
    console.error('Données insérées:', { id_enfant, id_exercice, nb_tentative, score });
    throw err;
  }
};

module.exports = {
  getExerciceRealise,
  getExerciceRealiseById,
  createExerciceRealise
};
