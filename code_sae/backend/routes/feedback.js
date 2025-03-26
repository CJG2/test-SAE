const express = require("express");
const router = express.Router();
const {
  getFeedback,
  createFeedback,
} = require("../controllers/feedbackController"); // Importer le contrôleur

router.get("/feedback", getFeedback); // Lier la route à la fonction de récupération des feedbacks
router.post("/feedback/create", createFeedback);

module.exports = router;
