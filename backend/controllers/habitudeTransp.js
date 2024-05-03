const {db} = require('../config/database');
const {updateBilanCo2Total} = require('../requests/BilanRequest');

// GET toutes les habitudes transport
exports.getHabitudesTransport = async (req, res, next) => {
	try {
		const userId = req.params.id;
		const habitudesTransport = await db.manyOrNone(
			'SELECT * FROM habitude_transport WHERE _id_utilisateur = $1',
			 userId
		);

		res.status(200).json(habitudesTransport);
	} catch (error) {
		next(error);
	}
};

// GET toutes les habitudes transport par bilan
exports.getHabitudesTransportByBilan = async (req, res, next) => {
	try {
		const userId = req.params.id;
		const bilanId = req.params.idBilan;
		const habitudesTransport = await db.manyOrNone(`
			SELECT * FROM bilan_transport bt JOIN habitude_transport ht 
			ON bt._id_habitude = ht.id WHERE bt._id_utilisateur = $1 AND bt._id_bilan = $2`,
		[userId, bilanId]
		);

		res.status(200).json(habitudesTransport);
	} catch(error){
		next(error);
	}
}

exports.updateHabitudeTransport = async (req, res, next) => {
	try {
	  const userId = req.params.id;
	  const bilanId = req.params.idBilan;
	  const habitudeTransportId = req.params.idHT;
	  const habitudeTransport = req.body;
	  const {type_transport, details, km_parcourue, nb_passagers, nb_jours_trajet, co2_emis} = habitudeTransport;
  
	  if(!type_transport || !details || !km_parcourue || !nb_passagers || !nb_jours_trajet || !co2_emis){
			res.status(400).send("Missing required fields");
			return;
	  }
  
	  const habitudeTransportToUpdate = await db.oneOrNone(
			'SELECT * FROM habitude_transport WHERE id = $1 AND _id_utilisateur = $2',
			[habitudeTransportId, userId]
	  );
  
	  if(habitudeTransportToUpdate){
			await db.tx(async t => {
				await t.none(`
					UPDATE habitude_transport SET type_transport = $1, details = $2,
					km_parcourue = $3, nb_passagers = $4, nb_jours_trajet = $5, co2_emis = $6
					WHERE id = $7 AND _id_utilisateur = $8`,
				[type_transport, details, km_parcourue, nb_passagers, nb_jours_trajet, co2_emis,
					habitudeTransportId, userId]
				);
				await updateBilanCo2Total(t, bilanId, userId);
			});
  
			res.status(200).json({message: "Habitude transport updated"});
	  } else {
			res.status(404).send("Habitude transport not found");
	  }
	} catch (error) {
	  next(error);
	}
}
  
// DELETE pour supprimer une habitude transport
exports.deleteHabitudeTransport = async (req, res, next) => {
	try {
		const userId = req.params.id;
		const bilanId = req.params.idBilan;
		const habitudeTransportId = req.params.idHT;
		const habitudeTransport = await db.one(
			'SELECT * FROM habitude_transport WHERE id = $1 AND _id_utilisateur = $2',
			[habitudeTransportId, userId]
		);

		if(habitudeTransport){
			await db.none(
				'DELETE FROM bilan_transport WHERE _id_utilisateur = $1 AND _id_habitude = $2 AND _id_bilan = $3',
				[userId, habitudeTransportId, bilanId]
			);

			await db.none(
				'DELETE FROM habitude_transport WHERE id = $1 AND _id_utilisateur = $2',
				[habitudeTransportId, userId]
			);
			res.status(200).json({message: "Habitude transport deleted"});
		} else {
			res.status(404).send("Habitude transport not found");
		}
	} catch (error) {
		console.log("error", error);
		next(error);
	}
}