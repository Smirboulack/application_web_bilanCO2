const express = require('express');
const router = express.Router();

const alimCtrl = require('../controllers/alimentation');
const authentification = require('../middleware/authentification');
const authorization = require('../middleware/authorizations');

router.get('/categories/:idCat', alimCtrl.getType);
router.get('/:id', alimCtrl.getOne);
router.get('/', alimCtrl.getAll);
router.put('/:id', authentification, authorization.isAdmin, alimCtrl.updateAlim);
router.delete('/:id', authentification, authorization.isAdmin, alimCtrl.deleteAlim);

module.exports = router;
