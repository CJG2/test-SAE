const express = require('express');
const router = express.Router();
const { getMot } = require('../controllers/motController'); // Importer le contrôleur

router.get('/mot', getMot); // Lier la route à la fonction de récupération des mots

module.exports = router;
