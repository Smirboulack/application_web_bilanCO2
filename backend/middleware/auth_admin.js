const jwt = require('jsonwebtoken');
const {db} = require('../config/database');
 
module.exports = async (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
		const userId = decodedToken.userId;
		req.auth = {
			userId: userId
		};
		const user = await db.oneOrNone('SELECT * FROM utilisateur WHERE id = $1', [userId]);

		if (!user) {
			throw new Error('Utilisateur non trouvé.');
		}

		//TODO : à changer plus tard pour true/false
		if (user.type_utilisateur !== 'Admin') {
			throw new Error('Accès interdit. Vous devez être un administrateur.');
		}
        
		next();
	} catch(error) {
		res.status(401).json({message: error.message });
	}
};