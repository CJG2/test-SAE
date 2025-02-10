const express = require("express");
const router = express.Router();
const {
  getEnfant, // Fonction pour récupérer tous les enfants
  getEnfantById, // Fonction pour récupérer un enfant spécifique par son ID
  getEnfantByResponsableId, // Fonction pour récupérer un enfant spécifique par l'ID du responsable
  createEnfant, // Fonction pour créer un enfant
  updateEnfant, // Fonction pour mettre à jour un enfant
  updateUsernameEnfant,
  deleteEnfant, // Fonction pour supprimer un enfant
} = require("../controllers/enfantController"); // Importer le contrôleur

// Route pour récupérer tous les enfants
router.get("/Enfant", getEnfant);

// Route pour récupérer un enfant spécifique par son ID
router.get("/Enfant/:id", getEnfantById);

router.get("/Enfant/:username", getEnfantByResponsableId);

// Route pour créer un nouvel enfant
router.post("/Enfant/create", async (req, res) => {

  const { nom, prenom, jour, mois, annee, genre, username, dys} = req.body;

  if (!nom || !prenom || !jour || !mois || !annee || !genre || !username || !dys) {
    return res
      .status(400)
      .json({ success: false, error: "Tous les champs sont requis." });
  }

  try {
    const result = await createEnfant(
      nom,
      prenom,
      jour,
      mois,
      annee,
      genre,
      username,
      dys
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    console.error("Erreur lors de la création de l'enfant :", err.message);
    res
      .status(500)
      .json({
        success: false,
        error: "Une erreur est survenue lors de la création.",
      });
  }
});

// Route pour mettre à jour le usernmae d'un Enfant
router.put('/enfant/update', async (req, res) => {
  const { newNom, newPrenom, newDateNaiss, newGenre, dys, id } = req.body;

  try {
      const result = await updateEnfant(newNom, newPrenom, newDateNaiss, newGenre, dys, id);
      res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
      console.error('Erreur lors de la mise à jour des informations de l\'enfant :', err.message);
      res.status(500).json({ success: false, error: err.message });
  }
});

// Route pour mettre à jour le usernmae d'un Enfant
router.put('/enfant/updateUsername', async (req, res) => {
  const { newUsername, username } = req.body;

  try {
      const result = await updateUsernameEnfant(newUsername, username);
      res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
      console.error('Erreur lors de la mise à jour du username de l\'enfant :', err.message);
      res.status(500).json({ success: false, error: err.message });
  }
});

// Route pour supprimer un enfant spécifique par son ID
router.delete("/Enfant/:id", deleteEnfant);

// Exporter les routes pour qu'elles soient utilisées dans `app.js`
module.exports = router;
