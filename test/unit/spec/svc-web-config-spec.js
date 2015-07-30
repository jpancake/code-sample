'use strict';

describe( 'Service: webConfigService', function() {
	var $httpBackend, webConfigService, scope, internalData, dataFromAPI;

	internalData = {"ad_alt_description": "Our Internal ad: The Voice: On Stage", "ad_image_url": "http://s3.amazonaws.com/media.starmakerapp.com/web_images/web_ad_tile.jpg",
		"ad_redirect_url": "http://www.starmakerinteractivestudios.com", "songList": [7004366]};

	dataFromAPI = {"ad_alt_description": "Our Internal ad: The Voice: On Stage", "ad_image_url": "http://s3.amazonaws.com/media.starmakerapp.com/web_images/web_ad_tile.jpg",
		"ad_redirect_url": "http://www.starmakerinteractivestudios.com", "popular_songs": [7004366]};

	beforeEach(function() {
		module('angularAdminApp');
		inject( function ($controller, $injector, $rootScope) {
			scope = $rootScope.$new();
			$httpBackend = $injector.get( '$httpBackend' );
			webConfigService = $injector.get( 'webConfigService' );
			spyOn( webConfigService, 'getWebConfig' ).andCallThrough();
		});
	});

	it('should make two methods available', function() {
		expect( webConfigService.getWebConfig ).toBeDefined();
		expect( webConfigService.save ).toBeDefined();
	});

	it('should request all promotions if no promotion is passed to getWebConfig, and a single promotion if a promotion is passed', function() {
		$httpBackend.expectGET( sm.apiRoutes.webConfig ).respond( [] );

		webConfigService.getWebConfig();

		$httpBackend.flush();
	});

	it('should correctly turn an api response into the format that is expected by the controller/view', function() {
		$httpBackend.expectGET( sm.apiRoutes.webConfig ).respond( dataFromAPI );

		// http://stackoverflow.com/questions/15048132/angularjs-promise-not-being-resolved-in-unit-test
		webConfigService.getWebConfig().then( function( data ) {
			scope.response = data;
		});

		$httpBackend.flush();

		expect( scope.response ).toEqual( internalData );
	});

	it('should correctly serialise internal promotion data into a format acceptable to the api', function() {
		$httpBackend.expectPUT( sm.apiRoutes.webConfig, function( data ) {
			return angular.equals( JSON.parse(data), dataFromAPI );
		} ).respond();
		webConfigService.save( internalData );
		$httpBackend.flush();
	});
});
