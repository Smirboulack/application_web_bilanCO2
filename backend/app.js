const express = require('express');
const app = express();
app.use(express.json());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	next();
});

const userRoute = require('./routes/Users');
const bilanRoute = require('./routes/Bilan');
const habitudeAlimRoute = require('./routes/HAlimentation');
const habitudeNumRoute = require('./routes/HNumerique');
const habitudeTranspRoute = require('./routes/HTransport');
const transportRoute = require('./routes/Transport');
const alimRoute = require('./routes/Alimentation');
const numeriqueRoute = require('./routes/Numerique');

app.get('/', (req, res) => {
	res.send('Hello World!')
});

app.get('/test', (req, res) => {
	res.send('TEST');
});

app.use('/users', userRoute);
app.use('/', bilanRoute);
app.use('/', habitudeAlimRoute);
app.use('/', habitudeNumRoute);
app.use('/', habitudeTranspRoute);
app.use('/transport', transportRoute);
app.use('/alimentation', alimRoute);
app.use('/numerique', numeriqueRoute);

module.exports = app;