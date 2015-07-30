'use strict';

angular.module('angularAdminApp')
	.controller( 'SubscriptionCtrl',[ 'subscriptionService', '$routeParams', '$scope', function( subscriptionService, $routeParams, $scope ) {
		$scope.platforms = ['android', 'ios'];

		if( $routeParams.subscriptionId === undefined ) { // create a new subscription
			$scope.mode = 'create';
			$scope.data = subscriptionService.newSubscriptionObj();
			$scope.data.platform_code = $scope.platforms[0];
			$scope.data.client_code = 'sm';
		} else { // edit an existing subscription
			$scope.mode = 'update';
			$scope.data = subscriptionService.getSubscriptions( $routeParams.subscriptionId )
				.then( function( data ) {
					$scope.data = data;
                    if( $scope.banners === null ) {
                        $scope.banners = [];
                    }
				})
		}

		$scope.inputHandler = function( e, target ) {
			if( e.keyCode === 13 ) {
				e.preventDefault();
				if( $scope.data[ target ].length < 3 ) {
					$scope.addTo( target );
				}
			}
		};

		$scope.addTo = function( targetArray ) {
            if( targetArray === 'banners' ){
                 $scope.data[ targetArray ].push( {title: '', sku: ''} );
            } else {
                $scope.data[ targetArray ].push( '' );
            }

		};

		$scope.removeFrom = function( targetArray, position, form ) {
            form.$setDirty();
		    $scope.data[ targetArray ].splice( position, 1 );
		};

		$scope.save = function( e, invalid, unchanged ) {
			if( e.keyCode !== 13 ) {
				if( invalid === false ) { // let html5 'required' work its magic
					if( $scope.mode === 'update' && unchanged ) { // the form hasn't been changed, display success without doing anything
						$scope.$emit( 'SAVE-SUCCESS' );
					} else {
						subscriptionService.save( $scope.data, $scope.mode ).then( // notify the directive that will display the request status
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
			}
		};
	}]);
