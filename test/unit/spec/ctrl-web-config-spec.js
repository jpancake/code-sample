'use strict';

describe( 'Controller: WebConfigCtrl', function() {
    var WebConfigCtrl, webConfigService, scope, songService;

    // Initialize the controller and a mock scope
	beforeEach( function() {
		module('angularAdminApp');
		inject( function ($controller, $injector, $rootScope) {
			scope = $rootScope.$new();

			songService = $injector.get( 'songService' );
			webConfigService = $injector.get( 'webConfigService' );

			spyOn( songService, 'addSong');
			spyOn( songService, 'getSongs' ).andReturn(
				[{"artist": "The Fray", "id": 7059, "title": "How To Save A Life"}, {"artist": "The Jackson 5", "id": 7062, "title": "I Want You Back"}, {"artist": "Willie Nelson", "id": 7067, "title": "On The Road Again (Full Version)"}]
			);
			spyOn( songService, 'removeSong' );
			spyOn( webConfigService, 'getWebConfig' ).andCallThrough();
			spyOn( webConfigService, 'save' ).andCallThrough();

			WebConfigCtrl = $controller('WebConfigCtrl', {
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
	});

	it( 'should call into songService.addSong from scope.addSong', function() {
		scope.addSong(scope);
	    expect( songService.addSong ).toHaveBeenCalled();
	});

	it( 'should call into songService.removeSong from scope.removeSong', function() {
		scope.removeSong(null, {$setDirty: function() {}});
		expect( songService.removeSong ).toHaveBeenCalled();
	});

    it( 'should do nothing when save is called with a form marked as invalid, and marked both valid & unchanged', function() {
		scope.save();
		scope.save( true );
		scope.save( true, true );

		expect( webConfigService.save ).not.toHaveBeenCalled();
	});
});