'use strict';

describe('Controller: MainCtrl', function () {
	var authService, MainCtrl, scope;

	// Initialize the controller and a mock scope
	beforeEach( function() {
		module('angularAdminApp');
		inject( function ($controller, $injector, $rootScope) {
			scope = $rootScope.$new();
			spyOn( scope, '$on' ).andCallThrough();

			// load the auth service, example here: https://docs-angularjs-org-dev.appspot.com/guide/dev_guide.services.testing_services
			authService = $injector.get( 'authService' );
			spyOn( authService, 'isLoggedIn' ).andReturn( true );
			spyOn( authService, 'login' );
			spyOn( authService, 'logout' );
			spyOn( authService, 'testLoginStatus' );

			MainCtrl = $controller('MainCtrl', {
				$scope: scope
			});
		});
	});

	it('should have a true/false value assigned to the login field', function() {
	    expect( typeof( scope.loggedIn ) ).toBe( 'boolean' );
	});

	it('should alias the authService.login method', function() {
		scope.login();
		expect( authService.login ).toHaveBeenCalled();
	});

	it('should define three regions', function () {
		expect( scope.regions.fr ).toBeDefined();
		expect( scope.regions.mx ).toBeDefined();
		expect( scope.regions.us ).toBeDefined();
	});

	it('should define three languages', function() {
		expect( scope.languages.en ).toBeDefined();
		expect( scope.languages.es ).toBeDefined();
		expect( scope.languages.fr ).toBeDefined();
	});

	it('should define two apps', function() {
	    expect( scope.appNames.sm ).toBeDefined();
	    expect( scope.appNames.tvp ).toBeDefined();
	});

	it('should call authService.testLoginStatus on route change', function() {
		scope.$emit( '$routeChangeStart' );
		expect( scope.$on ).toHaveBeenCalled();
		expect( authService.testLoginStatus ).toHaveBeenCalled();
	});

	it('should call authService.isLoggedIn on login', function() {
		scope.$emit( 'LOGIN' );
		expect( authService.isLoggedIn ).toHaveBeenCalled();
	});

	it('should set loggedIn to true on successful login', function() {
		scope.$emit( 'LOGIN' );
		expect( scope.loggedIn ).toBe( true );
	});

	it('should call authService.logout on logout', function() {
	    scope.$emit( 'LOGOUT' );
		expect( authService.logout ).toHaveBeenCalled();
	});
});
