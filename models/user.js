module.exports = function(app) {
	var Mongoose = require('mongoose');
	var userSchema = new Mongoose.Schema({
		nome: {type: String},
		email: {type: String},
		senha: {type: String}
	});
	
	return User = Mongoose.model('User', userSchema);
};