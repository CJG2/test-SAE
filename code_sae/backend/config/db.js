require('dotenv').config();  // Charge les variables d'environnement du fichier .env
const mysql = require('mysql2');

/**
 * Récupère les variables d'environnement et crée un pool de connexions à la BDD
 *
 * @type {*}
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,  // Attendre que les connexions soient disponibles avant d'en ouvrir une nouvelle
  connectionLimit: 10,       // Limite le nombre de connexions simultanées
  queueLimit: 0              // Pas de limite pour la mise en attente des connexions
});

// Vérifier la connexion en exécutant une requête simple
pool.query('SELECT 1', (err, results) => {
  if (err) {
    console.error('Erreur de connexion à la base de données: ' + err.stack);
    return;
  }
  console.log('Connecté à la base de données.');
});

// Promisifier les requêtes avec `pool.promise()` pour un usage avec async/await
const promisePool = pool.promise();

module.exports = promisePool;