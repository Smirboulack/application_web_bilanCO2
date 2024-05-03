const express = require('express');
const router = express.Router();

const HAlimCtrl = require('../controllers/habitudeAlim');
const authentification = require('../middleware/authentification');

router.get('/users/:id/habitudesAlimentation', authentification, HAlimCtrl.getHabitudesAlimentation);
router.get('/users/:id/bilan/:idBilan/habitudesAlimentation', authentification, HAlimCtrl.getHabitudesAlimentationByBilan);
router.put('/users/:id/bilan/:idBilan/habitudesAlimentation/:idHA', authentification, HAlimCtrl.updateHabitudeAlimentation);
router.delete('/users/:id/bilan/:idBilan/habitudesAlimentation/:idHA', authentification, HAlimCtrl.deleteHabitudeAlimentation);

module.exports = router;
