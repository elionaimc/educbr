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
				// calcula a distância euclidiana e adiciona à lista
				for(var i in casos) {
					var distanciaV = calcularDistancias(novo, casos[i].demandas);
					vizinhos[i] = {
						distancia: distanciaV,
						encaminhamentos: casos[i].encaminhamentos,
						classe: casos[i].classe,
						contexto: casos[i].contexto
					};
				}
				// Ordena os vizinhos por distância em ordem crescente
				vizinhos.sort(function (a, b) {
					return a.distancia - b.distancia;
				});
				// envia lista de vizinhos em formato JSON
				res.send(JSON.stringify(vizinhos.slice(0, 10)));
			});
		}, // fim recuperar
		
		// persiste o novo caso em duas coleções distintas
		// caso seja uma nova unidade de conhecimento relevante será adcionda à base de casos
		// independentemente disto, será adcionada à base de dados administrativa
		reter: function(req, res) {
			Caso.find().lean().exec(function(err, casos) {
				var vizinhos = [];
				var usuario = req.session.usuario;
				var novo = new Caso(req.body);// cria um novo caso
				novo.atendidoPor = usuario.email;// identifica usuario que realizou o atendimento
				novo.classe = classificar(novo);// classificamos o caso
				var atendimento = new Atendimento(novo);// cria um novo registro administrativo do caso
				for(var i in casos) {
					var distanciaV = calcularDistancias(req.body.demandas, casos[i].demandas);
					vizinhos[i] = {
						distancia: distanciaV
					};
				}
				// Ordena os vizinhos por distância em ordem crescente
				vizinhos.sort(function (a, b) {
					return a.distancia - b.distancia;
				});
				
				var flag = false;
				if (vizinhos.length > 0) {
					if (vizinhos[0].distancia > 0) {// se existe um conhecimento novo, mesmo entre outros similares
						novo.save();// o novo caso é adcionado à base de conhecimentos
						flag = true;// indicamos que um novo conhecimento foi adquirido
					}
				} else {// caso não exista casos similares, será adcionado à base de casos
					novo.save();
					flag = true;
				} 
				
				atendimento.save(function (err) {// incondicionalmente o novo caso é adcionado à base de dados administrativa
		  			if (err) res.status(500).send("Não foi possível completar sua solicitação: "+ err);
		  			else {
						var mensagem = (flag) ? 'Novo registro adcionado à Base de Casos!' : 'Registro realizado com sucesso!';
						res.status(200).send(mensagem);
					}
				});
			});
		}
	}
	
	// Realiza o cálculo euclidiano para distâncias
	var calcularDistancias = function (casoD, vizinho) {
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
		if (typeof(casoD) == 'object' && Object.getOwnPropertyNames(casoD).length > 0) {
			for (demanda in casoD) {
				c[demanda] = casoD[demanda] * pesos[demanda];
			}
		} else {
			for (demanda in pesos) {
				c[demanda] = 0;
			}
		}
		if (Object.getOwnPropertyNames(vizinho).length > 0) {
			for (demanda in casoD) {
				v[demanda] = (vizinho[demanda] != undefined) ? (vizinho[demanda] * pesos[demanda]) : 0;
			}
		} else {
			for (demanda in pesos) {
				v[demanda] = 0;
			}
		}
		
		// calcula a soma dos quadrados das diferenças
		var soma = 0;
		for (demanda in c) {
			soma += Math.pow(c[demanda] - v[demanda], 2);
		}
		console.log('Math.sqrt distancia');
		console.log(Math.sqrt(soma / 26));
		return Math.sqrt(soma / 26);// retorna a raiz quadrada
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