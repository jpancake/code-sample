'use strict';

angular.module( 'smServices' )
    .factory( 'webConfigService', [ '$http', '$q', function( $http, $q ) {
        var decode = function( data ) {
            var returnData = angular.copy( data );
            returnData.songList = returnData.popular_songs;
            delete returnData.popular_songs;

            return returnData;
        };

        var encode = function( data ) {
            var returnData = angular.copy( data );
            returnData.popular_songs = returnData.songList;
            delete returnData.songList;

            return returnData;
        };

        return {
            getWebConfig: function() {
                var route, deferred = $q.defer();

                route = sm.apiRoutes.webConfig;

                $http.get( route )
                    .success( function( data ) {
                        deferred.resolve( decode( data ) );
                    })
                    .error( function() {
                        deferred.reject();
                    });

                return deferred.promise;
            },
            save: function( data ) {
                var deferred, postData = encode(data); // not strictly necessary, but there are so many other 'data's below...
				deferred = $q.defer();

				$http({
					data: postData,
					method: 'PUT',
					url: sm.apiRoutes.webConfig
				}).success( function( data ) {
                    deferred.resolve( data );
                }).error( function( data ) {
                    deferred.reject( data );
                });

				return deferred.promise;
            }
        }
    }]);