const express = require('express');
const router = express.Router();
const { getExerciceRealise,
        getExerciceRealiseById,
        createExerciceRealise
 } = require('../controllers/realiserController'); // Importer le contrôleur
 
router.get('/realiser', getExerciceRealise); // Lier la route à la fonction de récupération des exercices réalisés

router.get('/realiser', getExerciceRealiseById); // Lier la route à la fonction de récupération des exercices réalisés par l'id de l'enfant

// Route pour stocker un exercice effectuer par un enfant
router.post('/realiser/create', async (req, res) => {
    const { id_enfant, id_exercice, nb_tentative, score } = req.body;

    try {
        const result = await createExerciceRealise(id_enfant, id_exercice, nb_tentative, score);
        res.status(201).json({ success: true, id: result.insertId });
    } catch (err) {
        console.error('Erreur lors de la création de l\'responsable :', err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
