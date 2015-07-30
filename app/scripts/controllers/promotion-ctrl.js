'use strict';

angular.module('angularAdminApp')
	.controller( 'PromotionCtrl',[ 'promotionService', '$routeParams', '$scope', function( promotionService, $routeParams, $scope ) {
		if( $routeParams.promotionId === undefined ) { // create a new filter
			$scope.mode = 'create';
			$scope.data = promotionService.newPromotionObj();
		} else { // edit an existing filter
			$scope.mode = 'update';
			$scope.data = promotionService.getPromotions( $routeParams.promotionId )
				.then( function( data ) {
					$scope.data = data;
					$scope.data.id = $routeParams.promotionId;
				})
		}

		$scope.save = function( invalid, unchanged ) {
			if( invalid === false ) { // let html5 'required' work its magic
				if( $scope.mode === 'update' && unchanged ) { // the form hasn't been changed, display success without doing anything
					$scope.$emit( 'SAVE-SUCCESS' );
				} else {
					promotionService.save( $scope.data, $scope.mode ).then( // notify the directive that will display the request status
							function( response ) { // success
								$scope.$emit( 'SAVE-SUCCESS' );

								if( $scope.mode === 'create' ) {
									$scope.data.id = response.id;
									$scope.mode = 'update';
								}
							},function( data ) { // failure
								$scope.$emit( 'SAVE-FAILURE', data );
							}
						);
				}
			}
		};
	}]);
