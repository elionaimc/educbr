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
			var novoCaso = req.body.caso;
			novoCaso.atendidoPor = usuario.email;
			var vizinhos = [];
			Caso.find().lean().exec(function(err, casos) {
				// mapeamento da vizinhança utilizando kNN
				for(var i in casos) {
					var distanciaV = calcularDistancia(casos[i], novoCaso);
					vizinhos[i] = {id: casos[i]._id, distancia: distanciaV, demandas: casos[i].demandas, classe: casos[i].classe};
				}
			
				// Ordena os vizinhos por distância em ordem crescente
				vizinhos.sort(function (a, b) {
					return a.distancia - b.distancia;
				});
			
				// descobrir qual a classe da demanda mais relevante do novo caso
				classificar(novoCaso);
				var caso = new Caso(novoCaso);
				var params = {usuario: usuario, caso: caso, vizinhos: vizinhos};
				res.render('rbc/reusar', params);
			});
		} // fim recuperar
	}
	
	/*
	 * define a classe do novo caso com base na demanda de maior peso
	 */
	var classificar = function(novoCaso){
		if (
			novoCaso.demandas.atrasosConstantes || 
			novoCaso.demandas.desequilibrioPsicologico || 
			novoCaso.demandas.dificuldadeAprendizagem || 
			novoCaso.demandas.muitasFaltas || 
			novoCaso.demandas.orientacaoPedagogica
			) {
			novoCaso.classe = 'A';
		} else if (
			novoCaso.demandas.bulling || 
			novoCaso.demandas.conflitoOpcaoSexual || 
			novoCaso.demandas.conflitoRelacionalAfetivo || 
			novoCaso.demandas.desmotivacaoCurso || 
			novoCaso.demandas.desmotivacaoRendimento || 
			novoCaso.demandas.orientacaoSecular || 
			novoCaso.demandas.situacaoAbuso || 
			novoCaso.demandas.situacaoExclusao || 
			novoCaso.demandas.situacaoTimidez
			) {
			novoCaso.classe = 'B';
		} else if (
			novoCaso.demandas.problemaComportamento || 
			novoCaso.demandas.problemaRelacionamentoAluno || 
			novoCaso.demandas.problemaRelacionamentoProfessor
			) {
			novoCaso.classe = 'C';
		} else if (
			novoCaso.demandas.problemaDisciplinarGrave || 
			novoCaso.demandas.problemaDisciplinarLeve || 
			novoCaso.demandas.problemaDisciplinarMedio
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
		x = (DaC * DaC);
		DaC = x * 5;
		
		var DdP = parseInt(vizinho.demandas.desequilibrioPsicologico) - parseInt(novoCaso.demandas.desequilibrioPsicologico);
		x = (DdP * DdP);
		DdP = x * 5;
		
		var DdA = parseInt(vizinho.demandas.dificuldadeAprendizagem) - parseInt(novoCaso.demandas.dificuldadeAprendizagem);
		x = (DdA * DdA);
		DdA = x * 5;
		
		var DmF = parseInt(vizinho.demandas.muitasFaltas) - parseInt(novoCaso.demandas.muitasFaltas);
		x = (DmF * DmF);
		DmF = x * 5;
		
		var DoP = parseInt(vizinho.demandas.orientacaoPedagogica) - (novoCaso.demandas.orientacaoPedagogica * 5);
		x = (DoP * DoP);
		DoP = x * 5;
		
		// Essas demandas tem peso = 4
		var DB = parseInt(vizinho.demandas.bulling) - parseInt(novoCaso.demandas.bulling);
		x = (DB * DB);
		DB = x * 4;
		
		var DoS = parseInt(vizinho.demandas.conflitoOpcaoSexual) - parseInt(novoCaso.demandas.conflitoOpcaoSexual);
		x = (DoS * DoS);
		DoS = x * 4;
		
		var DrA = parseInt(vizinho.demandas.conflitoRelacionalAfetivo) - parseInt(novoCaso.demandas.conflitoRelacionalAfetivo);
		x = (DrA * DrA);
		DrA = x * 4;
		
		var DoC = parseInt(vizinho.demandas.desmotivacaoCurso) - parseInt(novoCaso.demandas.desmotivacaoCurso);
		x = (DoC * DoC);
		DoC = x * 4;
		
		var DR = parseInt(vizinho.demandas.desmotivacaoRendimento) - parseInt(novoCaso.demandas.desmotivacaoRendimento);
		x = (DR * DR);
		DR = x * 4;
		
		var DSe = parseInt(vizinho.demandas.orientacaoSecular) - parseInt(novoCaso.demandas.orientacaoSecular);
		x = (DSe * DSe);
		DSe = x * 4;
		
		var DsA = parseInt(vizinho.demandas.situacaoAbuso) - parseInt(novoCaso.demandas.situacaoAbuso);
		x = (DsA * DsA);
		DsA = x * 4;
		
		var DeX = parseInt(vizinho.demandas.situacaoExclusao) - parseInt(novoCaso.demandas.situacaoExclusao);
		x = (DeX * DeX);
		DeX = x * 4;
		
		var DtI = parseInt(vizinho.demandas.situacaoTimidez) - parseInt(novoCaso.demandas.situacaoTimidez);
		x = (DtI * DtI);
		DtI = x * 4;
		
		// Essas demandas tem peso = 3
		var pCo = parseInt(vizinho.demandas.problemaComportamento) - parseInt(novoCaso.demandas.problemaComportamento);
		x = (pCo * pCo);
		pCo = x * 3;
		
		var PrA = parseInt(vizinho.demandas.problemaRelacionamentoAluno) - parseInt(novoCaso.demandas.problemaRelacionamentoAluno);
		x = (PrA * PrA);
		PrA = x * 3;
		
		var PPr = parseInt(vizinho.demandas.problemaRelacionamentoProfessor) - parseInt(novoCaso.demandas.problemaRelacionamentoProfessor);
		x = (PPr * PPr);
		PPr = x * 3;
		
		// Essas demandas tem peso = 2
		var PdG = parseInt(vizinho.demandas.problemaDisciplinarGrave) - parseInt(novoCaso.demandas.problemaDisciplinarGrave);
		x = (PdG * PdG);
		PdG = x * 2;
		
		var PdM = parseInt(vizinho.demandas.problemaDisciplinarMedio) - parseInt(novoCaso.demandas.problemaDisciplinarMedio);
		x = (PdM * PdM);
		PdM = x * 2;
		
		var PdL = parseInt(vizinho.demandas.problemaDisciplinarLeve) - parseInt(novoCaso.demandas.problemaDisciplinarLeve);
		x = (PdL * PdL);
		PdL = x * 2;
		
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
			) / 5; // dividir pelo intervalo dos pesos normaliza o resultado (menor = 0, maior = 1)
		
		return distancia;
	}
	
return RBCController;
};