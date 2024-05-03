const {db} = require('../config/database');
const {updateBilanCo2Total} = require('../requests/BilanRequest');

// GET toutes les habitudes alimentaires
exports.getHabitudesAlimentation = async (req, res, next) => {
	try {
		const userId = req.params.id;
		const habitudesAlimentation = await db.manyOrNone(
			'SELECT * FROM habitude_alimentation WHERE _id_utilisateur = $1',
			 userId
		);

		res.status(200).json(habitudesAlimentation);
	} catch (error) {
		next(error);
	}
};

// GET toutes les habitudes alimentaires par bilan
exports.getHabitudesAlimentationByBilan = async (req, res, next) => {
	try {
		const userId = req.params.id;
		const bilanId = req.params.idBilan;
		const habitudesAlimentation = await db.manyOrNone(`
			SELECT * FROM bilan_alimentation ba JOIN habitude_alimentation ha
			ON ba._id_habitude = ha.id WHERE ba._id_utilisateur = $1 AND ba._id_bilan = $2`,
		[userId, bilanId]
		);

		res.status(200).json(habitudesAlimentation);
	} catch (error) {
		next(error);
	}
}

// PUT pour modifier une habitude alimentaire
exports.updateHabitudeAlimentation = async (req, res, next) => {
	try {
		const userId = req.params.id;
		const bilanId = req.params.idBilan;
		const habitudeAlimentationId = req.params.idHA;
		const habitudeAlimentation = req.body;
		const {type_aliment, nom_aliment, nb_aliments_consommer, co2_emis} = habitudeAlimentation;

		if(!type_aliment || !nom_aliment || !nb_aliments_consommer || !co2_emis){
			res.status(400).send("Missing required fields");
			return;
		}

		const habitudeAlimentationToUpdate = await db.oneOrNone(
			'SELECT * FROM habitude_alimentation WHERE id = $1 AND _id_utilisateur = $2',
			[habitudeAlimentationId, userId]
		);

		if(habitudeAlimentationToUpdate){
			await db.tx(async t => {
				await t.none(`
					UPDATE habitude_alimentation SET type_aliment = $1, nom_aliment = $2,
					nb_aliments_consommer = $3, co2_emis = $4
					WHERE id = $5 AND _id_utilisateur = $6`,
				[type_aliment, nom_aliment, nb_aliments_consommer, co2_emis, habitudeAlimentationId, userId]
				);

				await updateBilanCo2Total(t, bilanId, userId);
			});

			res.status(200).json({message: "Habitude alimentaire updated"});
		} else {
			res.status(404).send("Habitude alimentaire not found");
		}
	} catch (error) {
		next(error);
	}
}

// DELETE pour supprimer une habitude alimentaire
exports.deleteHabitudeAlimentation = async (req, res, next) => {
	try {
		const userId = req.params.id;
		const idBilan = req.params.idBilan;
		const habitudeAlimentationId = req.params.idHA;
		const habitudeAlimentation = await db.one(
			'SELECT * FROM habitude_alimentation WHERE id = $1 AND _id_utilisateur = $2',
			[habitudeAlimentationId, userId]
		);

		if(habitudeAlimentation){
			await db.none(`
				DELETE FROM bilan_alimentation WHERE _id_utilisateur = $1 AND _id_habitude = $2 AND _id_bilan = $3`,
			[userId, habitudeAlimentationId, idBilan]
			);

			await db.none(`
                DELETE FROM habitude_alimentation WHERE id = $1 AND _id_utilisateur = $2`,
			[habitudeAlimentationId, userId]
			);
			res.status(200).json({message: "Habitude alimentaire deleted"});
		} else {
			res.status(404).send("Habitude alimentaire not found");
		}
	} catch (error) {
		next(error);
	}
}

