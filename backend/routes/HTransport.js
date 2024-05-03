const express = require('express');
const router = express.Router();

const transportCtrl = require('../controllers/habitudeTransp');
const authentification = require('../middleware/authentification');

router.get('/users/:id/habitudesTransport', authentification, transportCtrl.getHabitudesTransport);
router.get('/users/:id/bilan/:idBilan/habitudesTransport', authentification, transportCtrl.getHabitudesTransportByBilan);
router.put('/users/:id/bilan/:idBilan/habitudesTransport/:idHT', authentification, transportCtrl.updateHabitudeTransport);
router.delete('/users/:id/bilan/:idBilan/habitudesTransport/:idHT', authentification, transportCtrl.deleteHabitudeTransport);

module.exports = router;
