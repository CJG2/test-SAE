const connection = require('../config/db'); // Importer la connexion à la DB

/**
 * Exemple de fonction pour récupérer tous les mots
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getMotContenu = (req, res) => {
  connection.query('SELECT * FROM Contenir', (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des mots:', err);  // Correction du message
      return res.status(500).json({ error: 'Erreur de serveur' });
    }
    res.json(results); // Retourner les résultats en JSON
  });
};


/**
 * Fonction pour récupérer les mots contenus dans la bdd par la clé primaire et étrangère de Exercice
 *
 * @param {*} req
 * @param {*} res
 */
const getMotContenuById = (req, res) => {
    const { id } = req.params; // Récupérer l'ID de l'exercice depuis les paramètres de l'URL
    const query = 'SELECT * FROM Contenir WHERE id_exercice = ?';
    connection.query(query, [id], (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération de l\'exercice:', err);
        return res.status(500).json({ error: 'Erreur de serveur' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Contenir non trouvé' });
      }
      res.json(results[0]); // Retourner l'exercice trouvé
    });
};

module.exports = { 
    getMotContenu,
    getMotContenuById
};
