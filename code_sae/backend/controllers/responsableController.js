const connection = require('../config/db'); // Importer la connexion à la DB


/**
 * Exemple de fonction pour récupérer tous les responsables
 *
 * @param {*} req
 * @param {*} res
 */
const getResponsable = (req, res) => {
  connection.query('SELECT * FROM Responsable', (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des responsables:', err);
      return res.status(500).json({ error: 'Erreur de serveur' });
    }
    res.json(results); // Retourner les résultats en JSON
  });
};


/**
 * Fonction pour récupérer un responsable spécifique par son ID
 *
 * @param {*} req
 * @param {*} res
 */
const getResponsableById = (req, res) => {
  const { id } = req.params; // Récupérer l'ID de l'responsable depuis les paramètres de l'URL
  const query = 'SELECT * FROM Responsable WHERE username = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération de l\'responsable:', err);
      return res.status(500).json({ error: 'Erreur de serveur' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Responsable non trouvé' });
    }
    res.json(results[0]); // Retourner l'responsable trouvé
  });
};

/**
 * Fonction pour créer un nouvel responsable
 * 
 * @param {*} email 
 * @param {*} password 
 * @param {*} nom 
 * @param {*} prenom 
 * @param {*} jour 
 * @param {*} mois 
 * @param {*} annee 
 * @param {*} civilite 
 * @param {*} pays 
 * @param {*} sel
 * @param {*} telephone 
 * @returns 
 */
function createResponsable(email, password, nom, prenom, jour, mois, annee, civilite, pays, sel, telephone) 
{
  const query = `
      INSERT INTO Responsable (username, hash, nom_adulte, prenom_adulte, date_naissance, genre, nationalite, sel, date_creation, numeroTelephone)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, DEFAULT, ?)
  `;
  return new Promise((resolve, reject) => {
      connection.query(
          query,
          [email, password, nom, prenom, `${annee}-${mois}-${jour}`, civilite, pays, sel, telephone],
          (err, results) => {
              if (err) {
                  console.error('Erreur SQL:', err.message); // Log détaillé
                  console.error('Données insérées:', { email, password, nom, prenom, jour, mois, annee, civilite, pays, sel, telephone });
                  return reject(err);
              }
              resolve(results);
          }
      );
  });
}


/**
 * Fonction pour modifier les informations d'un responsable
 * 
 * @param {*} newUsername
 * @param {*} newNom
 * @param {*} hash
 * @param {*} sel
 * @param {*} newPrenom 
 * @param {*} newDateNaiss 
 * @param {*} newGenre
 * @param {*} newNationalite
 * @param {*} telephone
 * @param {*} username 
 * @returns 
 */
function updateResponsable(newUsername, newNom, hash, sel, newPrenom, newDateNaiss, newGenre, newNationalite, telephone, username) 
{
  const query = `
      UPDATE Responsable
      SET username = ?,
      nom_adulte = ?,
      hash = ?,
      sel = ?,
      prenom_adulte = ?,
      date_naissance = ?,
      genre = ?,
      nationalite = ?,
      numeroTelephone = ?
      WHERE username = ?
  `;

  return new Promise((resolve, reject) => {
    connection.query(
      query,
      [newUsername, newNom, hash, sel, newPrenom, newDateNaiss, newGenre, newNationalite, telephone, username],
      (err, results) => {
        if (err) 
        {
          console.error('Erreur SQL:', err.message); // Log détaillé
          console.error('Données utilisées:', { newUsername, newNom, hash, sel, newPrenom, newDateNaiss, newGenre, newNationalite, telephone, username });
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
 * Fonction pour modifier le mot de passe d'un Responsable
 * 
 * @param {*} username
 * @param {*} newPassword 
 * @param {*} newSel
 * @returns 
 */
function updatePasswordResponsable(username, newPassword, newSel) 
{
  const query = `
      UPDATE Responsable
      SET hash = ?, sel = ?
      WHERE username = ?
  `;

  return new Promise((resolve, reject) => {
    connection.query(
      query,
      [newPassword, newSel, username],
      (err, results) => {
        if (err) 
        {
          console.error('Erreur SQL:', err.message); // Log détaillé
          console.error('Données utilisées:', { username, newPassword, newSel });
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
 * Fonction pour supprimer un responsable
 * 
 * @param {*} req 
 * @param {*} res 
 */
const deleteResponsable = (req, res) => {
  const { id } = req.params; // Récupérer l'ID de l'responsable depuis les paramètres de l'URL
  const query = 'DELETE FROM Responsable WHERE username = ?';
  
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la suppression de l\'responsable:', err);
      return res.status(500).json({ error: 'Erreur de serveur' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Responsable non trouvé' });
    }
    res.json({ message: 'Responsable supprimé avec succès' });
  });
};

module.exports = { 
  getResponsable, 
  getResponsableById,
  createResponsable,
  updateResponsable,
  updatePasswordResponsable,
  deleteResponsable
};
