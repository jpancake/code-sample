'use strict';

describe( 'Controller: CollectionCtrl', function() {
	var CollectionCtrl, collectionService, scope, songService;

	// Initialize the controller and a mock scope
	beforeEach( function() {
		module('angularAdminApp');
		inject( function ($controller, $injector, $rootScope) {
			scope = $rootScope.$new();

			songService = $injector.get( 'songService' );
			collectionService = $injector.get( 'collectionService' );

			spyOn( songService, 'addSong' );
			spyOn( songService, 'getSongs' ).andReturn(
				[{"artist": "The Fray", "id": 7059, "title": "How To Save A Life"}, {"artist": "The Jackson 5", "id": 7062, "title": "I Want You Back"}, {"artist": "Willie Nelson", "id": 7067, "title": "On The Road Again (Full Version)"}]
			);
			spyOn( songService, 'removeSong' );
			spyOn( collectionService, 'newCollectionObj' ).andCallThrough();
			spyOn( collectionService, 'getCollections' ).andCallThrough();
			spyOn( collectionService, 'save' ).andCallThrough();

			CollectionCtrl = $controller('CollectionCtrl', {
				$scope: scope
			});
		});
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

	it( 'should set mode to "create" and have data set to an empty collection object when no collectionId is in routeParams, ', function() {
	    expect( scope.mode ).toBe( 'create' );
		expect( collectionService.newCollectionObj ).toHaveBeenCalled();
	});

	it( 'should set mode to "update" and have a specific collection object assigned to data when a collectionId is in routeParams', function($httpBackend) {
		inject(function($controller, _$httpBackend_) {
			$httpBackend = _$httpBackend_;
			CollectionCtrl = $controller('CollectionCtrl', {
				$routeParams: {collectionId: 123},
				$scope: scope
			});
		});

		$httpBackend.expectGET( sm.apiRoutes.collections + '/123' ).respond(
			{"available_languages": [], "background_color": "123456", "sm_android_enabled": false, "sm_config": {"us": []}, "sm_ios_enabled": false, "tvp_android_enabled": false, "tvp_config": {"us": []}, "tvp_ios_enabled": false, "version": 1}
		);
		$httpBackend.flush();
		expect( scope.mode ).toBe( 'update' );
		expect( scope.data.id ).toBe( 123 );
		expect( scope.data.sm.songList.us ).toBeDefined(); // the internal structure differs from what comes from the api
	});

	it( 'should do nothing when save is called with a form marked as invalid', function() {
		// we haven't specified a collectionId, so scope mode is 'create'
		scope.save();
		expect( scope.mode ).toBe( 'create' );

		scope.save( true );
		expect( scope.mode ).toBe( 'create' );

		expect( collectionService.save ).not.toHaveBeenCalled();
	});

	it( 'should do nothing when save is called with a form marked both valid & unchanged', function() {
	    scope.save( true, true );

		expect( scope.mode ).toBe( 'create' );
		expect( collectionService.save ).not.toHaveBeenCalled();
	});

	it( 'should switch modes & have an id after a successful creation', function($httpBackend) {
		inject(function(_$httpBackend_) {
		    $httpBackend = _$httpBackend_;
		});

		$httpBackend.expectPOST( sm.apiRoutes.collections ).respond( { id: 123 } );

		scope.save( false, false );

		$httpBackend.flush();

		expect( scope.data.id ).toBe( 123 );
		expect( scope.mode ).toBe( 'update' );
	});
});