const express = require('express');
const router = express.Router();

const authentification = require('../middleware/authentification');
const userCtrl = require('../controllers/user');
const authorization = require('../middleware/authorizations');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/:id', authentification, userCtrl.getOneUser);
router.get('/', authentification, authorization.isAdmin, userCtrl.getUsers);
router.delete('/:id', authentification, authorization.authorizeUserModifOrDel,userCtrl.deleteUser);  // Apply combined auth middleware here
router.put('/:id', authentification, authorization.authorizeUserModifOrDel,userCtrl.updateUser);

// Route pour télécharger l'avatar
router.post('/:id/avatar', authentification, authorization.authorizeUserModifOrDel, userCtrl.uploadAvatar, userCtrl.updateAvatar);

// Route pour supprimer l'avatar
router.delete('/:id/avatar', authentification, authorization.authorizeUserModifOrDel, userCtrl.deleteAvatar);
module.exports = router;
