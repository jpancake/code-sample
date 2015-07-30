'use strict';

describe( 'Controller: PromotionsCtrl', function() {
	var Controller, $httpBackend, scope;

	beforeEach(function() {
		module('angularAdminApp');
		inject( function( _$httpBackend_, $controller, $rootScope ) {
			$httpBackend = _$httpBackend_;
			$httpBackend.expectGET( sm.apiRoutes.promotions )
				.respond( [{ id: 1 }, { id: 2 }, { id: 3 }] );
			scope = $rootScope.$new();
			Controller = $controller('PromotionsCtrl', {
				$scope: scope
			});
		});
	});

	it('should populate a promotionList array', function() {
		// should be a promise
		expect( typeof( scope.promotionList ) ).toBe( 'object' );
		// 'fetch' data
		$httpBackend.flush();
		// should be an array of objects
		expect( scope.promotionList[2].id ).toBe( 3 );
	});
});