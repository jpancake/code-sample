'use strict';

angular.module('angularAdminApp')
	.controller( 'CollectionsCtrl',[ 'collectionService', '$scope', function( collectionService, $scope ) {
		$scope.collectionList = collectionService.getCollections() // returns a promise
			.then( function( data ) { // resolves the promise
				$scope.collectionList = data;
			} );
	}]);
