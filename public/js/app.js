var RBC = angular.module('RBC');// RBC AngularJS App

RBC.controller('reusar', function($scope) {
	$scope.vizinhos = [];
	var data = <%- JSON.stringify(vizinhos) %>;
});