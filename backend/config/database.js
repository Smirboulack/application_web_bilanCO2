require('dotenv').config();
const pgp = require("pg-promise")();
const config = require('../config/config.test');

// Fonction pour créer une connexion à la base de données
function createDatabaseConnection() {
	if (process.env.NODE_ENV === 'test') {
		return pgp(config.db);
	} else {
		const stringConnexion = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.DB_NAME}`;
		console.log(stringConnexion);
		return pgp(stringConnexion);
	}
}

const db = createDatabaseConnection();

module.exports = {
	db,
	pgp
};
