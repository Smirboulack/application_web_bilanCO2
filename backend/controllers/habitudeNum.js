const {db} = require('../config/database');
const {updateBilanCo2Total} = require('../requests/BilanRequest');

// GET toutes les habitudes numériques
exports.getHabitudesNumerique = async (req, res, next) => {
	try {
		const userId = req.params.id;
		const habitudesNumerique = await db.manyOrNone(
			'SELECT * FROM habitude_numerique WHERE _id_utilisateur = $1',
			 userId
		);

		res.status(200).json(habitudesNumerique);
	} catch (error) {
		next(error);
	}
};

// GET toutes les habitudes numériques par bilan
exports.getHabitudesNumeriqueByBilan = async (req, res, next) => {
	try {
		const userId = req.params.id;
		const bilanId = req.params.idBilan;
		const habitudesNumerique = await db.manyOrNone(`
			SELECT * FROM bilan_numerique bn JOIN habitude_numerique hn
			ON bn._id_habitude = hn.id WHERE bn._id_utilisateur = $1 AND bn._id_bilan = $2`,
		[userId, bilanId]
		);

		res.status(200).json(habitudesNumerique);
	} catch (error) {
		next(error);
	}
}

// PUT pour modifier une habitude numérique
exports.updateHabitudeNumerique = async (req, res, next) => {
	try {
		const userId = req.params.id;
		const bilanId = req.params.idBilan;
		const habitudeNumeriqueId = req.params.idHN;
		const habitudeNumerique = req.body;
		const {type_numerique, details, heure_utilisation, co2_emis} = habitudeNumerique;

		if(!type_numerique || !details || !heure_utilisation || !co2_emis){
			res.status(400).send("Missing required fields");
			return;
		}

		const habitudeNumeriqueToUpdate = await db.oneOrNone(
			'SELECT * FROM habitude_numerique WHERE id = $1 AND _id_utilisateur = $2',
			[habitudeNumeriqueId, userId]
		);

		if(habitudeNumeriqueToUpdate){
			await db.tx(async t => {
				await t.none(`
					UPDATE habitude_numerique SET type_numerique = $1, details = $2,
					heure_utilisation = $3, co2_emis = $4
					WHERE id = $5 AND _id_utilisateur = $6`,
				[type_numerique, details, heure_utilisation, co2_emis, habitudeNumeriqueId, userId]
				);
				await updateBilanCo2Total(t, bilanId, userId);
			});

			res.status(200).json({message: "Habitude numérique updated"});
		} else {
			res.status(404).send("Habitude numérique not found");
		}
	} catch (error) {
		next(error);
	}
}

// DELETE pour supprimer une habitude numérique
exports.deleteHabitudeNumerique = async (req, res, next) => {
	try {
		const userId = req.params.id;
		const bilanId = req.params.idBilan;
		const habitudeNumeriqueId = req.params.idHN;
		const habitudeNumerique = await db.one(
			'SELECT * FROM habitude_numerique WHERE id = $1 AND _id_utilisateur = $2',
			[habitudeNumeriqueId, userId]
		);

		if(habitudeNumerique){
			await db.none(`
				DELETE FROM bilan_numerique WHERE _id_bilan = $1 AND _id_utilisateur = $2
				AND _id_habitude = $3`,
			[bilanId, userId, habitudeNumeriqueId]
			);
			await db.none(
				'DELETE FROM habitude_numerique WHERE id = $1 AND _id_utilisateur = $2',
				[habitudeNumeriqueId, userId]
			);
			res.status(200).json({message: "Habitude numérique deleted"});
		} else {
			res.status(404).send("Habitude numérique not found");
		}
	} catch (error) {
		next(error);
	}
}