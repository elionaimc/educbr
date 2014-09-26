module.exports = function(app) {
	
	var HomeController = {
		index: function(req, res) {
			res.render('index');
		},
		relatorio: function(req, res) {
			res.render('relatorio');
		},
		login: function(req, res) {
			var email = req.body.usuario.email
			, senha = req.body.usuario.senha;
			if(email && senha === "system") {
				var usuario = req.body.usuario;
				req.session.usuario = usuario;
				res.redirect('/rbc');
			} else {
				res.redirect('/');
			}
		},
		logout: function(req, res) {
			req.session.destroy();
			res.redirect('/');
		}
	};
	
	return HomeController;
};