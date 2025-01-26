// exerciceController.js

const db = require('../config/db'); // Importer le pool de connexions

/**
 * Exemple de fonction pour récupérer tous les exercices
 *
 * @param {*} req
 * @param {*} res
 */
const getExercice = async (req, res) => {
  try {
    const [results] = await db.execute('SELECT * FROM Exercice');
    res.json(results); // Retourner les résultats en JSON
  } catch (err) {
    console.error('Erreur lors de la récupération des exercices:', err);  // Correction du message
    return res.status(500).json({ error: 'Erreur de serveur' });
  }
};

/**
 * Exemple de fonction pour récupérer un exercice par son id
 *
 * @param {*} req
 * @param {*} res
 */
const getExerciceById = async (req, res) => {
  const { id } = req.params; // Récupérer l'ID de l'exercice depuis les paramètres de l'URL
  const query = 'SELECT * FROM Exercice WHERE id_exercice = ?';
  
  try {
    const [results] = await db.execute(query, [id]);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Exercice non trouvé' });
    }
    res.json(results[0]); // Retourner l'exercice trouvé
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'exercice:', err);
    return res.status(500).json({ error: 'Erreur de serveur' });
  }
};

module.exports = { 
  getExercice,
  getExerciceById
};
