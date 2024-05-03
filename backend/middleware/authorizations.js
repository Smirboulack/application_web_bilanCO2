exports.isAdmin = (req, res, next) => {
	const user = req.user;
	if (user && user.admin == "Admin") {
		next();
	}
	else {
		res.status(403).json({ message: "Non autorisée."});
	}
}

exports.authorizeUserModifOrDel = (req, res, next) => {
	requestedUserId = req.params.id;
	isAdmin = req.user.admin === "Admin";
	userId = req.user.userId;
	if (isAdmin || userId === requestedUserId) {
		next();
	}
	else {
		res.status(403).json({ message: "Non autorisée : vous n'êtes pas autorisé à modifier cet utilisateur."});
	}
}