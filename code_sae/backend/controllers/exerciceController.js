const connection = require('../config/db'); // Importer la connexion à la DB


/**
 * Exemple de fonction pour récupérer tous les exercices
 *
 * @param {*} req
 * @param {*} res
 */
const getExercice = (req, res) => {
  connection.query('SELECT * FROM Exercice', (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des mots:', err);  // Correction du message
      return res.status(500).json({ error: 'Erreur de serveur' });
    }
    res.json(results); // Retourner les résultats en JSON
  });
};


/**
 * Exemple de fonction pour récupérer tous les exercice par leur id
 *
 * @param {*} req
 * @param {*} res
 */
const getExerciceById = (req, res) => {
    const { id } = req.params; // Récupérer l'ID de l'exercice depuis les paramètres de l'URL
    const query = 'SELECT * FROM Exercice WHERE id_exercice = ?';
    connection.query(query, [id], (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération de l\'exercice:', err);
        return res.status(500).json({ error: 'Erreur de serveur' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Exercice non trouvé' });
      }
      res.json(results[0]); // Retourner l'exercice trouvé
    });
};

module.exports = { 
    getExercice,
    getExerciceById
};
