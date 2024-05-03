const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
		const userId = decodedToken.userId;
		const userIsAdmin = decodedToken.isAdmin;

		if (userIsAdmin || userId) {
			next();
		} else {
			throw "L'utilisateur n'est pas autorisé à effectuer cette action."
		}
	} catch {
		res.status(401).json({
			error: new Error("Requête non authentifiée !")
		});
	}
};
