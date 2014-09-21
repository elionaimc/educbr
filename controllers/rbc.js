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
			var novoCaso = {};
			novoCaso.demandas = req.body;
			var vizinhos = [];
			Caso.find().lean().exec(function(err, casos) {
				// mapeamento da vizinhança utilizando kNN
				for(var i in casos) {
					var distanciaV = calcularDistancia(casos[i], novoCaso);
					vizinhos[i] = {id: casos[i]._id, distancia: distanciaV, encaminhamentos: casos[i].encaminhamentos, classe: casos[i].classe};
				}
			
				// Ordena os vizinhos por distância em ordem crescente
				vizinhos.sort(function (a, b) {
					return a.distancia - b.distancia;
				});
			
				// descobrir qual a classe da demanda mais relevante do novo caso
				classificar(novoCaso);
				//var caso = new Caso(novoCaso);
				var params = {usuario: usuario, vizinhos: vizinhos};
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
	 * d(x,y) = raiz(
	 *               ((x1-y1) * (x1-y1)) + 
	 *               ((x2 - y2) * (x2 - y2)) +
	 *               ...
	 *               ((xN - yN) * (xN - yN))
	 *           );
	 */
	var calcularDistancia = function(vizinho, novoCaso){
		
		// Essas demandas tem peso = 5
		var DaC = parseInt(vizinho.demandas.atrasosConstantes) - parseInt(novoCaso.demandas.atrasosConstantes);
		DaC = (DaC * DaC);
		DaC = DaC * 5;
		
		var DdP = parseInt(vizinho.demandas.desequilibrioPsicologico) - parseInt(novoCaso.demandas.desequilibrioPsicologico);
		DdP = (DdP * DdP);
		DdP = DdP * 5;
		
		var DdA = parseInt(vizinho.demandas.dificuldadeAprendizagem) - parseInt(novoCaso.demandas.dificuldadeAprendizagem);
		DdA = (DdA * DdA);
		DdA = DdA * 5;
		
		var DmF = parseInt(vizinho.demandas.muitasFaltas) - parseInt(novoCaso.demandas.muitasFaltas);
		DmF = (DmF * DmF);
		DmF = DmF * 5;
		
		var DoP = parseInt(vizinho.demandas.orientacaoPedagogica) - (novoCaso.demandas.orientacaoPedagogica);
		DoP = (DoP * DoP);
		DoP = DoP * 5;
		
		// Essas demandas tem peso = 4
		var DB = parseInt(vizinho.demandas.bulling) - parseInt(novoCaso.demandas.bulling);
		DB = (DB * DB);
		DB = DB * 4;
		
		var DoS = parseInt(vizinho.demandas.conflitoOpcaoSexual) - parseInt(novoCaso.demandas.conflitoOpcaoSexual);
		DoS = (DoS * DoS);
		DoS = DoS * 4;
		
		var DrA = parseInt(vizinho.demandas.conflitoRelacionalAfetivo) - parseInt(novoCaso.demandas.conflitoRelacionalAfetivo);
		DrA = (DrA * DrA);
		DrA = DrA * 4;
		
		var DoC = parseInt(vizinho.demandas.desmotivacaoCurso) - parseInt(novoCaso.demandas.desmotivacaoCurso);
		DoC = (DoC * DoC);
		DoC = DoC * 4;
		
		var DR = parseInt(vizinho.demandas.desmotivacaoRendimento) - parseInt(novoCaso.demandas.desmotivacaoRendimento);
		DR = (DR * DR);
		DR = DR * 4;
		
		var DSe = parseInt(vizinho.demandas.orientacaoSecular) - parseInt(novoCaso.demandas.orientacaoSecular);
		DSe = (DSe * DSe);
		DSe = DSe * 4;
		
		var DsA = parseInt(vizinho.demandas.situacaoAbuso) - parseInt(novoCaso.demandas.situacaoAbuso);
		DsA = (DsA * DsA);
		DsA = DsA * 4;
		
		var DeX = parseInt(vizinho.demandas.situacaoExclusao) - parseInt(novoCaso.demandas.situacaoExclusao);
		DeX = (DeX * DeX);
		DeX = DeX * 4;
		
		var DtI = parseInt(vizinho.demandas.situacaoTimidez) - parseInt(novoCaso.demandas.situacaoTimidez);
		DtI = (DtI * DtI);
		DtI = DtI * 4;
		
		// Essas demandas tem peso = 3
		var pCo = parseInt(vizinho.demandas.problemaComportamento) - parseInt(novoCaso.demandas.problemaComportamento);
		pCo = (pCo * pCo);
		pCo = pCo * 3;
		
		var PrA = parseInt(vizinho.demandas.problemaRelacionamentoAluno) - parseInt(novoCaso.demandas.problemaRelacionamentoAluno);
		PrA = (PrA * PrA);
		PrA = PrA * 3;
		
		var PPr = parseInt(vizinho.demandas.problemaRelacionamentoProfessor) - parseInt(novoCaso.demandas.problemaRelacionamentoProfessor);
		PPr = (PPr * PPr);
		PPr = PPr * 3;
		
		// Essas demandas tem peso = 2
		var PdG = parseInt(vizinho.demandas.problemaDisciplinarGrave) - parseInt(novoCaso.demandas.problemaDisciplinarGrave);
		PdG = (PdG * PdG);
		PdG = PdG * 2;
		
		var PdM = parseInt(vizinho.demandas.problemaDisciplinarMedio) - parseInt(novoCaso.demandas.problemaDisciplinarMedio);
		PdM = (PdM * PdM);
		PdM = PdM * 2;
		
		var PdL = parseInt(vizinho.demandas.problemaDisciplinarLeve) - parseInt(novoCaso.demandas.problemaDisciplinarLeve);
		PdL = (PdL * PdL);
		PdL = PdL * 2;
		
		
		// Essas demandas tem peso = 1
		var DcF = parseInt(vizinho.demandas.conflitoFamiliar) - parseInt(novoCaso.demandas.conflitoFamiliar);
		DcF = (DcF * DcF);
		
		var SeP = parseInt(vizinho.demandas.separacaoPais) - parseInt(novoCaso.demandas.separacaoPais);
		SeP = (SeP * SeP);
		
		var SeM = parseInt(vizinho.demandas.problemaRelacionamentoMae) - parseInt(novoCaso.demandas.problemaRelacionamentoMae);
		SeM = (SeM * SeM);
		
		var PrP = parseInt(vizinho.demandas.problemaRelacionamentoPai) - parseInt(novoCaso.demandas.problemaRelacionamentoPai);
		PrP = (PrP * PrP);
		
		var RC = parseInt(vizinho.demandas.problemaRelacionamentoCasa) - parseInt(novoCaso.demandas.problemaRelacionamentoCasa);
		RC = (RC * RC);
		
		var Se = parseInt(vizinho.demandas.problemaSocioEconomico) - parseInt(novoCaso.demandas.problemaSocioEconomico);
		Se = (Se * Se);
		
		// raiz quadrada da soma das distâncias individuais
		distancia = Math.sqrt(
			DaC + DdP + DdA + DmF + DoP + DB + DoS + DrA + DoC + DR 
			+ DSe + DsA + DeX + DtI + DeX + pCo + PrA + PPr + PdG + PdM + PdL
			+ DcF + SeP + SeM + PrP + RC + Se
			); // dividir pelo intervalo dos pesos normaliza o resultado (menor = 0, maior = 1)
		
		return distancia;
	}
	
return RBCController;
};