'use strict';

angular.module('smServices')
	.factory( 'songService', [ '$http', '$q', function( $http, $q ) {
		var songsById, songsByTitle, songObj = {arr: []};

		function generateObject( key, val ) {
			var i = 0;
			var returnObj = {};

			for ( i; i < songObj.arr.length; i++ ) {
				returnObj[ songObj.arr[i][key] ] = songObj.arr[i][val];
			}

			return returnObj;
		}

		function getSongList() {
			var i, deferred = $q.defer();

			$http.get( sm.apiRoutes.getAllSongs )
				.success( function( data ) {
					for( i = 0; i < data.length; i++ ) { // make the title a composite of title and artist
						data[i].title = data[i].artist + ' - ' + data[i].title;
					}
					
					deferred.resolve( data );
				})
				.error( function() {
					deferred.reject();
				});

			return deferred.promise;
		}

		function addSongToScope( scope, options ) {
            var songList, model, country;
            // for implementers that have multiple songLists, songModel is an object with
            // one key, country, that holds the current song. otherwise, it is a string
            if( options !== undefined ) {
                // 0 is country, 1 is app
                country = options[ 0 ];
                songList = scope.data[ options[ 1 ] ].songList[ country ];
                model = scope.songModel[ country ];
            } else {
                songList = scope.data.songList;
                model = scope.songModel;
            }

			if( $.inArray( scope.returnId( model ), songList ) === -1 ) {

                if( options !== undefined ) {
					songList.push( scope.returnId( model ) );
                    scope.songModel[ country ] = '';
                } else {
					scope.data.songList.push( scope.returnId( model ) );
                    scope.songModel = '';
                }
			}
		}

		function removeSongFromScope( scope, song, options ) {
            //options[0] = country, options[1] = app
			var idx = options === undefined? $.inArray( song, scope.data.songList ) : $.inArray( song, scope.data[ options[1] ].songList[ options[0] ] );

			if( idx > -1 ) {
                if( options === undefined ) {
                    scope.data.songList.splice( idx, 1 );
                } else {
                    scope.data[ options[1] ].songList[ options[0] ].splice( idx, 1 );
                }
			}
		}
		
		return {
			addSong: addSongToScope,
			removeSong: removeSongFromScope,
			getId: function( title ) {
				if( songsByTitle === undefined ) {
					songsByTitle = generateObject( 'title', 'id' );
				}

				return songsByTitle[ title ];
			},
			getSongs: function() {
				if( songObj.arr.length === 0 ) {
					var promise = getSongList();

					promise.then(
						function( data ) { // success callback
							songObj.arr = data;
						},
						function() { // error callback

						}
					);
				}

				return songObj;
			},
			getTitle: function( id ) {
				if( songObj.arr.length > 0 ) {
					if( songsById === undefined ) {
						songsById = generateObject( 'id', 'title' );
					}

					return songsById[ id ];
				} else {
					return '';
				}
			}
		}
	}] );
