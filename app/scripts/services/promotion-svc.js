'use strict';

angular.module( 'smServices' )
	.factory( 'promotionService', [ '$http', '$q', function( $http, $q ) {
		var _apps = { 'sm': true, 'tvp': true };

		function decode( serverPromotionObj ) {
			var key, opts, returnObj = {
				available_languages: {},
				sm: {
					available_regions: {},
					options: { android: {}, ios: {}}
				},
				tvp: {
					available_regions: {},
					options: { android: {}, ios: {}}
				}
			};

			for ( key in serverPromotionObj ) {
				if( key === 'available_languages' ) {
					for( opts = 0; opts < serverPromotionObj[ key ].length; opts++ ) {
						returnObj[ key ][ serverPromotionObj[ key ][ opts ]] = true;
					}
				} else if( key === 'link' || key === 'version' || key == 'title' ) {
					returnObj[ key ] = serverPromotionObj[ key ];
				} else if( key === 'id' ) {
					//
				} else {
					opts = key.split('_'); // 0 = app, 1 = os, 2 = option

					if( opts[1] === 'available') {
						for( var i = 0; i < serverPromotionObj[ key ].length; i++ ) {
							// this will create a key like: sm: { available_regions: { en: true } }
							returnObj[opts[ 0 ]][ 'available_regions' ][ serverPromotionObj[ key ][ i ]] = true;
						}
					} else {
						if( opts[2] === 'minimum' || opts[2] === 'maximum' ) {
							opts[2] = opts[2].substr(0,3) + 'Version'
						} else if( opts[2] === 'big' ) {
							opts[2] = 'bigEnabled';
						}

						returnObj[ opts[0] ].options[ opts[ 1 ]][ opts[2] ] = angular.copy( serverPromotionObj[ key ] );
					}
				}
			}

			return returnObj;
		}

		function encode( frontendFilterObj ) {
			var key, os, field, stub, returnObj = {
				available_languages: [],
				link: frontendFilterObj.link,
				title: frontendFilterObj.title
			};

			if( frontendFilterObj.version !== '' ) {
				returnObj.version = parseInt(frontendFilterObj.version);
			}

			for( key in frontendFilterObj.available_languages ) {
				if( frontendFilterObj.available_languages[key] === true ) {
					returnObj.available_languages.push( key );
				}
			}

			for( key in _apps ) {
				returnObj[ key + '_available_regions' ] = [];

				for( stub in frontendFilterObj[ key ][ 'available_regions' ] ) {
					// items that have been removed in the ui are still in the model, but are falsy
					if( frontendFilterObj[ key ][ 'available_regions' ][stub] === true ) {
						returnObj[ key + '_available_regions' ].push( stub );
					}
				}

				for ( os in frontendFilterObj[ key ].options ) {
					for( field in frontendFilterObj[ key ].options[ os ] ) {
						stub = field.substr(0,3);
						if( stub === 'min' || stub === 'max' ) {
							stub = stub + 'imum_version'; // will yield 'minimum' or 'maximum'
						} else if( stub === 'big' ) {
							stub = 'big_enabled';
						} else {
							stub = field;
						}
						returnObj[ key + '_' + os + '_' + stub ] = frontendFilterObj[ key ].options[ os ][ field ];
					}
				}
			}

			return returnObj;
		}

		function getPromotion( promotionId ) {
			var route, deferred = $q.defer();

			route = typeof( promotionId ) === 'undefined' ? sm.apiRoutes.promotions : sm.apiRoutes.promotions + '/' + promotionId;

			$http.get( route )
				.success( function( data ) {
					if( typeof( promotionId ) === 'undefined' ) {
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

		return {
			getPromotions: getPromotion,
			newPromotionObj: function() {
				var  returnObj = {
					available_languages: {},
					link: '',
					title: '',
					sm: {
						available_regions: {},
						options: {
							ios: { index: null, bigEnabled: false, enabled: false, minVersion: '1.0.0', maxVersion: null },
							android: { index: null, bigEnabled: false, enabled: false, minVersion: '1.0.0', maxVersion: null }
						}
					},
					tvp: {
						available_regions: {},
						options: {
							ios: { index: null, bigEnabled: false, enabled: false, minVersion: '1.0.0', maxVersion: null },
							android: { index: null, bigEnabled: false, enabled: false, minVersion: '1.0.0', maxVersion: null }
						}
					}
				};

				return returnObj;
			},
			save: function( data, mode ) {
				var deferred, url, postData = encode(data); // not strictly necessary, but there are so many other 'data's below...
				mode = mode === 'create' ? 'POST' : 'PUT';
				url = mode === 'PUT' ? sm.apiRoutes.promotions + '/' + data.id : sm.apiRoutes.promotions;
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
