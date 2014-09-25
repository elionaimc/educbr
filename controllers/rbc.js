module.exports = function(app) {
	var RBCController = {
		// exibe o formulário inicial
		index: function(req, res) {
			var usuario = req.session.usuario;
			var params = {usuario: usuario};
			res.render('rbc/recuperar', params);// renderiza formulário
		},// fim index
		
		// calcula os casos mais similares e exibe para avaliação das soluções candidatas
		recuperar: function(req, res) {
			var novo = req.body;
			Caso.find().lean().exec(function(err, casos) {
				var vizinhos = [];
				
				// calcula a distância euclidiana e add à lista
				for(var i in casos) {
					var distanciaV = calcularDistancias(novo, casos[i].demandas);
					vizinhos[i] = {distancia: distanciaV, encaminhamentos: casos[i].encaminhamentos, classe: casos[i].classe};
				}
				// Ordena os vizinhos por distância em ordem crescente
				vizinhos.sort(function (a, b) {
					return a.distancia - b.distancia;
				});
				// envia lista de vizinhos em formato JSON
				res.send(JSON.stringify(vizinhos.slice(0, 10)));
			});
		}, // fim recuperar
		
		// exibe o formulário inicial
		reter: function(req, res) {
			Caso.find().lean().exec(function(err, casos) {
				var vizinhos = [];
				var usuario = req.session.usuario;
				var novo = new Caso(req.body);
				novo.atendidoPor = usuario.email;
				novo.classe = classificar(novo);
				var atendimento = new Registro(novo);
				
				for(var i in casos) {
					var distanciaV = calcularDistancias(novo, casos[i].demandas);
					vizinhos[i] = {distancia: distanciaV, encaminhamentos: casos[i].encaminhamentos, demandas: casos[i].demandas};
				}
				// Ordena os vizinhos por distância em ordem crescente
				vizinhos.sort(function (a, b) {
					return a.distancia - b.distancia;
				});
				novo.save();
				atendimento.save(function (err) {
		  			if (err) res.status(500).send("Não foi possível completar sua solicitação: "+ err);
		  			else {
						var mensagem = (flag) ? 'Novo CASO salvo com sucesso!' : 'Registro realizado com sucesso!';
						res.status(200).send(mensagem);
					}
				});
			});
		}
	}
	
	// Realiza o cálculo euclidiano para distâncias
	var calcularDistancias = function (caso, vizinho) {
	  var pesos = {
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
	    };
		// insere o peso nas demandas
		var c = [];
		var v = [];
		for (demanda in caso) {
			c[demanda] = caso[demanda] * pesos[demanda];
			v[demanda] = (vizinho[demanda] != undefined) ? (vizinho[demanda] * pesos[demanda]) : 0;
		}
		// calcula a soma dos quadrados das diferenças
		var soma = 0;
		for (demanda in c) {
			soma += Math.pow(c[demanda] - v[demanda], 2);
		}
		return Math.sqrt(soma / 26);// retorna a raiz quadrada da média aritmética
	}
	
	// define a classe com base na demanda de maior peso
	var classificar = function(novoCaso){
		var classe = "E";
		if (
			novoCaso.demandas.atrasosConstantes == '1' || 
			novoCaso.demandas.desequilibrioPsicologico == '1' || 
			novoCaso.demandas.dificuldadeAprendizagem == '1' || 
			novoCaso.demandas.muitasFaltas == '1' || 
			novoCaso.demandas.orientacaoPedagogica == '1'
			) {
			classe = 'A';
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
			classe = 'B';
		} else if (
			novoCaso.demandas.problemaComportamento == '1' || 
			novoCaso.demandas.problemaRelacionamentoAluno == '1' || 
			novoCaso.demandas.problemaRelacionamentoProfessor == '1'
			) {
			classe = 'C';
		} else if (
			novoCaso.demandas.problemaDisciplinarGrave == '1' || 
			novoCaso.demandas.problemaDisciplinarLeve == '1' || 
			novoCaso.demandas.problemaDisciplinarMedio == '1'
			) {
			classe = 'D';
		} else classe = 'E';
		return classe;
	};
return RBCController;
};