module.exports = function(app) {
	var RBCController = {
		// exibe o formulário inicial
		index: function(req, res) {
			var usuario = req.session.usuario;
			var params = {usuario: usuario};
			  res.render('rbc/recuperar', params);
		},// fim index
		
		// calcula os casos mais similares e exibe para avaliação das soluções candidatas
		recuperar: function(req, res) {
			var novo = req.body;
			Caso.find().lean().exec(function(err, casos) {
				var encaminhamentos = calcularKNN(novo, casos);
				var params = {vizinhos: encaminhamentos};
				res.send(JSON.stringify(params.vizinhos));
			});
		} // fim recuperar
	}
	
	// Realiza o cálculo euclidiano para distâncias
	var calcularKNN = function(teste, alvo) {
		var knn = require('alike');
		opcoes = {
		  k: 10, // k-vizinhos a recuperar
		  key: function(caso){return caso.demandas}, // indica para buscar somente nas demandas dos casos
		  weights: {
  			atrasosConstantes: 5,
  			desequilibrioPsicologico: 5,
  			dificuldadeAprendizagem: 5,
  			muitasFaltas: 5,
  			orientacaoPedagogica: 5,
			bulling: 4, 
			conflitoOpcaoSexual: 4, 
			conflitoRelacionalAfetivo: 4, 
			desmotivacaoCurso: 4, 
			desmotivacaoRendimento: 4, 
			orientacaoSecular: 4, 
			situacaoAbuso: 4, 
			situacaoExclusao: 4, 
			situacaoTimidez: 4,
			problemaComportamento: 3,
			problemaRelacionamentoAluno: 3, 
			problemaRelacionamentoProfessor: 3,
			problemaDisciplinarGrave: 2, 
			problemaDisciplinarLeve: 2, 
			problemaDisciplinarMedio: 2,
			conflitoFamiliar: 1,
			separacaoPais: 1,
			problemaRelacionamentoMae: 1,
			problemaRelacionamentoPai: 1,
			problemaRelacionamentoCasa: 1,
			problemaSocioEconomico: 1
		    }
		}
		// vizinhos mais próximos utilizando biblioteca Alike
		var vizinhos = knn(teste, alvo, opcoes);
		var listE = [];
		for (var i in vizinhos){
			listE.push(vizinhos[i].encaminhamentos);
		}
		
		return listE;
	}// fim calcularKNN
	
return RBCController;
};