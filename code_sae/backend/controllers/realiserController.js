const connection = require('../config/db'); // Importer la connexion à la DB


/**
 * Exemple de fonction pour récupérer tous les exercices réalisés
 *
 * @param {*} req
 * @param {*} res
 */
const getExerciceRealise = (req, res) => {
  connection.query('SELECT * FROM Realiser', (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des exercices réalisés :', err);  // Correction du message
      return res.status(500).json({ error: 'Erreur de serveur' });
    }
    res.json(results); // Retourner les résultats en JSON
  });
};


/**
 * Exemple de fonction pour récupérer tous les exercices réalisés par l'enfant numéro X
 *
 * @param {*} req
 * @param {*} res
 */
const getExerciceRealiseById = (req, res) => {
    const { id } = req.params; // Récupérer l'ID de l'exercice depuis les paramètres de l'URL
    const query = 'SELECT * FROM Realiser WHERE id_enfant = ?';
    connection.query(query, [id], (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération de l\'exercice réalisé:', err);
        return res.status(500).json({ error: 'Erreur de serveur' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Exercice réalisé non trouvé' });
      }
      res.json(results[0]); // Retourner l'exercice réalisé trouvé
    });
};

function createExerciceRealise(id_enfant, id_exercice, nb_tentative, score) {
  const query = `
      INSERT INTO Realiser (id_enfant, id_exercice, nb_tentative, score)
      VALUES (?, ?, ?, ?)
  `;
  return new Promise((resolve, reject) => {
      connection.query(
          query,
          [id_enfant, id_exercice, nb_tentative, score],
          (err, results) => {
              if (err) {
                  console.error('Erreur SQL:', err.message); // Log détaillé
                  console.error('Données insérées:', { id_enfant, id_exercice, nb_tentative, score });
                  return reject(err);
              }
              resolve(results);
          }
      );
  });
}

module.exports = {
    getExerciceRealise,
    getExerciceRealiseById,
    createExerciceRealise
};
