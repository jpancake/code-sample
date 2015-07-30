'use strict';

describe( 'Service: collectionService', function() {
	var $httpBackend, collectionService, scope, internalData, dataFromAPI;
	internalData = {"available_languages":{"en":true,"es":true,"fr":true},"background_color":"123456", "title": "foobie bletch", "sm":{"options":{"android":{"enabled":true},"ios":{"enabled":true}},"songList":{"us":[22741136]}},"tvp":{"options":{"android":{"enabled":true},"ios":{"enabled":true}},"songList":{"us":[22741136]}},"version":1};
	dataFromAPI = {"available_languages": ["en", "es", "fr"], "background_color": "123456", "title": "foobie bletch", "sm_android_enabled": true, "sm_config": {"us": [22741136]}, "sm_ios_enabled": true, "tvp_android_enabled": true, "tvp_config": {"us": [22741136]}, "tvp_ios_enabled": true, "version": 1};

	beforeEach(function() {
		module('angularAdminApp');
		inject( function ($controller, $injector, $rootScope) {
			scope = $rootScope.$new();
			$httpBackend = $injector.get( '$httpBackend' );
			collectionService = $injector.get( 'collectionService' );
			spyOn( collectionService, 'getCollections' ).andCallThrough();

		});
	});

	it('should make three methods available', function() {
		expect( collectionService.getCollections ).toBeDefined();
		expect( collectionService.newCollectionObj ).toBeDefined();
		expect( collectionService.save ).toBeDefined();
	});

	it('should not be possible to access the service\'s internal methods', function() {
		expect( collectionService.decode ).not.toBeDefined();
		expect( collectionService.encode ).not.toBeDefined();
		expect( collectionService.getcollection ).not.toBeDefined();
	});

	it('should return an empty collection object as a response to newCollectionObj()', function() {
		scope.collectionObj = collectionService.newCollectionObj();
		expect( scope.collectionObj ).toEqual({
			available_languages: {},
			background_color: '',
			title: '',
			version: '',
			sm: {
				songList: {
					us: []
				},
				options: {
					ios: { enabled: false },
					android: { enabled: false }
				}
			},
			tvp: {
				songList: {
					us: []
				},
				options: {
					ios: { enabled: false },
					android: { enabled: false }
				}
			}
		});
	});

	it('should request all collections if no collection is passed to getCollections, and a single collection if a collection is passed', function() {
		$httpBackend.expectGET( sm.apiRoutes.collections ).respond( [] );

		collectionService.getCollections();

		$httpBackend.flush();

		$httpBackend.expectGET( sm.apiRoutes.collections + '/bort' ).respond( [] );

		collectionService.getCollections( 'bort' );

		$httpBackend.flush();
	});

	it('should correctly turn an api response into the format that is expected by the controller/view', function() {
		$httpBackend.expectGET( sm.apiRoutes.collections + '/bort' ).respond( dataFromAPI );

		// http://stackoverflow.com/questions/15048132/angularjs-promise-not-being-resolved-in-unit-test
		collectionService.getCollections( 'bort' ).then( function( data ) {
			scope.response = data;
		});

		$httpBackend.flush();

		expect( scope.response ).toEqual( internalData );
	});

	it('should PUT on update, POST on create', function() {
		var postData = angular.copy( internalData );
		postData.id = 'bort';

		$httpBackend.expectPUT( sm.apiRoutes.collections + '/bort' ).respond();
		collectionService.save( postData, 'update' );
		$httpBackend.flush();

		$httpBackend.expectPOST( sm.apiRoutes.collections ).respond();
		collectionService.save( internalData, 'create' );
		$httpBackend.flush();
	});

	it('should correctly serialise internal collection data into a format acceptable to the api', function() {
		$httpBackend.expectPOST( sm.apiRoutes.collections, function( data ) {
			return angular.equals( JSON.parse(data), dataFromAPI );
		} ).respond();
		collectionService.save( internalData, 'create' );
		$httpBackend.flush();
	});
});
