'use strict';

describe('Service: interceptorService', function() {
    var $http, $httpBackend, interceptorService, rootScope, scope;

	beforeEach(function() {
		module('angularAdminApp');

		inject(function( $injector, $rootScope ) {
		    scope = $rootScope.$new();
			$http = $injector.get( '$http' );
			$httpBackend = $injector.get( '$httpBackend' );
			rootScope = $injector.get( '$rootScope' );
			interceptorService = $injector.get( 'httpResponseInterceptor' );
			spyOn( rootScope, '$broadcast' ).andCallThrough();
		});
	});

	it('should increment & decrement requestCount when requests are made/returned', function() {
		expect( scope.requestCount ).toBe( 0 );

		$httpBackend.expectGET( '/bort' ).respond( function(  ) {
			// this method is first to be resolved, so, there should be two requests queued up when .flush() is called
			expect( scope.requestCount ).toEqual( 2 );
			return '';
		} );
		$http.get( '/bort' );
		$httpBackend.expectGET( '/bort' ).respond('');
		$http.get( '/bort' );

		$httpBackend.flush();

		expect( scope.requestCount ).toBe( 0 );
	});

	it('should broadcast "LOGOUT" when a request is returned with 401', function() {
		$httpBackend.expectGET( '/bort' ).respond( 401 );
		$http.get( '/bort' );
		$httpBackend.flush();

		expect( rootScope.$broadcast ).toHaveBeenCalledWith( 'LOGOUT', 'sessionTimeout' );
	});
});