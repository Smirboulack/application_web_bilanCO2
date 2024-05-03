const { db, pgp } = require('../config/database');

const insertTransportData = async (t, _id_utilisateur, HTransportData, bilanId) => {
	const transportCS = new pgp.helpers.ColumnSet(['_id_utilisateur', 'type_transport',
		'details', 'km_parcourue', 'nb_passagers', 'nb_jours_trajet', 'co2_emis'],
		{ table: 'habitude_transport' }
	);

	const transportQueries = HTransportData.map(
		transport => pgp.helpers.insert(transport, transportCS) + 'RETURNING id'
	);

	const transportIds = await Promise.all(
		transportQueries.map(query => t.oneOrNone(query))
	);

	await t.none(
		'INSERT INTO bilan_transport(_id_bilan, _id_utilisateur, _id_habitude) VALUES ' +
		transportIds.map((id, index) => `('${bilanId}', '${_id_utilisateur}', '${id.id}')`)
			.join(', ')
	);
};


const insertAlimData = async (t, _id_utilisateur, HAlimData, bilanId) => {
	const alimentationCS = new pgp.helpers.ColumnSet(['_id_utilisateur', 'type_aliment',
		'nom_aliment', 'nb_aliments_consommer', 'co2_emis'], { table: 'habitude_alimentation' });

	const alimentationQueries = HAlimData.map(
		aliment => pgp.helpers.insert(aliment, alimentationCS) + 'RETURNING id'
	);

	const alimentationIds = await Promise.all(
		alimentationQueries.map(query => t.oneOrNone(query))
	);

	await t.none(
		'INSERT INTO bilan_alimentation(_id_bilan, _id_utilisateur, _id_habitude) VALUES ' +
		alimentationIds.map((id, index) => `('${bilanId}', '${_id_utilisateur}', '${id.id}')`)
			.join(', ')
	);

};

const insertNumData = async (t, _id_utilisateur, HNumData, bilanId) => {
	const numeriqueCS = new pgp.helpers.ColumnSet(['_id_utilisateur', 'type_numerique',
		'details', 'heure_utilisation', 'co2_emis'], { table: 'habitude_numerique' });

	const numeriqueQueries = HNumData.map(
		numerique => pgp.helpers.insert(numerique, numeriqueCS) + 'RETURNING id'
	);

	const numeriqueIds = await Promise.all(
		numeriqueQueries.map(query => t.oneOrNone(query))
	);

	await t.none(
		'INSERT INTO bilan_numerique(_id_bilan, _id_utilisateur, _id_habitude) VALUES ' +
		numeriqueIds.map((id, index) => `('${bilanId}', '${_id_utilisateur}', '${id.id}')`)
			.join(', ')
	);
};

const updateBilanCo2Total = async (t, bilanId, _id_utilisateur) => {
	await t.none(`
		UPDATE bilan SET total_co2 = (SELECT SUM(co2_emis) FROM (
		SELECT co2_emis
		FROM habitude_transport ht 
		JOIN bilan_transport bt ON ht.id = bt._id_habitude
		WHERE bt._id_bilan = $1 AND bt._id_utilisateur = $2
		UNION ALL
		SELECT co2_emis 
		FROM habitude_alimentation ha 
		JOIN bilan_alimentation ba ON ha.id = ba._id_habitude 
		WHERE ba._id_bilan = $1 AND ba._id_utilisateur = $2 
		UNION ALL
		SELECT co2_emis 
		FROM habitude_numerique hn 
		JOIN bilan_numerique bn ON hn.id = bn._id_habitude 
		WHERE bn._id_bilan = $1 AND bn._id_utilisateur = $2
		) AS subquery) WHERE id = $1;`, [bilanId, _id_utilisateur]
	);
	console.log('Bilan updated');
};

exports.createAllBilan = async (req, res) => {
	try {
		const _id_utilisateur = req.params.id;
		const { bilanData, HTransportData, HAlimData, HNumData } = req.body;
		const { total_co2 } = bilanData;

		if (!_id_utilisateur || !total_co2 || !HTransportData || !HAlimData || !HNumData ||
			HTransportData.length === 0 || HAlimData.length === 0 || HNumData.length === 0) {

			res.status(400).send("Missing required fields");
			return;
		}

		const currentDate = new Date();
		const formattedDate = currentDate.toISOString();

		await db.tx(async t => {
			const result = await t.one(
				'INSERT INTO bilan(_id_utilisateur, date_creation, date_modification, total_co2)' +
				'VALUES ($1, $2, $3, $4) RETURNING id', [_id_utilisateur, formattedDate,
				formattedDate, total_co2]
			);
			const bilanId = result.id;

			await insertTransportData(t, _id_utilisateur, HTransportData, bilanId);

			await insertAlimData(t, _id_utilisateur, HAlimData, bilanId);

			await insertNumData(t, _id_utilisateur, HNumData, bilanId);

			await updateBilanCo2Total(t, bilanId, _id_utilisateur);
		});

		res.status(201).json({
			message: 'Bilan créé avec succès',
		});

	} catch (error) {
		console.log(error);
		res.status(500).send("Error creating bilan");
	}
};

exports.updateBilanCo2Total = updateBilanCo2Total;