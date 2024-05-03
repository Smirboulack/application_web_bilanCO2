const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const fs = require('fs');
const { db, pgp } = require('../config/database');


// Configuration de Multer pour les avatars
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const uploadPath = 'uploads/';

		// Vérifier si le dossier existe
		if (!fs.existsSync(uploadPath)) {
			// Créer le dossier s'il n'existe pas
			fs.mkdirSync(uploadPath, { recursive: true });
		}

		cb(null, uploadPath);
	},
	filename: function (req, file, cb) {
		cb(null, `${Date.now()}-${file.originalname}`);
	}
});

const upload = multer({ storage: storage });
exports.uploadAvatar = upload.single('avatar');

exports.updateAvatar = async (req, res) => {
	if (!req.file) {
		return res.status(400).send('No file uploaded.');
	}

	const userId = req.params.id;
	const newAvatarPath = req.file.path;

	try {
		// Récupérer le chemin actuel de l'avatar
		const currentAvatar = await db.oneOrNone('SELECT avatar_url FROM utilisateur WHERE id = $1', userId);

		if (currentAvatar && currentAvatar.avatar_url) {
			// Vérifier si le fichier existe
			if (fs.existsSync(currentAvatar.avatar_url)) {
				// Supprimer le fichier existant
				fs.unlinkSync(currentAvatar.avatar_url);
			}
		}

		// Mettre à jour la base de données avec le nouveau chemin de l'avatar
		await db.none('UPDATE utilisateur SET avatar_url = $1 WHERE id = $2', [newAvatarPath, userId]);
		res.status(200).json({ message: 'Avatar updated successfully', avatar_url: newAvatarPath });
	} catch (error) {
		console.error('Error updating avatar:', error);
		res.status(500).send({ error: 'Failed to update avatar', details: error });
	}
};

exports.deleteAvatar = async (req, res) => {
	const userId = req.params.id;
	try {
		// Récupérer le chemin actuel de l'avatar
		const currentAvatar = await db.oneOrNone('SELECT avatar_url FROM utilisateur WHERE id = $1', userId);

		if (currentAvatar && currentAvatar.avatar_url) {
			// Vérifier si le fichier existe
			if (fs.existsSync(currentAvatar.avatar_url)) {
				// Supprimer le fichier existant
				fs.unlinkSync(currentAvatar.avatar_url);
			}

			// Mettre à jour la base de données avec le nouveau chemin de l'avatar
			await db.none('UPDATE utilisateur SET avatar_url = NULL WHERE id = $1', userId);
			res.status(200).json({ message: 'Avatar deleted successfully' });
		} else {
			res.status(404).json({ message: 'Avatar not found' });
		}
	} catch (error) {
		console.error('Error deleting avatar:', error);
		res.status(500).send({ error: 'Failed to delete avatar', details: error });
	}
};

exports.getOneUser = async (req, res, next) => {
	try {
		const id = req.params.id;
		const user = await db.oneOrNone('SELECT * FROM utilisateur WHERE id = $1', [id]);
		if (user) {
			res.json(user);
		}
		else {
			res.status(404).json({ message: "L'utilisateur n'existe pas." })
		}
	} catch (error) {
		console.error(error);
		next(error); // Passe l'erreur au middleware d'erreur d'Express
	}
}

exports.getUsers = async (req, res, next) => {
	try {
		const users = await db.manyOrNone('SELECT * FROM utilisateur');
		res.json(users); //impossible d'être vide, mais dans tous les cas renvoie tableau vide si jamais
	} catch (error) {
		console.error(error);
		next(error); // Passe l'erreur au middleware d'erreur d'Express
	}
}

exports.updateUser = async (req, res, next) => {
	try {
		const userModifications = req.body;

		if (!req.params.id) {
			return res.status(400).json({ message: "Il manque l'id de l'utilisateur à modifier." });
		}

		if (userModifications.mot_de_passe) {
			const hash = await bcrypt.hash(userModifications.mot_de_passe, 10);
			userModifications.mot_de_passe = hash;
		}

		const user = await db.oneOrNone('SELECT * FROM utilisateur WHERE id = $1', [req.params.id]);

		//on doit vérif que le pseudo et mail sont pas pris
		const pseudoUsed = await db.oneOrNone('SELECT * FROM utilisateur WHERE pseudo = $1', [req.body.pseudo]);
		const emailUsed = await db.oneOrNone('SELECT * FROM utilisateur WHERE email = $1', [req.body.email]);

		if (pseudoUsed) {
			return res.status(400).json({ message: "Le pseudo est déjà utilisé." });
		}

		if (emailUsed) {
			return res.status(400).json({ message: "L'email est déjà utilisé." });
		}

		if (user) {
			let keys = Object.keys(userModifications);
			//keys = keys.filter(key => key !== 'id'); //on récupère les colonnes à modif

			const condition = pgp.as.format(' WHERE id = $1', req.params.id);
			const query = pgp.helpers.update(userModifications, keys, 'utilisateur') + condition + ' RETURNING *';

			db.one(query)
				.then(user => {
					res.status(200).json({ message: "L'utilisateur " + user.id + " bien mis à jour." });
				})
				.catch(error => {
					res.status(500).json({ message: 'Erreur lors de la mise à jour des données :', error });
				});
		}
		else {
			res.status(404).json({ message: "L'utilisateur n'existe pas." })
		}
	} catch (error) {
		console.error(error);
		next(error); // Passe l'erreur au middleware d'erreur d'Express
	}
}

// TODO : delete aussi les bilans et habitudes lié à l'utilisateur
exports.deleteUser = async (req, res, next) => {
	try {
		const id = req.params.id;
		// Combinez la récupération des informations utilisateur et de l'avatar en une seule requête
		const user = await db.oneOrNone('SELECT * FROM utilisateur WHERE id = $1', [id]);

		if (user) {
			// Commencez une transaction pour assurer que les opérations sont effectuées de manière atomique
			await db.tx(async t => {
				if (user.avatar_url) {
					// Vérifier et supprimer le fichier avatar si nécessaire
					if (fs.existsSync(user.avatar_url)) {
						fs.unlinkSync(user.avatar_url);
					}
				}

				// Supprimer l'utilisateur de la base de données
				await t.none('DELETE FROM utilisateur WHERE id = $1', [id]);
			});

			res.status(200).json({ message: "Utilisateur supprimé avec succès." });
		} else {
			res.status(404).json({ message: "Utilisateur non trouvé. La suppression a échoué." });
		}

	} catch (error) {
		console.error(error);
		next(error); // Passe l'erreur au middleware d'erreur d'Express
	}
}


exports.signup = async (req, res, next) => {
	try {
		const { pseudo, email, mot_de_passe, date_de_naissance } = req.body;

		// Vérifiez si le pseudo et l'email sont déjà utilisés
		const pseudoUsed = await db.oneOrNone('SELECT * FROM utilisateur WHERE pseudo = $1', [pseudo]);
		const emailUsed = await db.oneOrNone('SELECT * FROM utilisateur WHERE email = $1', [email]);

		if (pseudoUsed) {
			return res.status(400).json({ message: "Le pseudo est déjà utilisé." });
		}

		if (emailUsed) {
			return res.status(400).json({ message: "L'email est déjà utilisé." });
		}

		const hash = await bcrypt.hash(mot_de_passe, 10);

		const newUser = {
			pseudo,
			date_de_naissance,
			email,
			mot_de_passe: hash,
			type_utilisateur: 'pas admin',
			est_connecte: false
		};

		const cs = new pgp.helpers.ColumnSet(['pseudo', 'date_de_naissance', 'email', 'mot_de_passe', 'type_utilisateur', 'est_connecte'], { table: 'utilisateur' });
		const query = pgp.helpers.insert(newUser, cs) + ' RETURNING id, pseudo';

		const user = await db.one(query);

		res.status(201).json({ message: `L'utilisateur d'id : ${user.id} et de pseudo ${user.pseudo} a été créé en BD.` });
	} catch (error) {
		console.error(error);
		next(error); // Passe l'erreur au middleware d'erreur d'Express
	}
};



exports.login = (req, res, next) => {
	const { pseudo, mot_de_passe } = req.body;
	db.task(async t => {
		// Vérifier si le pseudo existe en BD
		const user = await t.oneOrNone(
			'SELECT id, pseudo, mot_de_passe, type_utilisateur FROM utilisateur WHERE pseudo = $1',
			[pseudo]
		);

		if (!user) {
			return res.status(401).json({ message: 'Paire login / mot de passe incorrecte.' });
		}

		// Vérifier le mot de passe
		const isValid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
		if (!isValid) {
			return res.status(401).json({ message: 'Paire login / mot de passe incorrecte.' });
		}

		// Mettre à jour le champ est_connecte à true
		await t.none(
			'UPDATE utilisateur SET est_connecte = $1 WHERE id = $2',
			[true, user.id]
		);

		// Créer le token
		const token = jwt.sign(
			{ userId: user.id, pseudo: user.pseudo, admin: user.type_utilisateur },
			process.env.JWT_SECRET_KEY,
			{ expiresIn: '1h' }
		);

		return res.status(200).json({ userId: user.id, token: token });
	})
		.catch(error => {
			console.error('Error during login process:', error);
			res.status(500).json({ error });
		});
};
