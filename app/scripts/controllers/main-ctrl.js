'use strict';

angular.module('angularAdminApp')
.controller('MainCtrl', ['authService', '$scope', function (authService, $scope) {
	$scope.loggedIn = authService.isLoggedIn();

	$scope.login = authService.login;

	$scope.regions = {
		mx: 'Mexico',
		fr: 'France',
		us: 'United States'
	};

	$scope.languages = {
		en: 'English',
		es: 'Spanish',
		fr: 'French'
	};

	$scope.appNames = {
		sm: 'StarMaker',
		tvp: 'The Voice'
	};

	/*
	 Event Listeners
	 */

	$scope.$on( '$routeChangeStart', authService.testLoginStatus );

	$scope.$on( 'LOGIN', function() {
		$scope.loggedIn = authService.isLoggedIn();
	});

	$scope.$on( 'LOGOUT', function( e, args ) {
		authService.logout( args );
	});
}]);
