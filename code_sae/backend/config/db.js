require('dotenv').config();  // Charge les variables d'environnement du fichier .env
const mysql = require('mysql2');


/**
 * Récupère les variables d'environnement et crée une connection à la BDD
 *
 * @type {*}
 */
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données: ' + err.stack);
    return;
  }
  console.log('Connecté à la base de données.');
});

module.exports = connection;
