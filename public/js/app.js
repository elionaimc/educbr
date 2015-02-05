// RBC AngularJS App
var educase = angular.module('educase', []);

// Controlador principal da interface
educase.controller('recuperarController', function($scope, $http) {
	$scope.caso = {};
	$scope.caso.demandas = {};
	$scope.solucoes = [];
	
	// envia a lista de demandas selecionadas para servidor
	$scope.recuperarKNN = function() {
		var demandas = limparDados($scope.caso.demandas);
		$http.post('/recuperar', demandas)
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
	// seleciona os encaminhamentos que compõem as soluções propostas
	$scope.propor = function(proposta) {
		$scope.caso.encaminhamentos = proposta;
		setTimeout(function(){
			$('.buttonset').buttonset('refresh')
		}, 100);
	}
	// capta os dados preenchidos e envia ao servidor, para salvar as informações
	$scope.cadastrarCaso = function() {
		$scope.caso.demandas = limparDados($scope.caso.demandas);
		$scope.caso.encaminhamentos = limparDados($scope.caso.encaminhamentos);
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
			}
		);
	}
	// recebe um conjunto de dados e otimiza
	var limparDados = function(lista) {
		var dados = {};
		for(dado in lista){
			if(lista[dado] != 0 && lista[dado] != "0") dados[dado] = lista[dado];
		}
		
		return dados;
	}
});
