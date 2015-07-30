'use strict';

describe( 'Service: promotionService', function() {
	var $httpBackend, promotionService, scope, internalData, dataFromAPI;

	internalData = {"available_languages":{"es":true,"fr":true,"en":true},
		"sm":{"available_regions":{},"options":{
			"android":{"bigEnabled":false,"enabled":false,"index":4,"maxVersion":null,"minVersion":"1.0.0"},
			"ios":{"bigEnabled":false,"enabled":false,"index":4,"maxVersion":null,"minVersion":"1.0.0"}}},
		"tvp":{"available_regions":{"fr":true},"options":{
			"android":{"bigEnabled":false,"enabled":false,"index":4,"maxVersion":null,"minVersion":"1.0.0"},
			"ios":{"bigEnabled":false,"enabled":false,"index":4,"maxVersion":null,"minVersion":"1.0.0"}}},
		"link":"cacheTest1", "title": "foobie bletch", "version":1};

	dataFromAPI = {"available_languages": ["es", "fr", "en"], "link": "cacheTest1", "title": "foobie bletch",
		"sm_android_big_enabled": false, "sm_android_enabled": false, "sm_android_index": 4, "sm_android_maximum_version": null,
		"sm_android_minimum_version": "1.0.0", "sm_available_regions": [],
		"sm_ios_big_enabled": false, "sm_ios_enabled": false, "sm_ios_index": 4,
		"sm_ios_maximum_version": null, "sm_ios_minimum_version": "1.0.0", "tvp_android_big_enabled": false,
		"tvp_android_enabled": false, "tvp_android_index": 4, "tvp_android_maximum_version": null,
		"tvp_android_minimum_version": "1.0.0", "tvp_available_regions": ["fr"], "tvp_ios_big_enabled": false, "tvp_ios_enabled": false,
		"tvp_ios_index": 4, "tvp_ios_maximum_version": null, "tvp_ios_minimum_version": "1.0.0", "version": 1};

	beforeEach(function() {
		module('angularAdminApp');
		inject( function ($controller, $injector, $rootScope) {
			scope = $rootScope.$new();
			$httpBackend = $injector.get( '$httpBackend' );
			promotionService = $injector.get( 'promotionService' );
			spyOn( promotionService, 'getPromotions' ).andCallThrough();

		});
	});

	it('should make three methods available', function() {
	    expect( promotionService.getPromotions ).toBeDefined();
	    expect( promotionService.newPromotionObj ).toBeDefined();
	    expect( promotionService.save ).toBeDefined();
	});

	it('should not be possible to access the service\'s internal methods', function() {
	    expect( promotionService.decode ).not.toBeDefined();
	    expect( promotionService.encode ).not.toBeDefined();
	    expect( promotionService.getPromotion ).not.toBeDefined();
	});

	it('should return an empty promotion object as a response to newPromotionObj()', function() {
		scope.promotionObj = promotionService.newPromotionObj();
		expect( scope.promotionObj ).toEqual({
			available_languages: {},
			link: '',
			title: '',
			sm: {
				available_regions: {},
				options: {
					ios: { index: null, bigEnabled: false, enabled: false, minVersion: '1.0.0', maxVersion: null },
					android: { index: null, bigEnabled: false, enabled: false, minVersion: '1.0.0', maxVersion: null }
				}
			},
			tvp: {
				available_regions: {},
				options: {
					ios: { index: null, bigEnabled: false, enabled: false, minVersion: '1.0.0', maxVersion: null },
					android: { index: null, bigEnabled: false, enabled: false, minVersion: '1.0.0', maxVersion: null }
				}
			}
		});
	});

	it('should request all promotions if no promotion is passed to getPromotions, and a single promotion if a promotion is passed', function() {
		$httpBackend.expectGET( sm.apiRoutes.promotions ).respond( [] );

		promotionService.getPromotions();

		$httpBackend.flush();

		$httpBackend.expectGET( sm.apiRoutes.promotions + '/bort' ).respond( [] );

		promotionService.getPromotions( 'bort' );

		$httpBackend.flush();
	});

	it('should correctly turn an api response into the format that is expected by the controller/view', function() {
		$httpBackend.expectGET( sm.apiRoutes.promotions + '/bort' ).respond( dataFromAPI );

		// http://stackoverflow.com/questions/15048132/angularjs-promise-not-being-resolved-in-unit-test
		promotionService.getPromotions( 'bort' ).then( function( data ) {
		    scope.response = data;
		});

		$httpBackend.flush();

		expect( scope.response ).toEqual( internalData );
	});

	it('should PUT on update, POST on create', function() {
		var postData = angular.copy( internalData );
		postData.id = 'bort';

		$httpBackend.expectPUT( sm.apiRoutes.promotions + '/bort' ).respond();
		promotionService.save( postData, 'update' );
		$httpBackend.flush();

		$httpBackend.expectPOST( sm.apiRoutes.promotions ).respond();
		promotionService.save( internalData, 'create' );
		$httpBackend.flush();
	});

	it('should correctly serialise internal promotion data into a format acceptable to the api', function() {
	   $httpBackend.expectPOST( sm.apiRoutes.promotions, function( data ) {
		    return angular.equals( JSON.parse(data), dataFromAPI );
		} ).respond();
		promotionService.save( internalData, 'create' );
		$httpBackend.flush();
	});
});
