'use strict';

describe( 'Controller: FiltersCtrl', function() {
	var Controller, $httpBackend, scope;

	beforeEach(function() {
		module('angularAdminApp');
		inject( function( _$httpBackend_, $controller, $rootScope ) {
			$httpBackend = _$httpBackend_;
			$httpBackend.expectGET( sm.apiRoutes.filters )
				.respond( [{ id: 1 }, { id: 2 }, { id: 3 }] );
			scope = $rootScope.$new();
			Controller = $controller('FiltersCtrl', {
				$scope: scope
			});
		});
	});

	it('should populate a filterList array', function() {
		// should be a promise
		expect( typeof( scope.filterList ) ).toBe( 'object' );
		// 'fetch' data
		$httpBackend.flush();
		// should be an array of objects
		expect( scope.filterList[2].id ).toBe( 3 );
	});
});