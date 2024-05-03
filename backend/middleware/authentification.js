const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
	const token = req.headers.authorization.split(' ')[1];

	if (token) {
		try {
			const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
			const userId = decodedToken.userId;
			const pseudo = decodedToken.pseudo;
			const admin = decodedToken.admin;
			req.user = { userId : userId, pseudo: pseudo, admin : admin};
			next();
		} catch (error) {
			res.status(401).json({message: "Non authorisé : token invalide."});
		}
	}
	else {
		res.status(401).json({message: "Non authorisé : token manquant."});
	}
};