'use strict';

angular.module( 'smServices' )
	.factory('accessPassService', [ '$http', '$q', function( $http, $q ) {
		function getAccessPass( accessPassId ) {
			var route, deferred = $q.defer();

			route = typeof( accessPassId ) === 'undefined' ? sm.apiRoutes.accessPass : sm.apiRoutes.accessPass + '/' + accessPassId;

			$http.get( route )
				.success( function( data ) {
					if( typeof( accessPassId ) === 'undefined' ) {
						deferred.resolve( data );
					} else {
						deferred.resolve( data );
					}
				})
				.error( function() {
					deferred.reject();
				});

			return deferred.promise;
		}

		return {
			getAccessPass: getAccessPass,
			newAccessPassObj: function() {
				return {
					description: {"en": ""},
					enabled: false,
					name: {"en": ""}
				}
			},
			save: function( data, mode ) {
				var deferred, url, postData = angular.copy( data ); // not strictly necessary, but there are so many other 'data's below...
				mode = mode === 'create' ? 'POST' : 'PUT';
				url = mode === 'PUT' ? sm.apiRoutes.accessPass + '/' + data.id : sm.apiRoutes.accessPass;
				deferred = $q.defer();

				delete( postData.id );

				if( mode === 'PUT' ) {
				    delete( postData.sku );
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
