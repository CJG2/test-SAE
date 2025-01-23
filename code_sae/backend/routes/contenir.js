const express = require('express');
const router = express.Router();
const { getMotContenu,
        getMotContenuById
 } = require('../controllers/contenirController'); // Importer le contrôleur
 
router.get('/contenir', getMotContenu); // Lier la route à la fonction de récupération des exercices réalisés

router.get('/contenir', getMotContenuById); // Lier la route à la fonction de récupération des exercices réalisés par l'id de l'enfant

module.exports = router;
