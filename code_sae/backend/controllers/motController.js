const connection = require('../config/db'); // Importer la connexion à la DB


/**
 * Exemple de fonction pour récupérer tous les mots
 *
 * @param {*} req
 * @param {*} res
 */
const getMot = (req, res) => {
  connection.query('SELECT * FROM Mot', (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des mots:', err);  // Correction du message
      return res.status(500).json({ error: 'Erreur de serveur' });
    }
    res.json(results); // Retourner les résultats en JSON
  });
};

module.exports = { getMot };
