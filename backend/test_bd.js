require('dotenv').config();
const { db, pgp } = require('./config/database');

// Requête de test
db.many('SELECT * FROM utilisateur')
	.then(user => {
		console.log('Résultat de la requête :', user);
	})
	.catch(error => {
		console.log('Erreur lors de la connexion à la base de données :', error);
	});