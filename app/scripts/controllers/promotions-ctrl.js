'use strict';

angular.module('angularAdminApp')
	.controller( 'PromotionsCtrl',[ 'promotionService', '$scope', function( promotionService, $scope ) {
		$scope.promotionList = promotionService.getPromotions() // returns a promise
			.then( function( data ) { // resolves the promise
				$scope.promotionList = data;
			} );
	}]);
