'use strict';

describe( 'Controller: PromotionCtrl', function() {
	var PromotionCtrl, promotionService, scope;

	// Initialize the controller and a mock scope
	beforeEach( function() {
		module('angularAdminApp');
		inject( function ($controller, $injector, $rootScope) {
			scope = $rootScope.$new();

			promotionService = $injector.get( 'promotionService' );

			spyOn( promotionService, 'newPromotionObj' ).andCallThrough();
			spyOn( promotionService, 'getPromotions' ).andCallThrough();
			spyOn( promotionService, 'save' ).andCallThrough();

			PromotionCtrl = $controller('PromotionCtrl', {
				$scope: scope
			});
		});
	});

	it( 'should set mode to "create" and have data set to an empty promotion object when no promotionId is in routeParams, ', function() {
		expect( scope.mode ).toBe( 'create' );
		expect( promotionService.newPromotionObj ).toHaveBeenCalled();
	});

	it( 'should set mode to "update" and have a specific promotion object assigned to data when a promotionId is in routeParams', function($httpBackend) {
		inject(function($controller, _$httpBackend_) {
			$httpBackend = _$httpBackend_;
			PromotionCtrl = $controller('PromotionCtrl', {
				$routeParams: {promotionId: 123},
				$scope: scope
			});
		});

		$httpBackend.expectGET( sm.apiRoutes.promotions + '/123' ).respond(
			{"available_languages": ["es", "fr", "en"], "id": 5319959362142208, "link": "cacheTest1", "sm_android_big_enabled": false, "sm_android_enabled": false, "sm_android_index": 4, "sm_android_maximum_version": null, "sm_android_minimum_version": "1.0.0", "sm_available_regions": [], "sm_ios_big_enabled": false, "sm_ios_enabled": false, "sm_ios_index": 4, "sm_ios_maximum_version": null, "sm_ios_minimum_version": "1.0.0", "tvp_android_big_enabled": false, "tvp_android_enabled": false, "tvp_android_index": 4, "tvp_android_maximum_version": null, "tvp_android_minimum_version": "1.0.0", "tvp_available_regions": [], "tvp_ios_big_enabled": false, "tvp_ios_enabled": false, "tvp_ios_index": 4, "tvp_ios_maximum_version": null, "tvp_ios_minimum_version": "1.0.0", "version": 1}
		);
		$httpBackend.flush();
		expect( scope.mode ).toBe( 'update' );
		expect( scope.data.id ).toBe( 123 );
		expect( scope.data.sm.options.ios.index ).toBe( 4 ); // the internal structure differs from what is returned by the api
	});

	it( 'should do nothing when save is called with a form marked as invalid', function() {
		// we haven't specified a promotionId, so scope mode is 'create'
		scope.save();
		expect( scope.mode ).toBe( 'create' );

		scope.save( true );
		expect( scope.mode ).toBe( 'create' );

		expect( promotionService.save ).not.toHaveBeenCalled();
	});

	it( 'should do nothing when save is called with a form marked both valid & unchanged', function() {
		scope.save( true, true );

		expect( scope.mode ).toBe( 'create' );
		expect( promotionService.save ).not.toHaveBeenCalled();
	});

	it( 'should switch modes & have an id after a successful creation', function($httpBackend) {
		inject(function(_$httpBackend_) {
			$httpBackend = _$httpBackend_;
		});

		$httpBackend.expectPOST( sm.apiRoutes.promotions ).respond( { id: 123 } );

		scope.save( false, false );

		$httpBackend.flush();

		expect( scope.data.id ).toBe( 123 );
		expect( scope.mode ).toBe( 'update' );
	});
});
