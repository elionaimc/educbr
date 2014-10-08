var educase = angular.module('educase', []);// RBC AngularJS App

educase.controller('recuperarController', function($scope, $http, casoDefault) {
	$scope.caso = {};
	$scope.caso.demandas = {};
	$scope.vizinhos = [];
	$scope.solucoes = [];
	
	// envia a lista de demandas selecionadas para servidor
	$scope.recuperarKNN = function() {
		$http.post('/recuperar', $scope.caso.demandas)
				.success(function(data) {
					if(data.length > 0) {
						$scope.solucoes = data;
						$scope.caso.encaminhamentos = data[0].encaminhamentos;
						setTimeout(function(){
							$('.buttonset').buttonset('refresh');
				  	  		$('.has-tip').tooltipsy();
						}, 100);
					}
					else 
						alert('Servidor retornou ZERO resultados');
					$scope.passo = 3;
					$scope.tab=1;
				})
				.error(function(data) {
					alert('ERRO: ' + data);
				});
	}
	
	$scope.propor = function(proposta) {
		$scope.caso.encaminhamentos = proposta;
		setTimeout(function(){
			$('.buttonset').buttonset('refresh')
		}, 100);
	}
	
	$scope.cadastrarCaso = function() {
		$http.post('/reter', $scope.caso)
				.success(function(data) {
						alert(JSON.stringify(data));
					$scope.passo = 1;
					$scope.tab = 1;
					delete $scope.caso;
					$scope.caso = {};
					setTimeout(function(){
						location.href = '/rbc'
					}, 100);
				})
				.error(function(data) {
					alert('ERRO: ' + JSON.stringify(data));
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




