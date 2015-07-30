'use strict';

angular.module( 'smServices' )
	.factory( 'collectionService', [ '$http', '$q', function( $http, $q ) {
		var _apps = { 'sm': true, 'tvp': true };

		function getCollection( collectionId ) {
			var route, deferred = $q.defer();

			route = typeof( collectionId ) === 'undefined' ? sm.apiRoutes.collections : sm.apiRoutes.collections + '/' + collectionId;

			$http.get( route )
				.success( function( data ) {
					if( typeof( collectionId ) === 'undefined' ) {
						deferred.resolve( data );
					} else {
						deferred.resolve( decode( data ) );
					}
				})
				.error( function() {
					deferred.reject();
				});

			return deferred.promise;
		}

		function decode( serverCollectionObj ) {
			var key, opts, returnObj = {
				available_languages: {},
				background_color: '',
				title: '',
				sm: { options: { android: {}, ios: {}}},
				tvp: { options: { android: {}, ios: {}}}
			};

			for( key in serverCollectionObj ) {
				if( key === 'available_languages' ) {
					for( opts = 0; opts < serverCollectionObj.available_languages.length; opts++ ) {
						returnObj.available_languages[ serverCollectionObj.available_languages[opts]] = true;
					}
				} else if( key === 'background_color' || key === 'version' || key === 'title' ) {
					returnObj[ key ] = serverCollectionObj[ key ];
				} else if( key === 'id' ) {
					//
				} else {
					opts = key.split('_'); // 0 = app, 1 = os, 2 = option
					if( opts[1] === 'config' ) {
						returnObj[ opts[0] ].songList = angular.copy( serverCollectionObj[ key ] );
					} else {
						returnObj[ opts[0] ].options[ opts[ 1 ]][ opts[2] ] = angular.copy( serverCollectionObj[ key ] );
					}
				}
			}

			return returnObj;
		}

		function encode( frontendCollectionObj ) {
			var key, os, field, returnObj = {
				background_color: frontendCollectionObj.background_color,
				title: frontendCollectionObj.title,
				version: parseInt( frontendCollectionObj.version ),
				available_languages: []
			};

			for( key in frontendCollectionObj.available_languages ) {
				if( frontendCollectionObj.available_languages[key] === true ) {
				    returnObj.available_languages.push( key );
				}
			}

			for( key in _apps ) {
				returnObj[ key + '_config' ] = frontendCollectionObj[ key ].songList;

				for ( os in frontendCollectionObj[ key ].options ) {
					for( field in frontendCollectionObj[ key ].options[ os ] ) {
						returnObj[ key + '_' + os + '_' + field ] = frontendCollectionObj[ key ].options[ os ][ field ];
					}
				}
			}

			return returnObj;
		}

		return {
			getCollections: getCollection,
			newCollectionObj: function( languages ) {
				var  language, returnObj = {
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
				};

				for( language in languages ) {
					returnObj.available_languages[ language ] = false;
				}

				return returnObj;
			},
			save: function( data, mode ) {
				var deferred, url, postData = encode(data); // not strictly necessary, but there are so many other 'data's below...
				mode = mode === 'create' ? 'POST' : 'PUT';
				url = mode === 'PUT' ? sm.apiRoutes.collections + '/' + data.id : sm.apiRoutes.collections;
				deferred = $q.defer();

				$http( {
					data: postData,
					method: mode,
					url: url
				} ).success( function( data ) {
						deferred.resolve( data );
					} ).error( function( data ) {
						deferred.reject( data );
					});

				return deferred.promise;

			}
		}
	}]);
