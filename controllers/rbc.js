module.exports = function(app) {
	var RBCController = {
		index: function(req, res) {
			var usuario = req.session.usuario
			, params = {usuario: usuario};
			  res.render('rbc/recuperar', params);
		}
	}
	
return RBCController;
};