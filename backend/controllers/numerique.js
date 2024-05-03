require('dotenv').config();
const { db, pgp } = require('../config/database');

exports.getAll = async (req, res, next) => {
	try {
		db.manyOrNone('SELECT * FROM numerique')
			.then(data => {
				res.status(200).json(data);
			})
			.catch(error => res.status(500).json({ message: error.message }));
	} catch (error) {
		console.error(error);
		next(error);
	}
}

exports.getOne = async (req, res, next) => {
	try {
		const id = req.params.id;
		db.one('SELECT * FROM numerique WHERE id = $1', [id])
			.then(data => {
				res.status(200).json(data);
			})
			.catch(error => {
				res.status(404).json({ message: error.message });
			})

	} catch (error) {
		console.error(error);
		next(error);
	}
}

//TODO : pas fini, à voir avec frontend
exports.createNum = async (req, res, next) => {
	try {
		const newTransport = req.body;

	} catch (error) {

	}
}

exports.updateNum = async (req, res, next) => {
	try {
		const modifs = req.body;
		const idNum = req.params.id;

		const num = await db.oneOrNone('SELECT * FROM numerique WHERE id = $1', [idNum]);

		if (num) {
			const keys = Object.keys(modifs);
			const condition = pgp.as.format(' WHERE id = $1', req.params.id);
			const query = pgp.helpers.update(modifs, keys, 'numerique') + condition + ' RETURNING *';

			db.one(query)
				.then(num => {
					res.status(200).json({ message: `Le tuple d'id ${num.id} bien mis à jour.` });
				})
				.catch(error => {
					res.status(500).json({ message: 'Erreur lors de la mise à jour des données :', error });
				});
		}
		else {
			res.status(404).json({ message: `Le tuple de numérique d'id ${idNum} n'existe pas.` })
		}
	} catch (error) {
		console.error(error);
		next(error);
	}
}

exports.deleteNum = async (req, res, next) => {
	try {
		const idNum = req.params.id;

		const num = await db.oneOrNone('SELECT * FROM numerique WHERE id = $1', [idNum]);

		if (num) {
			const query = 'DELETE FROM numerique WHERE id = $1 RETURNING *';

			db.one(query, [idNum])
				.then(deletedNum => {
					res.status(200).json({ message: `Le tuple d'id ${deletedNum.id} a été supprimé avec succès.` });
				})
				.catch(error => {
					res.status(500).json({ message: 'Erreur lors de la suppression :', error });
				});
		} else {
			res.status(404).json({ message: `Le tuple de numérique d'id ${idNum} n'existe pas.` });
		}
	} catch (error) {
		console.error(error);
		next(error);
	}
}
