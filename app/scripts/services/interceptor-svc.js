angular.module( 'smServices' )
	.factory( 'httpResponseInterceptor', ['$location', '$q', '$rootScope', function( $location, $q, $rootScope ) {
		$rootScope.requestCount = 0;

		function incrementRequestCount() {
			$rootScope.requestCount++;
		}

		function decrementRequestCount() {
			if( $rootScope.requestCount > 1 ) {
				$rootScope.requestCount--;
			} else {
				zeroRequestCount();
			}
		}

		function zeroRequestCount() {
			$rootScope.requestCount = 0;
			$rootScope.$broadcast( 'LOAD-FINISH' );
		}

		return {
			request: function( config ) {
				incrementRequestCount();

				return config || $q.when( config );
			},
			response: function( response ) {
				decrementRequestCount();

				return response || $q.when( response );
			},
			responseError: function( rejection ) {
				zeroRequestCount();

				if( rejection.status === 401 ) {
					$rootScope.$broadcast(  'LOGOUT', 'sessionTimeout' );
				}

				return $q.reject(rejection);
			}
		}
	}] );
