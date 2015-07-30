'use strict';

angular.module('angularAdminApp')
	.controller( 'CollectionCtrl',[ 'collectionService', '$routeParams', '$scope', 'songService', function( collectionService, $routeParams, $scope, songService ) {
		$scope.songList = songService.getSongs();
		$scope.songModel = {};
		$scope.returnTitle = songService.getTitle;
		$scope.returnId = songService.getId;
		$scope.addSong = function( country, app ) {
			songService.addSong( $scope, [ country, app ] );
		};
		$scope.removeSong = function( song, country, app, form ) {
			form.$setDirty(); // will force the save method below to persist the new values
			songService.removeSong( $scope, song, [ country, app ] );
		};

		if( $routeParams.collectionId === undefined ) { // create a new collection
			$scope.mode = 'create';
			$scope.data = collectionService.newCollectionObj( $scope.languages );
		} else { // edit an existing collection
			$scope.mode = 'update';
			$scope.data = collectionService.getCollections( $routeParams.collectionId )
				.then( function( data ) {
					$scope.data = data;
					$scope.data.id = $routeParams.collectionId;
				});
		}

		$scope.save = function( invalid, unchanged ) {
			if( invalid === false ) { // let html5 'required' work its magic
				if( $scope.mode === 'update' && unchanged ) { // the form hasn't been changed, display success without doing anything
					$scope.$emit( 'SAVE-SUCCESS' );
				} else {
					collectionService.save( $scope.data, $scope.mode )
						.then( function( response ) { // success
							$scope.$emit( 'SAVE-SUCCESS' );

							if( $scope.mode === 'create' ) {
								$scope.data.id = response.id;
								$scope.mode = 'update';
							}
						}, function( data ) { // failure
							$scope.$emit( 'SAVE-FAILURE', data );
						})
					;
				}
			}
		}

	}]);
