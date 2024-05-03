require('dotenv').config();
const { db, pgp } = require('../config/database');

exports.getAll = async (req, res, next) => {
	try {
		db.manyOrNone('SELECT * FROM transport')
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
		db.one('SELECT * FROM transport WHERE id = $1', [id])
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
exports.createTransp = async (req, res, next) => {
	try {
		const newTransport = req.body;

	} catch (error) {

	}
}

exports.updateTransp = async (req, res, next) => {
	try {
		const modifs = req.body;
		const idTransp = req.params.id;

		const transp = await db.oneOrNone('SELECT * FROM transport WHERE id = $1', [idTransp]);

		if (transp) {
			const keys = Object.keys(modifs);
			const condition = pgp.as.format(' WHERE id = $1', req.params.id);
			const query = pgp.helpers.update(modifs, keys, 'transport') + condition + ' RETURNING *';

			db.one(query)
				.then(transp => {
					res.status(200).json({ message: `Le tuple d'id ${transp.id} bien mis à jour.` });
				})
				.catch(error => {
					res.status(500).json({ message: 'Erreur lors de la mise à jour des données :', error });
				});
		}
		else {
			res.status(404).json({ message: `Le tuple de transport d'id ${idTransp} n'existe pas.` })
		}
	} catch (error) {
		console.error(error);
		next(error);
	}
}

exports.deleteTransp = async (req, res, next) => {
	try {
		const idTransp = req.params.id;

		const transp = await db.oneOrNone('SELECT * FROM transport WHERE id = $1', [idTransp]);

		if (transp) {
			const query = 'DELETE FROM transport WHERE id = $1 RETURNING *';

			db.one(query, [idTransp])
				.then(deletedTransp => {
					res.status(200).json({ message: `Le tuple d'id ${deletedTransp.id} a été supprimé avec succès.` });
				})
				.catch(error => {
					res.status(500).json({ message: 'Erreur lors de la suppression :', error });
				});
		} else {
			res.status(404).json({ message: `Le tuple de transport d'id ${idTransp} n'existe pas.` });
		}
	} catch (error) {
		console.error(error);
		next(error);
	}
}

