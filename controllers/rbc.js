module.exports = function(app) {
	var RBCController = {
		/*
		 * exibe formulário de novo atendimento
		 */
		index: function(req, res) {
			var usuario = req.session.usuario;
			var params = {usuario: usuario};
			  res.render('rbc/recuperar', params);
		},// fim index
		
		/*
		 * calcula os casos mais similares e exibe para avaliação das soluções candidatas
		 */
		recuperar: function(req, res) {
			var usuario = req.session.usuario;
			var novo = req.body;
			Caso.find().lean().exec(function(err, casos) {
				var encaminhamentos = calcularKNN(novo, casos);
				var params = {usuario: usuario, vizinhos: encaminhamentos};
				res.send(JSON.stringify(params.vizinhos));
			});
		} // fim recuperar
	}
	
	/*
	 * define a classe do novo caso com base na demanda de maior peso
	 */
	var classificar = function(novoCaso){
		if (
			novoCaso.demandas.atrasosConstantes == '1' || 
			novoCaso.demandas.desequilibrioPsicologico == '1' || 
			novoCaso.demandas.dificuldadeAprendizagem == '1' || 
			novoCaso.demandas.muitasFaltas == '1' || 
			novoCaso.demandas.orientacaoPedagogica == '1'
			) {
			novoCaso.classe = 'A';
		} else if (
			novoCaso.demandas.bulling == '1' || 
			novoCaso.demandas.conflitoOpcaoSexual == '1' || 
			novoCaso.demandas.conflitoRelacionalAfetivo == '1' || 
			novoCaso.demandas.desmotivacaoCurso == '1' || 
			novoCaso.demandas.desmotivacaoRendimento == '1' || 
			novoCaso.demandas.orientacaoSecular == '1' || 
			novoCaso.demandas.situacaoAbuso == '1' || 
			novoCaso.demandas.situacaoExclusao == '1' || 
			novoCaso.demandas.situacaoTimidez == '1'
			) {
			novoCaso.classe = 'B';
		} else if (
			novoCaso.demandas.problemaComportamento == '1' || 
			novoCaso.demandas.problemaRelacionamentoAluno == '1' || 
			novoCaso.demandas.problemaRelacionamentoProfessor == '1'
			) {
			novoCaso.classe = 'C';
		} else if (
			novoCaso.demandas.problemaDisciplinarGrave == '1' || 
			novoCaso.demandas.problemaDisciplinarLeve == '1' || 
			novoCaso.demandas.problemaDisciplinarMedio == '1'
			) {
			novoCaso.classe = 'D';
		} else novoCaso.classe = 'E';
	}
	
	/*
	 * Realiza o cálculo euclidiano para distâncias
	 */
	var calcularKNN = function(teste, alvo){
		var knn = require('alike');
		opcoes = {
		  k: 10,
		  key: function(c){return c.demandas},
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
		
		var vizinhos = knn(teste, alvo, opcoes);
		var listE = [];
		for (var i in vizinhos){
			listE.push(vizinhos[i].demandas);
		}
		
		return listE;
	}
	
return RBCController;
};