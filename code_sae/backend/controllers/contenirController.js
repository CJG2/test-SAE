// contenirController.js

const db = require('../config/db'); // Importer le pool de connexions

/**
 * Exemple de fonction pour récupérer tous les mots
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getMotContenu = async (req, res) => {
  try {
    const [results] = await db.execute('SELECT * FROM Contenir');
    res.json(results); // Retourner les résultats en JSON
  } catch (err) {
    console.error('Erreur lors de la récupération des mots:', err);  // Correction du message
    return res.status(500).json({ error: 'Erreur de serveur' });
  }
};

/**
 * Fonction pour récupérer les mots contenus dans la bdd par la clé primaire et étrangère de Exercice
 *
 * @param {*} req
 * @param {*} res
 */
const getMotContenuById = async (req, res) => {
  const { id } = req.params; // Récupérer l'ID de l'exercice depuis les paramètres de l'URL
  const query = 'SELECT * FROM Contenir WHERE id_exercice = ?';
  
  try {
    const [results] = await db.execute(query, [id]);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Contenir non trouvé' });
    }
    res.json(results[0]); // Retourner le résultat trouvé
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'exercice:', err);
    return res.status(500).json({ error: 'Erreur de serveur' });
  }
};

module.exports = { 
  getMotContenu,
  getMotContenuById
};
