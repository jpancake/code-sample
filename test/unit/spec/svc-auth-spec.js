'use strict';

describe('Service: songService', function() {
	var $httpBackend, $location, authService, scope;

	beforeEach(function() {
	    module('angularAdminApp');

		inject(function( $injector, $rootScope ) {
		    scope = $rootScope.$new();
			authService = $injector.get('authService');
			authService.getOriginalPath = function() {
				return _originalPath;
			};

			$httpBackend = $injector.get('$httpBackend');
			$location = $injector.get('$location');
		});

		localStorage.clear();
	});

	it('should make four methods available', function() {
		expect( authService.testLoginStatus ).toBeDefined();
		expect( authService.isLoggedIn ).toBeDefined();
		expect( authService.login ).toBeDefined();
		expect( authService.logout ).toBeDefined();
	});

	it('should correctly identify an unauthorised user', function() {
		expect( authService.isLoggedIn() ).toBe( false );
	});

	it('should redirect to /login?badLogin on unsuccessful login', function() {
 		$httpBackend.expectPOST( sm.apiRoutes.login ).respond( 401 );
		authService.login( {} );
		$httpBackend.flush();
		expect( $location.search().badLogin ).toBe( true );
		expect( $location.path() ).toBe( '/login' );
	});

	it('should mark a user as logged in after a successful call to login ', function() {
		var rootScope;
		inject(function($injector) {
			rootScope = $injector.get('$rootScope');

			spyOn( rootScope, '$broadcast' ).andCallThrough();
		});

		$location.search( 'badLogin' );

	    $httpBackend.expectPOST( sm.apiRoutes.login ).respond( 200 );
		authService.login( {} );
		$httpBackend.flush();

		expect( rootScope.$broadcast ).toHaveBeenCalledWith( 'LOGIN' );
		expect( localStorage.getItem( 'authenticated' ) ).toBeTruthy();
		expect( $.isEmptyObject( $location.search() )).toBe( true );
		expect( authService.isLoggedIn() ).toBe( true );
	});

	it('should mark a user who has not been explicitly logged out as loggedIn', function() {
		expect( authService.isLoggedIn() ).toBe( false );
		localStorage.setItem( 'authenticated', 'true' );
		authService.testLoginStatus();
		expect( authService.isLoggedIn() ).toBe( true );
	});

	it('should take a user who tried to request a restricted access page back to that page after successfully logging in', function() {
		$location.path( '/bort' );
		authService.testLoginStatus(); // should stick /bort in _originalPath
		expect( $location.path() ).toBe( '/login' );
		expect( $location.search().requiresLogin ).toBeDefined();
		$httpBackend.expectPOST( sm.apiRoutes.login ).respond( 200 );
		authService.login( {} );
		$httpBackend.flush();
		expect( authService.isLoggedIn() ).toBe( true );
		expect( $location.path() ).toBe( '/bort' );
		expect( $.isEmptyObject( $location.search() ) ).toBe( true );
	});

	it('should take a user to the homepage after logging in sucessfully from the login page', function() {
	    $location.path( '/login' );
		authService.testLoginStatus();
		$httpBackend.expectPOST( sm.apiRoutes.login ).respond( 200 );
		authService.login( {} );
		$httpBackend.flush();
		expect( $location.path() ).toBe( '/' );
		expect( $.isEmptyObject( $location.search() ) ).toBe( true );
	});

	it('logout() mark a user as logged out & redirect the login page with an attached querystring', function() {
		$httpBackend.expectPOST( sm.apiRoutes.login ).respond( 200 );
		authService.login( {} );
		$httpBackend.flush();
		expect( authService.isLoggedIn() ).toBe( true );

		authService.logout( 'bort' );
		expect( localStorage.getItem( 'authenticated' ) ).toBe( null );
		expect( authService.isLoggedIn() ).toBe( false );
		expect( $location.path() ).toBe( '/login' );
		expect( $location.search().bort ).toBeDefined();
	});
});
