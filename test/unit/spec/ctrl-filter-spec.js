'use strict';

describe( 'Controller: FilterCtrl', function() {
    var FilterCtrl, filterService, scope, songService;

	beforeEach(function() {
	    module('angularAdminApp');
		inject(function( $controller, $injector, $rootScope ) {
		    scope = $rootScope.$new();

			songService = $injector.get( 'songService' );
			filterService = $injector.get( 'filterService' );

			spyOn( songService, 'addSong' );
			spyOn( songService, 'getSongs' ).andReturn(
				[{"artist": "The Fray", "id": 7059, "title": "How To Save A Life"}, {"artist": "The Jackson 5", "id": 7062, "title": "I Want You Back"}, {"artist": "Willie Nelson", "id": 7067, "title": "On The Road Again (Full Version)"}]
			);
			spyOn( songService, 'removeSong' );

			spyOn( filterService, 'newFilterObj' ).andReturn( {} );
			spyOn( filterService, 'save' ).andCallThrough();

			FilterCtrl = $controller('FilterCtrl', {
				$scope: scope
			});

			scope.data.sm = {};
			scope.data.sm.songList = {};
			scope.data.tvp = {};
			scope.data.tvp.songList = {};
			scope.data.labels = {};
		})
	});

	it('should populate songList with an array of songs', function() {
		expect( songService.getSongs ).toHaveBeenCalled();
		expect( scope.songList[2].artist ).toBe( 'Willie Nelson' );
	});

	it('should alias songSvc\'s getTitle and getId methods as returnTitle and returnId', function() {
		expect( typeof( scope.returnTitle )).toBe( 'function' );
		expect( typeof( scope.returnTitle )).toBe( 'function' );
	});

	it( 'should call into songService.addSong from scope.addSong', function() {
		scope.addSong(null, null, null);
		expect( songService.addSong ).toHaveBeenCalled();
	});

	it( 'should call into songService.removeSong from scope.removeSong', function() {
		scope.removeSong(null, null, null, {$setDirty: function() {}});
		expect( songService.removeSong ).toHaveBeenCalled();
	});

	it( 'should set mode to "create" and call into filterService for an empty filter object when no filterId is in routeParams', function() {
		expect( scope.mode ).toBe( 'create' );
		expect( filterService.newFilterObj ).toHaveBeenCalled();
		expect( scope.data.filter_type ).toBe( 'default' );
	});

	it( 'should set mode to "update" and have a specific filter object assigned to data when a filterId is in routeParams', function($httpBackend) {
		inject(function($controller, _$httpBackend_) {
			$httpBackend = _$httpBackend_;
			FilterCtrl = $controller('FilterCtrl', {
				$routeParams: {filterId: 123},
				$scope: scope
			});
		});

		$httpBackend.expectGET( sm.apiRoutes.filters + '/123' ).respond(
			{"filter_type": "default", "id": 5774573060489216, "labels": {"title": {"en": "Boys Just Wanna Have Fun"}}, "sm_android_enabled": true, "sm_android_index": 8, "sm_android_maximum_version": null, "sm_android_minimum_version": "1.0.0", "sm_config": {"us": [85226978, 31614739, 68202453, 13192707, 9242, 10692, 14119, 14120, 7453892, 7472873, 16562363, 12463073, 12051618, 12466658, 7630441]}, "sm_ios_enabled": true, "sm_ios_index": 8, "sm_ios_maximum_version": null, "sm_ios_minimum_version": "2.9.3", "tvp_android_enabled": false, "tvp_android_index": 8, "tvp_android_maximum_version": null, "tvp_android_minimum_version": "1.0.0", "tvp_config": {"us": []}, "tvp_ios_enabled": false, "tvp_ios_index": 8, "tvp_ios_maximum_version": null, "tvp_ios_minimum_version": "2.9.0"}
		);
		$httpBackend.flush();
		expect( scope.mode ).toBe( 'update' );
		expect( scope.data.id ).toBe( 123 );
		expect( scope.data.sm.songList.us ).toBeDefined(); // the internal structure differs from what comes from the api
	});

	it("shouldn't be let you remove entries with an 'en' key", function() {
		scope.data.labels.en = 'foobiebletch';
		scope.remove( 'en', 'labels' );
		expect( scope.data.labels.en ).toBe( 'foobiebletch' );

		scope.data.sm.songList.us = [123];
		scope.remove( 'en', 'songList', 'sm' );
		expect( scope.data.sm.songList.us ).toBeDefined();
	});

	it("should remove non-US/English entries", function() {
		scope.data.labels.fr = 'stankyouverymuch';
		scope.remove( 'fr', 'labels' );
		expect( scope.data.labels.fr ).not.toBeDefined();

		scope.data.sm.songList.fr = [123];
		scope.remove( 'fr', 'songList', 'sm' );
		expect( scope.data.sm.songList.fr ).not.toBeDefined();
	});

	it( 'should do nothing when save is called with a form marked as invalid', function() {
		// we haven't specified a filterId, so scope mode is 'create'
		scope.save();
		expect( scope.mode ).toBe( 'create' );

		scope.save( true );
		expect( scope.mode ).toBe( 'create' );

		expect( filterService.save ).not.toHaveBeenCalled();
	});

	it( 'should do nothing when save is called with a form marked both valid & unchanged', function() {
		scope.save( true, true );

		expect( scope.mode ).toBe( 'create' );
		expect( filterService.save ).not.toHaveBeenCalled();
	});

	it( 'should switch modes & have an id after a successful creation', function($httpBackend) {
		inject(function(_$httpBackend_) {
			$httpBackend = _$httpBackend_;
		});

		$httpBackend.expectPOST( sm.apiRoutes.filters ).respond( { id: 123 } );

		scope.save( false, false );

		$httpBackend.flush();

		expect( scope.data.id ).toBe( 123 );
		expect( scope.mode ).toBe( 'update' );
	});
});