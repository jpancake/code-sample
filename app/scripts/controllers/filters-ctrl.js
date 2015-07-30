'use strict';

angular.module('angularAdminApp')
	.controller('FiltersCtrl', [ 'filterService', '$scope', function( filterService, $scope ) {
		$scope.filterList = filterService.getFilters() // returns a promise
			.then( function( data ) { // resolves the promise
			    $scope.filterList = data;
			} );
	}]);
