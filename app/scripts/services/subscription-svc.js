'use strict';

angular.module( 'smServices' ).
	factory( 'subscriptionService', [ '$http', '$q', function( $http, $q ) {
		function decode( data ) {
			var field;

			for( field in data ) {
				if( angular.isArray( data[ field ] ) && data[ field ].length === 0 ) {
					// prepopulate the ui with one editable field
					data[ field ].push('');
				}
			}

			return data;
		}

		function getSubscription( subscriptionId ) {
			var route, deferred = $q.defer();

			route = typeof( subscriptionId ) === 'undefined' ? sm.apiRoutes.subscriptions : sm.apiRoutes.subscriptions + '/' + subscriptionId;

			$http.get( route )
				.success( function( data ) {
					if( typeof( subscriptionId ) === 'undefined' ) {
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
			getSubscriptions: getSubscription,
			newSubscriptionObj: function() {
				var returnObj = {
					bullets: [''],
					banners: []
				};

				return returnObj;
			},
			save: function( data, mode ) {
				var i, arr, item, deferred, url, postData = angular.copy( data ); // not strictly necessary, but there are so many other 'data's below...
				mode = mode === 'create' ? 'POST' : 'PUT';
				url = mode === 'PUT' ? sm.apiRoutes.subscriptions + '/' + data.id : sm.apiRoutes.subscriptions;
				deferred = $q.defer();

				delete( postData.id )
				// prune the arrays of '' entries
				for( item in data ) {
					if( angular.isArray( data[ item ] ) ) {
						arr = [];
						for( i=0; i < data[ item ].length; i++ ) {
                            if( item === 'banners' ){
                                 if( data[ item ][ i ].title !== '' && data[ item ][ i ].sku !== '' ){
                                     arr.push(data[ item ][ i ]);
                                 }
                            } else if( data[ item ][ i ] !== '' ) {
							    arr.push( data[ item ][ i ]);
							}
						}
						postData[ item ] = arr;
					}
				}

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
