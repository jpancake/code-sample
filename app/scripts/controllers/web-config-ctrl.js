'use strict';

angular.module( 'angularAdminApp' )
        .controller( 'WebConfigCtrl', [ 'songService', 'webConfigService', '$scope', function( songService, webConfigService, $scope ) {
            $scope.songList = songService.getSongs();
            $scope.songModel = '';
            $scope.returnTitle = songService.getTitle;
            $scope.returnId = songService.getId;

            $scope.webConfig = webConfigService.getWebConfig() // returns a promise
			.then( function( data ) { // resolves the promise
				$scope.data = data;
			} );

            $scope.addSong = function() {
                songService.addSong( $scope );
            };

            $scope.removeSong = function( song, form ) {
                form.$setDirty();
                songService.removeSong( $scope, song );
            };

            $scope.save = function( invalid, unchanged ) {
                if( invalid === false ) { // let html5 'required' work its magic
                    if( unchanged ) { // the form hasn't been changed, display success without doing anything
                        $scope.$emit( 'SAVE-SUCCESS' );
                    } else {
                        webConfigService.save( $scope.data )
                            .then( function( response ) { // success
                                $scope.$emit( 'SAVE-SUCCESS' );
                            }, function( data ) { // failure
                                $scope.$emit( 'SAVE-FAILURE', data );
                            });
                    }
                }
            }
        }]);