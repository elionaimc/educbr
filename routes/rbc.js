module.exports = function(app) {
	var autenticar = require('./../middlewares/autenticador');
	var rbc = app.controllers.rbc;
	app.get('/rbc', autenticar, rbc.index);
	app.post('/recuperar', autenticar, rbc.recuperar);
};