const express = require('express');
const router = express.Router();
const { 
    getResponsable, 
    getResponsableById,
    createResponsable,
    updateResponsable,
    updatePasswordResponsable,
    deleteResponsable
} = require('../controllers/responsableController.js'); // Importer le contrôleur

router.get('/responsable', getResponsable); // Lier la route à la fonction de récupération des responsables

// Route pour récupérer tous les responsables
router.get('/responsable/:id', getResponsableById);

// Route pour créer un nouvel responsable
router.post('/create', async (req, res) => {
    const { email, password, nom, prenom, jour, mois, annee, civilite, pays, sel, telephone } = req.body;

    try {
        const result = await createResponsable(email, password, nom, prenom, jour, mois, annee, civilite, pays, sel, telephone);
        res.status(201).json({ success: true, id: result.insertId });
    } catch (err) {
        console.error('Erreur lors de la création de l\'responsable :', err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Route pour mettre à jour les informations d'un responsable
router.put('/responsable/update', async (req, res) => {
    const { newUsername, newNom, hash, sel, newPrenom, newDateNaiss, newGenre, newNationalite, telephone, username } = req.body;

    try {
        const result = await updateResponsable(newUsername, newNom, hash, sel, newPrenom, newDateNaiss, newGenre, newNationalite, telephone, username);
        res.status(201).json({ success: true, id: result.insertId });
    } catch (err) {
        console.error('Erreur lors de la mise à jour des informations :', err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Route pour mettre à jour le mot de passe d'un responsable
router.put('/responsable/updateMDP', async (req, res) => {
    const { username, newPassword, newSel } = req.body;

    try {
        const result = await updatePasswordResponsable(username, newPassword, newSel);
        res.status(201).json({ success: true, id: result.insertId });
    } catch (err) {
        console.error('Erreur lors de la mise à jour du mot de passe :', err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Route pour supprimer un responsable spécifique par son ID
router.delete('/responsable/:id', deleteResponsable);

// Exporter les routes pour qu'elles soient utilisées dans `app.js`
module.exports = router;
