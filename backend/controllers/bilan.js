const {db, pgp} = require('../config/database');

// GET tous les bilans d'un utilisateur
exports.getBilan = async (req, res, next) => {
	try {
		const userId = req.params.id;
		const bilans = await db.manyOrNone(
			'SELECT * FROM bilan WHERE _id_utilisateur = $1', userId
		);
		res.status(200).json(bilans);
	} catch (error) {
		next(error);
	}
};

// GET un bilan par son id
exports.getOneBilan = async (req, res, next) => {
	try {
		const userId = req.params.id;
		const bilanId = req.params.idBilan;
		const bilan = await db.one(
			'SELECT * FROM bilan WHERE id = $1 AND _id_utilisateur = $2', [bilanId, userId]
		);
		if(bilan){
			res.status(200).json(bilan);
		} else {
			res.status(404).send("Bilan not found");
		}
	} catch (error) {
		next(error);
	}
};

const deleteHabitudesAlimentaire = async (userId, bilanId) => {
	const habitudesAlimentairesIds = await db.any(
		'SELECT _id_habitude FROM bilan_alimentation WHERE _id_bilan = $1 AND _id_utilisateur = $2',
		[bilanId, userId]
	);
	await db.none(
		'DELETE FROM bilan_alimentation WHERE _id_bilan = $1 AND _id_utilisateur = $2',
		[bilanId, userId]
	);
	const habitudesAlimentairesIdsToDelete = habitudesAlimentairesIds.map(habitude => habitude._id_habitude);
	await db.none(
		'DELETE FROM habitude_alimentation WHERE id = ANY($1::uuid[]) AND _id_utilisateur = $2',
		[habitudesAlimentairesIdsToDelete, userId]
	);
};

const deleteHabitudesNumerique = async (userId, bilanId) => {
	const habitudesNumeriquesIds = await db.any(
		'SELECT _id_habitude FROM bilan_numerique WHERE _id_bilan = $1 AND _id_utilisateur = $2',
		[bilanId, userId]
	);
	await db.none(
		'DELETE FROM bilan_numerique WHERE _id_bilan = $1 AND _id_utilisateur = $2',
		[bilanId, userId]
	);
	const habitudesNumeriquesIdsToDelete = habitudesNumeriquesIds.map(habitude => habitude._id_habitude);
	await db.none(
		'DELETE FROM habitude_numerique WHERE id = ANY($1::uuid[]) AND _id_utilisateur = $2',
		[habitudesNumeriquesIdsToDelete, userId]
	);
};

const deleteHabitudesTransport = async (userId, bilanId) => {
	const habitudesTransportIds = await db.any(
		'SELECT _id_habitude FROM bilan_transport WHERE _id_bilan = $1 AND _id_utilisateur = $2',
		[bilanId, userId]
	);
	await db.none(
		'DELETE FROM bilan_transport WHERE _id_bilan = $1 AND _id_utilisateur = $2',
		[bilanId, userId]
	);
	const habitudesTransportIdsToDelete = habitudesTransportIds.map(habitude => habitude._id_habitude);
	await db.none(
		'DELETE FROM habitude_transport WHERE id = ANY($1::uuid[]) AND _id_utilisateur = $2',
		[habitudesTransportIdsToDelete, userId]
	);
};

exports.deleteBilan = async (req, res, next) => {
	try {
		const userId = req.params.id;
		const bilanId = req.params.idBilan;
		const bilan = await db.oneOrNone(
			'SELECT * FROM bilan WHERE id = $1 AND _id_utilisateur = $2', [bilanId, userId]
		);

		if (bilan) {

			await deleteHabitudesAlimentaire(userId, bilanId);
			await deleteHabitudesNumerique(userId, bilanId);
			await deleteHabitudesTransport(userId, bilanId);

			await db.none(
				'DELETE FROM bilan WHERE id = $1 AND _id_utilisateur = $2',
				[bilanId, userId]
			);

			res.status(200).json({ message: 'Bilan supprimé avec succès' });
		} else {
			res.status(404).json({ message: 'Bilan non trouvé' });
		}
	} catch (error) {
		next(error);
		res.status(500).json({ message: 'Erreur lors de la suppression du bilan' });
	}
};
