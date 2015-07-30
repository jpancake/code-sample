'use strict';

describe( 'Service: filterService', function() {
	var $httpBackend, filterService, scope, internalData, dataFromAPI;
	internalData = {"labels":{"en":"pushToMe"},"sm":{"songList":{"us":[195755148]},"options":{"ios":{"enabled":true,"index":15,"minVersion":"1.0.0","maxVersion":null},"android":{"enabled":false,"index":15,"minVersion":"1.0.0","maxVersion":null}}},"tvp":{"songList":{"us":[195755148]},"options":{"ios":{"enabled":true,"index":15,"minVersion":"1.0.0","maxVersion":null},"android":{"enabled":false,"index":15,"minVersion":"1.0.0","maxVersion":null}}},"filter_type":"default"};
	dataFromAPI = {"filter_type": "default", "labels": {"title": {"en": "pushToMe"}}, "sm_android_enabled": false, "sm_android_index": 15, "sm_android_maximum_version": null, "sm_android_minimum_version": "1.0.0", "sm_config": {"us": [195755148]}, "sm_ios_enabled": true, "sm_ios_index": 15, "sm_ios_maximum_version": null, "sm_ios_minimum_version": "1.0.0", "tvp_android_enabled": false, "tvp_android_index": 15, "tvp_android_maximum_version": null, "tvp_android_minimum_version": "1.0.0", "tvp_config": {"us": [195755148]}, "tvp_ios_enabled": true, "tvp_ios_index": 15, "tvp_ios_maximum_version": null, "tvp_ios_minimum_version": "1.0.0"};

	beforeEach(function() {
		module('angularAdminApp');
		inject( function ($controller, $injector, $rootScope) {
			scope = $rootScope.$new();
			$httpBackend = $injector.get( '$httpBackend' );
			filterService = $injector.get( 'filterService' );
			spyOn( filterService, 'getFilters' ).andCallThrough();

		});
	});

	it('should make three methods available', function() {
		expect( filterService.getFilters ).toBeDefined();
		expect( filterService.newFilterObj ).toBeDefined();
		expect( filterService.save ).toBeDefined();
	});

	it('should not be possible to access the service\'s internal methods', function() {
		expect( filterService.decode ).not.toBeDefined();
		expect( filterService.encode ).not.toBeDefined();
		expect( filterService.getFilter ).not.toBeDefined();
	});

	it('should return an empty filter object as a response to newfilterObj()', function() {
		scope.filterObj = filterService.newFilterObj();
		expect( scope.filterObj ).toEqual({
			labels: { "en": "" },
			sm: {
				songList: { us: [] },
				options: {
					ios: { enabled: false, index: null, minVersion: '1.0.0', maxVersion: null },
					android: { enabled: false, index: null, minVersion: '1.0.0', maxVersion: null }
				}
			},
			tvp: {
				songList: { us: [] },
				options: {
					ios: { enabled: false, index: null, minVersion: '1.0.0', maxVersion: null },
					android: { enabled: false, index: null, minVersion: '1.0.0', maxVersion: null }
				}
			}
		});
	});

	it('should request all filters if no filter is passed to getFilters, and a single filter if a filter is passed', function() {
		$httpBackend.expectGET( sm.apiRoutes.filters ).respond();

		filterService.getFilters();

		$httpBackend.flush();

		$httpBackend.expectGET( sm.apiRoutes.filters + '/bort' ).respond();

		filterService.getFilters( 'bort' );

		$httpBackend.flush();
	});

	it('should correctly turn an api response into the format that is expected by the controller/view', function() {
		$httpBackend.expectGET( sm.apiRoutes.filters + '/bort' ).respond( dataFromAPI );

		// http://stackoverflow.com/questions/15048132/angularjs-promise-not-being-resolved-in-unit-test
		filterService.getFilters( 'bort' ).then( function( data ) {
			scope.response = data;
		});

		$httpBackend.flush();

		expect( scope.response ).toEqual( internalData );
	});

	it('should PUT on update, POST on create', function() {
		var postData = angular.copy( internalData );
		postData.id = 'bort';

		$httpBackend.expectPUT( sm.apiRoutes.filters + '/bort' ).respond();
		filterService.save( postData, 'update' );
		$httpBackend.flush();

		$httpBackend.expectPOST( sm.apiRoutes.filters ).respond();
		filterService.save( internalData, 'create' );
		$httpBackend.flush();
	});

	it('should correctly serialise internal filter data into a format acceptable to the api', function() {
		$httpBackend.expectPOST( sm.apiRoutes.filters, function( data ) {
			return angular.equals( JSON.parse(data), dataFromAPI );
		} ).respond();
		filterService.save( internalData, 'create' );
		$httpBackend.flush();
	});
});
