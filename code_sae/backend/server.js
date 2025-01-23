const express = require('express');
const app = express();
const responsableRoutes = require('./routes/responsable'); // Importer les routes
const enfantRoutes = require('./routes/enfant');
const motRoutes = require('./routes/mot'); // Importer les routes des mots
const exerciceRoutes = require('./routes/exercice');
const realiserRoutes = require('./routes/realiser');
const contenirRoutes = require('./routes/contenir');
const cors = require('cors');

app.use(express.json()); // Middleware pour parser les requêtes JSON
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Utiliser les routes
app.use('/api', responsableRoutes); // route vers le json de la table responsable
app.use('/api', enfantRoutes); // route vers le json de la table children
app.use('/api', motRoutes); // route vers le json de la table mots
app.use('/api', exerciceRoutes); // route vers le json de la table exercice
app.use('/api', realiserRoutes); // route vers le json de la table realiser
app.use('/api', contenirRoutes); // route vers le json de la table contenir

const PORT = process.env.PORT || 8100;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
