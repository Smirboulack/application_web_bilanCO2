const express = require('express');
const router = express.Router();

const BilanCtrl = require('../controllers/bilan');
const BilanRequestCtrl = require('../requests/BilanRequest');
const authentification = require('../middleware/authentification');

router.get('/users/:id/bilan', authentification, BilanCtrl.getBilan);
router.get('/users/:id/bilan/:idBilan', authentification, BilanCtrl.getOneBilan);
router.post('/users/:id/bilan', authentification, BilanRequestCtrl.createAllBilan);
router.delete('/users/:id/bilan/:idBilan', authentification, BilanCtrl.deleteBilan);

module.exports = router;
