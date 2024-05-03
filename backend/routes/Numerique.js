const express = require('express');
const router = express.Router();

const numCtrl = require('../controllers/numerique');
const authentification = require('../middleware/authentification');
const authorization = require('../middleware/authorizations');

router.get('/', numCtrl.getAll);
router.get('/:id', numCtrl.getOne);
router.put('/:id', authentification, authorization.isAdmin, numCtrl.updateNum);
router.delete('/:id', authentification, authorization.isAdmin, numCtrl.deleteNum);

module.exports = router;
