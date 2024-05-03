const express = require('express');
const router = express.Router();

const HNumCtrl = require('../controllers/habitudeNum');
const authentification = require('../middleware/authentification');

router.get('/users/:id/habitudesNumerique', authentification, HNumCtrl.getHabitudesNumerique);
router.get('/users/:id/bilan/:idBilan/habitudesTransport', authentification, HNumCtrl.getHabitudesNumeriqueByBilan);
router.put('/users/:id/bilan/:idBilan/habitudesNumerique/:idHN', authentification, HNumCtrl.updateHabitudeNumerique);
router.delete('/users/:id/bilan/:idBilan/habitudesNumerique/:idHN', authentification, HNumCtrl.deleteHabitudeNumerique);

module.exports = router;
