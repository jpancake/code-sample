'use strict';

describe( 'Controller: CollectionsCtrl', function() {
	var Controller, $httpBackend, scope;

	beforeEach(function() {
		module('angularAdminApp');
		inject( function( _$httpBackend_, $controller, $rootScope ) {
			$httpBackend = _$httpBackend_;
			$httpBackend.expectGET( sm.apiRoutes.collections )
				.respond( [{ id: 1 }, { id: 2 }, { id: 3 }] );
			scope = $rootScope.$new();
			Controller = $controller('CollectionsCtrl', {
				$scope: scope
			});
		});
	});

	it('should populate a collectionList array', function() {
		// should be a promise
	    expect( typeof( scope.collectionList ) ).toBe( 'object' );
		// 'fetch' data
		$httpBackend.flush();
		// should be an array of objects
		expect( scope.collectionList[2].id ).toBe( 3 );
	});
});