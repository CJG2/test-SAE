// motController.js

const db = require('../config/db'); // Importer le pool de connexions

/**
 * Exemple de fonction pour récupérer tous les mots
 *
 * @param {*} req
 * @param {*} res
 */
const getMot = async (req, res) => {
  try {
    const [results] = await db.execute('SELECT * FROM Mot');
    res.json(results); // Retourner les résultats en JSON
  } catch (err) {
    console.error('Erreur lors de la récupération des mots:', err);
    return res.status(500).json({ error: 'Erreur de serveur' });
  }
};

module.exports = { getMot };
