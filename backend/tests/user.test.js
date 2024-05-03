const request = require('supertest');
const app = require('../app');
const pgp = require('pg-promise')();
const {db} = require('../config/database')

beforeAll(() => {
	
});

afterAll(async () => {
	await db.none(`DELETE FROM "utilisateur";`);
	pgp.end();
});

test('Signup d\'un utilisateur via API', async () => {
	const newUser = {
		pseudo : "clara",
		date_de_naissance : "2000-06-21",
		email : "clara@gmail.com",
		mot_de_passe : "claraclara"
	};

	const response = await request(app)
		.post('/users/signup')
		.send(newUser)

	
	expect(response.status).toBe(201);
	const users = await db.any('SELECT * FROM utilisateur');
	expect(users.length).toBe(1);
	expect(users[0].pseudo).toBe('clara');
	expect(users[0].email).toBe('clara@gmail.com');
});

test('Signup d\'un utilisateur avec email déjà utilisé', async () => {
	const newUser = {
		pseudo : "clara2",
		date_de_naissance : "2000-06-21",
		email : "clara@gmail.com",
		mot_de_passe : "claraclara2"
	};

	const response = await request(app)
		.post('/users/signup')
		.send(newUser)

	expect(response.status).toBe(400);
	expect(response.body).toHaveProperty("message");
	expect(response.body.message).toBe("L'email est déjà utilisé.");
});

test('Signup d\'un utilisateur avec pseudo déjà utilisé', async () => {
	const newUser = {
		pseudo : "clara",
		date_de_naissance : "2000-06-21",
		email : "clara2@gmail.com",
		mot_de_passe : "claraclara"
	};

	const response = await request(app)
		.post('/users/signup')
		.send(newUser)

	expect(response.status).toBe(400);
	expect(response.body).toHaveProperty("message");
	expect(response.body.message).toBe("Le pseudo est déjà utilisé.");
});

test('Connexion + modification du pseudo d\'un utilisateur sans id', async () => {
	const user = {
		pseudo : "clara",
		mot_de_passe : "claraclara"
	};

	const repConnexion = await request(app)
		.post('/users/login')
		.send(user)

	token = repConnexion.body.token;
	id = repConnexion.body.userId;
    
	const modifs = {
		pseudo : "clara_modif"
	};

	const response = await request(app)
		.put('/users/')
		.set("Authorization", `Bearer ${token}`)
		.send(modifs)
    
	expect(response.status).toBe(400);
	expect(response.body).toHaveProperty("message");
	expect(response.body.message).toBe("Il manque l'id de l'utilisateur à modifier.");
});

test('Connexion + modification des attributs d\'un utilisateur', async () => {
	const user = {
		pseudo : "clara",
		mot_de_passe : "claraclara"
	};

	const repConnexion = await request(app)
		.post('/users/login')
		.send(user)

	token = repConnexion.body.token;
	id = repConnexion.body.userId;
    
	const modifs = {
		id : id,
		pseudo : "clara_modif",
		email: "clara_modif@gmail.com"
	};

	const response = await request(app)
		.put('/users/')
		.set("Authorization", `Bearer ${token}`)
		.send(modifs)

	const userModified = await db.one('SELECT * FROM utilisateur WHERE id = $1', [id]);

	expect(userModified.pseudo).toBe("clara_modif");
	expect(userModified.email).toBe("clara_modif@gmail.com");

	expect(response.status).toBe(200);
	expect(response.body).toHaveProperty("message");
	expect(response.body.message).toBe(`L'utilisateur ${id} bien mis à jour.`);
});

test('Connexion + suppression utilisateur', async () => {
	const user = {
		pseudo : "clara_modif",
		mot_de_passe : "claraclara"
	};

	const repConnexion = await request(app)
		.post('/users/login')
		.send(user)

	token = repConnexion.body.token;
	id = repConnexion.body.userId;

	const response = await request(app)
		.delete(`/users/${id}`)
		.set("Authorization", `Bearer ${token}`)

	const userExistence = await db.none('SELECT * FROM utilisateur WHERE id = $1', [id]);

	expect(userExistence).toBe(null);
	expect(response.status).toBe(200);
	expect(response.body).toHaveProperty("message");
	expect(response.body.message).toBe("Utilisateur supprimé avec succès.");
});