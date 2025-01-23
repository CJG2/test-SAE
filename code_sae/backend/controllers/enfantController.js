const connection = require('../config/db'); // Importer la connexion à la base de données


/**
 * Fonction pour récupérer tous les enfants
 *
 * @param {*} req
 * @param {*} res
 */
const getEnfant = (req, res) => {
  const query = 'SELECT * FROM Enfant';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des enfants:', err);
      return res.status(500).json({ error: 'Erreur de serveur' });
    }
    res.json(results); // Retourner les résultats en JSON
  });
};


/**
 * Fonction pour récupérer un enfant spécifique par son ID
 *
 * @param {*} req
 * @param {*} res
 */
const getEnfantById = (req, res) => {
  const { id } = req.params; // Récupérer l'ID de l'enfant depuis les paramètres de l'URL
  const query = 'SELECT * FROM Enfant WHERE id_enfant = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération de l\'enfant:', err);
      return res.status(500).json({ error: 'Erreur de serveur' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Enfant non trouvé' });
    }
    res.json(results[0]); // Retourner l'enfant trouvé
  });
};

/**
 * Fonction pour récupérer un enfant spécifique par l'ID de son responsable
 *
 * @param {*} req
 * @param {*} res
 */
const getEnfantByResponsableId = (req, res) => {
  const { username } = req.params; // Récupérer l'ID de l'enfant depuis les paramètres de l'URL
  const query = 'SELECT * FROM Enfant WHERE username = ?';
  connection.query(query, [username], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération de l\'enfant:', err);
      return res.status(500).json({ error: 'Erreur de serveur' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Enfant non trouvé' });
    }
    res.json(results[0]); // Retourner l'enfant trouvé
  });
};


/**
 * Fonction pour créer un nouvel enfant
 *
 * @param {*} req
 * @param {*} res
 */
function createEnfant(nom, prenom, jour, mois, annee, genre, username) {
  const query = `
    INSERT INTO Enfant (nom_enfant, prenom_enfant, date_naissance, genre, username, date_creation)
    VALUES (?, ?, ?, ?, ?, DEFAULT)
  `;

  return new Promise((resolve, reject) => {
    connection.query(
      query,
      [nom, prenom, `${annee}-${mois}-${jour}`, genre, username],
      (err, results) => {
        if(err) {
          console.error('Erreur SQL:', err.message); // Log détaillé
          console.error('Données insérées:', { nom, prenom, jour, mois, annee, genre, username });
          return reject(err);
        }
        resolve(results);
      }
    );
  });
}


/**
 * Fonction pour mettre à jour un enfant
 *
 * @param {*} newNom
 * @param {*} newPrenom
 * @param {*} newDateNaiss
 * @param {*} newGenre
 * @param {*} newNationalite
 * @param {*} id
 */
function updateEnfant(newNom, newPrenom, newDateNaiss, newGenre, id) 
{
  const query = `
      UPDATE Enfant
      SET nom_enfant = ?,
      prenom_enfant = ?,
      date_naissance = ?,
      genre = ?
      WHERE id_enfant = ?
  `;

  return new Promise((resolve, reject) => {
    connection.query(
      query,
      [newNom, newPrenom, newDateNaiss, newGenre, id],
      (err, results) => {
        if (err) 
        {
          console.error('Erreur SQL:', err.message); // Log détaillé
          console.error('Données utilisées:', { newNom, newPrenom, newDateNaiss, newGenre, id });
          return reject(err);
        }

        if (results.affectedRows === 0) 
        {
          console.warn('Aucun enfant trouvé avec cet identifiant :', id);
          return reject(new Error("Aucun enfant trouvé avec cet identifiant."));
        }

        resolve(results);
      }
    );
  });
}


/**
 * Fonction pour modifier le username d'un Enfant
 * 
 * @param {*} newUsername
 * @param {*} username 
 * @returns 
 */
function updateUsernameEnfant(newUsername, username) 
{
  const query = `
      UPDATE Enfant
      SET username = ?
      WHERE username = ?
  `;

  return new Promise((resolve, reject) => {
    connection.query(
      query,
      [newUsername, username],
      (err, results) => {
        if (err) 
        {
          console.error('Erreur SQL:', err.message); // Log détaillé
          console.error('Données utilisées:', { newUsername, username });
          return reject(err);
        }

        if (results.affectedRows === 0) 
        {
          console.warn('Aucun responsable trouvé avec ce username:', username);
          return reject(new Error("Aucun utilisateur trouvé avec ce username."));
        }

        resolve(results);
      }
    );
  });
}


/**
 * Fonction pour supprimer un enfant
 *
 * @param {*} req
 * @param {*} res
 */
const deleteEnfant = (req, res) => {
  const { id } = req.params; // Récupérer l'ID de l'enfant depuis les paramètres de l'URL
  const query = 'DELETE FROM Enfant WHERE id_enfant = ?';
  
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la suppression de l\'enfant:', err);
      return res.status(500).json({ error: 'Erreur de serveur' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Enfant non trouvé' });
    }
    res.json({ message: 'Enfant supprimé avec succès' });
  });
};

module.exports = {
  getEnfant,
  getEnfantById,
  getEnfantByResponsableId,
  createEnfant,
  updateEnfant,
  updateUsernameEnfant,
  deleteEnfant
};
