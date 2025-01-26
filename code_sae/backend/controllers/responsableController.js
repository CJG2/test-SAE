const db = require('../config/db');  // Importer le pool de connexions

/**
 * Fonction pour récupérer tous les responsables
 */
const getResponsable = async (req, res) => {
  try {
    const [results] = await db.execute('SELECT * FROM Responsable');
    res.json(results);
  } catch (err) {
    console.error('Erreur lors de la récupération des responsables:', err);
    return res.status(500).json({ error: 'Erreur de serveur' });
  }
};

/**
 * Fonction pour récupérer un responsable spécifique par son ID
 */
const getResponsableById = async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await db.execute('SELECT * FROM Responsable WHERE username = ?', [id]);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Responsable non trouvé' });
    }
    res.json(results[0]);
  } catch (err) {
    console.error('Erreur lors de la récupération du responsable:', err);
    return res.status(500).json({ error: 'Erreur de serveur' });
  }
};

/**
 * Fonction pour créer un nouvel responsable
 */
const createResponsable = async (email, password, nom, prenom, jour, mois, annee, civilite, pays, sel, telephone) => {
  const query = `
      INSERT INTO Responsable (username, hash, nom_adulte, prenom_adulte, date_naissance, genre, nationalite, sel, date_creation, numeroTelephone)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, DEFAULT, ?)
  `;
  try {
    const [results] = await db.execute(query, [email, password, nom, prenom, `${annee}-${mois}-${jour}`, civilite, pays, sel, telephone]);
    return results;
  } catch (err) {
    console.error('Erreur SQL:', err.message);
    throw err;
  }
};

/**
 * Fonction pour modifier les informations d'un responsable
 */
const updateResponsable = async (newUsername, newNom, hash, sel, newPrenom, newDateNaiss, newGenre, newNationalite, telephone, username) => {
  const query = `
      UPDATE Responsable
      SET username = ?, nom_adulte = ?, hash = ?, sel = ?, prenom_adulte = ?, date_naissance = ?, genre = ?, nationalite = ?, numeroTelephone = ?
      WHERE username = ?
  `;
  try {
    const [results] = await db.execute(query, [newUsername, newNom, hash, sel, newPrenom, newDateNaiss, newGenre, newNationalite, telephone, username]);
    if (results.affectedRows === 0) {
      throw new Error('Aucun utilisateur trouvé avec ce username.');
    }
    return results;
  } catch (err) {
    console.error('Erreur SQL:', err.message);
    throw err;
  }
};

/**
 * Fonction pour modifier le mot de passe d'un Responsable
 */
const updatePasswordResponsable = async (username, newPassword, newSel) => {
  const query = `
      UPDATE Responsable
      SET hash = ?, sel = ?
      WHERE username = ?
  `;
  try {
    const [results] = await db.execute(query, [newPassword, newSel, username]);
    if (results.affectedRows === 0) {
      throw new Error('Aucun utilisateur trouvé avec ce username.');
    }
    return results;
  } catch (err) {
    console.error('Erreur SQL:', err.message);
    throw err;
  }
};

/**
 * Fonction pour supprimer un responsable
 */
const deleteResponsable = async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await db.execute('DELETE FROM Responsable WHERE username = ?', [id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Responsable non trouvé' });
    }
    res.json({ message: 'Responsable supprimé avec succès' });
  } catch (err) {
    console.error('Erreur lors de la suppression du responsable:', err);
    return res.status(500).json({ error: 'Erreur de serveur' });
  }
};

module.exports = { 
  getResponsable, 
  getResponsableById,
  createResponsable,
  updateResponsable,
  updatePasswordResponsable,
  deleteResponsable
};
