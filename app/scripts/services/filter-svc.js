'use strict';

angular.module( 'smServices' )
	.factory( 'filterService', [ '$http', '$q', function( $http, $q ) {
		var _apps = { 'sm': true, 'tvp': true };

		function getFilter( filterId ) {
			var route, deferred = $q.defer();

			route = typeof( filterId ) === 'undefined' ? sm.apiRoutes.filters : sm.apiRoutes.filters + '/' + filterId;

			$http.get( route )
				.success( function( data ) {
					if( typeof( filterId ) === 'undefined' ) {
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

		function encode( frontendFilterObj ) {
			var key, os, field, stub,  returnObj = {
				labels: { title: {} },
				filter_type: frontendFilterObj.filter_type
			};

			/*
				The api expects the labels in the form:
				labels: { title: { en: 'All', ... } }
				the ui stores it as labels: { en: 'All', ... } }
			 */
			for( key in frontendFilterObj.labels ) {
				returnObj.labels.title[ key ] = frontendFilterObj.labels[ key ];
			}

			for( key in _apps ) {
				returnObj[ key + '_config' ] = frontendFilterObj[ key ].songList;

				for ( os in frontendFilterObj[ key ].options ) {
					for( field in frontendFilterObj[ key ].options[ os ] ) {
						stub = field.substr(0,3);
						if( stub === 'min' || stub === 'max' ) {
						    stub = stub + 'imum_version'; // will yield 'minimum' or 'maximum'
						} else {
							stub = field;
						}
						returnObj[ key + '_' + os + '_' + stub ] = frontendFilterObj[ key ].options[ os ][ field ];
					}
				}
			}

			return returnObj;
		}

		function decode( serverFilterObj ) {
			var key, opts, returnObj = {
				labels: {},
				sm: { options: { android: {}, ios: {}}},
				tvp: { options: { android: {}, ios: {}}}
			};

			for( key in serverFilterObj ) {
				if( key === 'labels' ) {
				    returnObj.labels = angular.copy( serverFilterObj.labels.title );
				} else if( key === 'filter_type' ) {
					returnObj.filter_type = angular.copy( serverFilterObj.filter_type );
				} else if( key === 'id' ) {
					//
				} else {
					opts = key.split('_'); // 0 = app, 1 = os, 2 = option

					if( opts[2] === 'minimum' || opts[2] === 'maximum' ) {
						opts[2] = opts[2].substr(0,3) + 'Version'
					}

					if( opts[1] === 'config' ) {
					    returnObj[ opts[0] ].songList = angular.copy( serverFilterObj[ key ] );
					} else {
						returnObj[ opts[0] ].options[ opts[ 1 ]][ opts[2] ] = angular.copy( serverFilterObj[ key ] );
					}
				}
			}

			return returnObj;
		}

	    return {
			getFilters: getFilter,
			newFilterObj: function() {
				var  returnObj = {
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
				};

				return returnObj;
			},
			save: function( data, mode ) {
				var deferred, url, postData = encode(data); // not strictly necessary, but there are so many other 'data's below...
				mode = mode === 'create' ? 'POST' : 'PUT';
				url = mode === 'PUT' ? sm.apiRoutes.filters + '/' + data.id : sm.apiRoutes.filters;
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
} ] );