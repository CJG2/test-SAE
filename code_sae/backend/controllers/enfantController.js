// enfantController.js

const db = require('../config/db'); // Importer le pool de connexions

/**
 * Fonction pour récupérer tous les enfants
 *
 * @param {*} req
 * @param {*} res
 */
const getEnfant = async (req, res) => {
  const query = 'SELECT * FROM Enfant';
  try {
    const [results] = await db.execute(query);
    res.json(results); // Retourner les résultats en JSON
  } catch (err) {
    console.error('Erreur lors de la récupération des enfants:', err);
    return res.status(500).json({ error: 'Erreur de serveur' });
  }
};

/**
 * Fonction pour récupérer un enfant spécifique par son ID
 *
 * @param {*} req
 * @param {*} res
 */
const getEnfantById = async (req, res) => {
  const { id } = req.params; // Récupérer l'ID de l'enfant depuis les paramètres de l'URL
  const query = 'SELECT * FROM Enfant WHERE id_enfant = ?';
  
  try {
    const [results] = await db.execute(query, [id]);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Enfant non trouvé' });
    }
    res.json(results[0]); // Retourner l'enfant trouvé
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'enfant:', err);
    return res.status(500).json({ error: 'Erreur de serveur' });
  }
};

/**
 * Fonction pour récupérer un enfant spécifique par l'ID de son responsable
 *
 * @param {*} req
 * @param {*} res
 */
const getEnfantByResponsableId = async (req, res) => {
  const { username } = req.params; // Récupérer le username de l'enfant depuis les paramètres de l'URL
  const query = 'SELECT * FROM Enfant WHERE username = ?';
  
  try {
    const [results] = await db.execute(query, [username]);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Enfant non trouvé' });
    }
    res.json(results[0]); // Retourner l'enfant trouvé
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'enfant:', err);
    return res.status(500).json({ error: 'Erreur de serveur' });
  }
};

/**
 * Fonction pour créer un nouvel enfant
 *
 * @param {*} req
 * @param {*} res
 */
const createEnfant = async (req, res) => {
  const { nom, prenom, jour, mois, annee, genre, username, dys } = req.body;
  const query = `
    INSERT INTO Enfant (nom_enfant, prenom_enfant, date_naissance, genre, username, date_creation, dys)
    VALUES (?, ?, ?, ?, ?, DEFAULT, ?)
  `;
  
  try {
    const [results] = await db.execute(query, [nom, prenom, `${annee}-${mois}-${jour}`, genre, username, dys]);
    res.json({ message: 'Enfant créé avec succès', id_enfant: results.insertId });
  } catch (err) {
    console.error('Erreur lors de la création de l\'enfant:', err);
    return res.status(500).json({ error: 'Erreur de serveur' });
  }
};

/**
 * Fonction pour mettre à jour un enfant
 *
 * @param {*} req
 * @param {*} res
 */
const updateEnfant = async (req, res) => {
  const { id } = req.params;
  const { newNom, newPrenom, newDateNaiss, newGenre, dys } = req.body;
  const query = `
    UPDATE Enfant
    SET nom_enfant = ?, prenom_enfant = ?, date_naissance = ?, genre = ?, dys = ?
    WHERE id_enfant = ?
  `;
  
  try {
    const [results] = await db.execute(query, [newNom, newPrenom, newDateNaiss, newGenre, dys, id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Enfant non trouvé' });
    }
    res.json({ message: 'Enfant mis à jour avec succès' });
  } catch (err) {
    console.error('Erreur lors de la mise à jour de l\'enfant:', err);
    return res.status(500).json({ error: 'Erreur de serveur' });
  }
};

/**
 * Fonction pour modifier le username d'un Enfant
 * 
 * @param {*} req
 * @param {*} res
 */
const updateUsernameEnfant = async (req, res) => {
  const { newUsername, username } = req.body;
  const query = `
    UPDATE Enfant
    SET username = ?
    WHERE username = ?
  `;
  
  try {
    const [results] = await db.execute(query, [newUsername, username]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Enfant non trouvé' });
    }
    res.json({ message: 'Username mis à jour avec succès' });
  } catch (err) {
    console.error('Erreur lors de la mise à jour du username de l\'enfant:', err);
    return res.status(500).json({ error: 'Erreur de serveur' });
  }
};

/**
 * Fonction pour supprimer un enfant
 *
 * @param {*} req
 * @param {*} res
 */
const deleteEnfant = async (req, res) => {
  const { id } = req.params; // Récupérer l'ID de l'enfant depuis les paramètres de l'URL
  const query = 'DELETE FROM Enfant WHERE id_enfant = ?';
  
  try {
    const [results] = await db.execute(query, [id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Enfant non trouvé' });
    }
    res.json({ message: 'Enfant supprimé avec succès' });
  } catch (err) {
    console.error('Erreur lors de la suppression de l\'enfant:', err);
    return res.status(500).json({ error: 'Erreur de serveur' });
  }
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
