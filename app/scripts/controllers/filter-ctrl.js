'use strict';

angular.module('angularAdminApp')
	.controller( 'FilterCtrl',[ 'filterService', '$routeParams', '$scope', 'songService', function( filterService, $routeParams, $scope, songService ) {
		$scope.songList = songService.getSongs();
		$scope.songModel = {};
		$scope.returnTitle = songService.getTitle;
		$scope.returnId = songService.getId;
		$scope.addSong = function( country, app ) {
		    songService.addSong( $scope, [ country, app ] );
		};
		$scope.removeSong = function( song, country, app, form ) {
			form.$setDirty();
			songService.removeSong( $scope, song, [ country, app ] );
		};

		if( $routeParams.filterId === undefined ) { // create a new filter
			$scope.mode = 'create';
			$scope.data = filterService.newFilterObj();
			$scope.data.filter_type = 'default'; // make 'default' the default
		} else { // edit an existing filter
			$scope.mode = 'update';
			$scope.data = filterService.getFilters( $routeParams.filterId )
				.then( function( data ) {
					$scope.data = data;
					$scope.data.id = $routeParams.filterId;
				})
		}

		$scope.remove = function( key, from, app ) {
			if( key !== 'en' ) { // all filters must have at least one, english, entry

				if( typeof(app) !== 'undefined' ) { // for removing regions
					delete $scope.data[ app ][ from ][ key ];
				} else { // for removing labels
					delete $scope.data[ from ][ key ];
				}

				$scope.$broadcast( 'remove', from, app ); // the drop-down directive listens for this event
			}
		};

		$scope.save = function( invalid, unchanged ) {
			if( invalid === false ) { // let html5 'required' work its magic
				if( $scope.mode === 'update' && unchanged ) { // the form hasn't been changed, display success without doing anything
					$scope.$emit( 'SAVE-SUCCESS' );
				} else {
					filterService.save( $scope.data, $scope.mode )
						.then( function( response ) { // success
							$scope.$emit( 'SAVE-SUCCESS' );

							if( $scope.mode === 'create' ) {
								$scope.data.id = response.id;
								$scope.mode = 'update';
							}
						}, function( data ) { // failure
							$scope.$emit( 'SAVE-FAILURE', data );
						});
				}
			}
		};
}]);
