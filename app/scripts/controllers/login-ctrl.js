'use strict';

angular.module('angularAdminApp').
	controller('LoginCtrl', [ '$location', '$routeParams', '$scope', function( $location, $routeParams, $scope ) {

		if( localStorage.getItem('authenticated') !== null ) {
			$location.path( '' )
		}

		if( $.isEmptyObject( $routeParams ) === false ) {
			var key;

		    $scope.error = {};
			for( key in $routeParams ) {
				$scope.error[ key ] = $routeParams[ key ];
			}
		}
	} ]);
