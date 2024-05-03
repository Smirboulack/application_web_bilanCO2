const express = require('express');
const router = express.Router();

const transpCtrl = require('../controllers/transport');
const authentification = require('../middleware/authentification');
const authorization = require('../middleware/authorizations');

router.get('/', transpCtrl.getAll);
router.get('/:id', transpCtrl.getOne);
router.put('/:id', authentification, authorization.isAdmin, transpCtrl.updateTransp);
router.delete('/:id', authentification, authorization.isAdmin, transpCtrl.deleteTransp);


module.exports = router;
