var educase = angular.module('educase', []);// RBC AngularJS App

educase.controller('recuperarController', function($scope, $http, casoDefault) {
	$scope.caso = {};
	$scope.caso.demandas = casoDefault.caso();
	$scope.vizinhos = [];
	$scope.recuperarKNN = function() {
		$http.post('/recuperar', $scope.caso.demandas)
				.success(function(data) {
					if(data.length > 0)
						alert('SUCESSO: FOI' + JSON.stringify($scope.caso.demandas) + 'SUCESSO: VEIO' + JSON.stringify(data));
					else
						alert('Servidor retornou ZERO resultados');
				})
				.error(function(data) {
					alert('ERRO: ' + data);
				});
	}
	
	
});


educase.service('casoDefault', function() {
    var demandas = {
		desequilibrioPsicologico: 0,
		orientacaoSecular: 0,
		orientacaoPedagogica: 0,
		muitasFaltas: 0,
		problemaSocioEconomico: 0,
		atrasosConstantes: 0,
		bulling: 0,
		desmotivacaoRendimento: 0,
		desmotivacaoCurso: 0,
		dificuldadeAprendizagem: 0,
		problemaDisciplinarLeve: 0,
		problemaDisciplinarMedio: 0,
		problemaDisciplinarGrave: 0,
		problemaComportamento: 0,
		conflitoFamiliar: 0,
		conflitoRelacionalAfetivo: 0,
		conflitoOpcaoSexual: 0,
		problemaRelacionamentoMae: 0,
		problemaRelacionamentoPai:  0,
		problemaRelacionamentoCasa: 0,
		problemaRelacionamentoAluno: 0,
		problemaRelacionamentoProfessor: 0,
		situacaoAbuso: 0,
		situacaoExclusao: 0,
		situacaoTimidez: 0,
		separacaoPais: 0
    };
	
    this.caso = function(){
    	return demandas;
    }
});




