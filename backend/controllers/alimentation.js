require('dotenv').config();
const { db, pgp } = require('../config/database');

const typeId = {
	0: "Produit céréaliers",
	1: "Entrées et plats composés",
	2: "Matières grasses",
	3: "Produits laitiers",
	4: "Viandes, oeufs, poissons",
	5: "Glace et sorbets",
	6: "Fruits",
	7: "Aides culinaires",
	8: "Légumes",
	9: "Boissons"
}

exports.getAll = async (req, res, next) => {
	try {
		db.manyOrNone('SELECT * FROM alimentation')
			.then(data => {
				res.status(200).json(data);
			})
			.catch(error => res.status(500).json({ message: error.message }));
	} catch (error) {
		console.error(error);
		next(error);
	}
}

exports.getType = async (req, res, next) => {
	try {
		const idCat = req.params.idCat;
		db.manyOrNone('SELECT * FROM alimentation WHERE type_aliment = $1', [typeId[idCat]])
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
		db.one('SELECT * FROM alimentation WHERE id = $1', [id])
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
exports.createAlim = async (req, res, next) => {
	try {
		const newTransport = req.body;

	} catch (error) {

	}
}

exports.updateAlim = async (req, res, next) => {
	try {
		const modifs = req.body;
		const idAlim = req.params.id;

		const alim = await db.oneOrNone('SELECT * FROM alimentation WHERE id = $1', [idAlim]);

		if (alim) {
			const keys = Object.keys(modifs);
			const condition = pgp.as.format(' WHERE id = $1', req.params.id);
			const query = pgp.helpers.update(modifs, keys, 'alimentation') + condition + ' RETURNING *';

			db.one(query)
				.then(alim => {
					res.status(200).json({ message: `Le tuple d'id ${alim.id} bien mis à jour.` });
				})
				.catch(error => {
					res.status(500).json({ message: 'Erreur lors de la mise à jour des données :', error });
				});
		}
		else {
			res.status(404).json({ message: `Le tuple d'alimentation d'id ${idAlim} n'existe pas.` })
		}

		

	} catch (error) {
		console.error(error);
		next(error);
	}
}

exports.deleteAlim = async (req, res, next) => {
    try {
        const idAlim = req.params.id;

        const alim = await db.oneOrNone('SELECT * FROM alimentation WHERE id = $1', [idAlim]);

        if (alim) {
            const query = 'DELETE FROM alimentation WHERE id = $1 RETURNING *';

            db.one(query, [idAlim])
                .then(deletedAlim => {
                    res.status(200).json({ message: `Le tuple d'id ${deletedAlim.id} a été supprimé avec succès.` });
                })
                .catch(error => {
                    res.status(500).json({ message: 'Erreur lors de la suppression :', error });
                });
        } else {
            res.status(404).json({ message: `Le tuple d'alimentation d'id ${idAlim} n'existe pas.` });
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}
