'use strict';

describe('Controller: LoginCtrl', function() {
	var LoginCtrl, scope;

	beforeEach( function() {
	    module('angularAdminApp');
	});

	afterEach(function() {
	    localStorage.clear();
	});

	it('should not have an error object if there are no queryString params', function() {
		inject( function( $controller, $rootScope ) {
			scope = $rootScope.$new();
			LoginCtrl = $controller('LoginCtrl', {
				$scope: scope
			});
		});
	    expect( scope.error ).toBeUndefined();
	});

	it('should have an error object if there are queryString params', function() {
		inject( function( $controller, $rootScope ) {
			scope = $rootScope.$new();
			LoginCtrl = $controller('LoginCtrl', {
				$routeParams: { badLogin: '' },
				$scope: scope
			});
		});
		expect( scope.error.badLogin ).toBeDefined();
	});

	/*
		The redirect test is in test/e2e/spec/redirect-spec.js. The redirect has no side effects in the controller,
		so it's difficult (as in, I couldn't find a way to do it) to do.
	 */
});