const express = require('express');
const router = express.Router();
const { getExercice,
        getExerciceById
 } = require('../controllers/exerciceController'); // Importer le contrôleur

router.get('/exercice', getExercice); // Lier la route à la fonction de récupération des exercices

router.get('/exercice', getExerciceById); // Lier la route à la fonction de récupération des exercices par l'id

module.exports = router;
