module.exports = function(app) {
	
	var HomeController = {
		index: function(req, res) {
            res.render('index');
		},
		relatorio: function(req, res) {
	        var demands = [];
	        demands['atrasosConstantes'] = "Atrasos constantes";
	        demands['desequilibrioPsicologico'] = "Desequilíbrio ou problema de ordem psicológica";
	        demands['dificuldadeAprendizagem'] = "Dificuldade de aprendizagem em disciplina";
	        demands['muitasFaltas'] = "Muitas faltas";
	        demands['orientacaoPedagogica'] = "Necessidade de orientação pedagógica";
	        demands['bulling'] = "Bulling";
	        demands['conflitoOpcaoSexual'] = "Conflito com relação a opção sexual";
	        demands['conflitoRelacionalAfetivo'] = "Conflito devido a situação relacional ou afetiva";
	        demands['desmotivacaoCurso'] = "Desmotivação pela opção de curso";
	        demands['desmotivacaoRendimento'] = "Desmotivação por baixo rendimento";
	        demands['orientacaoSecular'] = "Necessidade de orientação secular (pessoal/não acadêmica)";
	        demands['situacaoAbuso'] = "Situação de abuso (moral, sexual etc.)";
	        demands['situacaoExclusao'] = "Situação de exclusão em sala";
	        demands['situacaoTimidez'] = "Situação relacionada à timidez";
	        demands['problemaComportamento'] = "Problema de comportamento";
	        demands['problemaRelacionamentoAluno'] = "Problema de relacionamento aluno x aluno";
	        demands['problemaRelacionamentoProfessor'] = "Problema de relacionamento professor x aluno";
	        demands['problemaDisciplinarGrave'] = "Problema de ordem disciplinar grave";
	        demands['problemaDisciplinarLeve'] = "Problema de ordem disciplinar leve";
	        demands['problemaDisciplinarMedio'] = "Problema de ordem disciplinar médio";
	        demands['conflitoFamiliar'] = "Conflito familiar";
	        demands['separacaoPais'] = "Pais em separação";
	        demands['problemaRelacionamentoMae'] = "Problema de relacionamento com a mãe";
	        demands['problemaRelacionamentoPai'] = "Problema de relacionamento com o pai";
	        demands['problemaRelacionamentoCasa'] = "Problema de relacionamento em casa";
	        demands['problemaSocioEconomico'] = "Problema de ordem socioeconômica do aluno ou da família";
			Atendimento.find().lean().exec(function(err, casos) {
                var demandas = [];
                var cursos = [0, 0, 0, 0, 0, 0, 0, 0];
                for(var i in casos) {
                    for(var j in casos[i].demandas) {
                        demandas[j] = (demandas[j])? demandas[j] + 1 : 1;
                    }

                    if(casos[i].curso == "1") cursos[0]++;
                    if(casos[i].curso == "2") cursos[1]++;
                    if(casos[i].curso == "3") cursos[2]++;
                    if(casos[i].curso == "4") cursos[3]++;
                    if(casos[i].curso == "5") cursos[4]++;
                    if(casos[i].curso == "6") cursos[5]++;
                    if(casos[i].curso == "7") cursos[6]++;
                    if(casos[i].curso == "8") cursos[7]++;
                }
                
                params = {demandas: demandas, demands: demands, cursos:cursos};
                res.render('relatorio', params);
            });
		},
		login: function(req, res) {
			
			
			
			
			User.find().lean().exec(function(err, users) {
                var passaporte = false;
				
                for(var i in users) {
                    if(users[i].email == req.body.usuario.email && users[i].senha == req.body.usuario.senha) passaporte = true;
                }
			    if(passaporte) {
			    	var usuario = req.body.usuario;
			    	req.session.usuario = usuario;
			    	res.redirect('/rbc');
			    } else {
				    res.redirect('/');
			    }
            });
		},
		logout: function(req, res) {
			req.session.destroy();
			res.redirect('/');
		}
	};
	
	return HomeController;
};