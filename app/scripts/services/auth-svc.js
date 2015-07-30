'use strict';

angular.module('smServices')
	.factory('authService', [ '$http', '$location', '$rootScope', function( $http, $location, $rootScope ) {
		var _originalPath = null;
		var _authenticated = false;

		var _login = function() {
			var path = $location.path();

			_authenticated = true;
			localStorage.setItem( 'authenticated', 'true' );
			$rootScope.$broadcast( 'LOGIN' );
			$location.search( '' ); // clear any querystring params that may have been set

			if( _originalPath !== null ) {
				$location.path( _originalPath );
				_originalPath = null;
			} else if ( path === '/login' ) {
				$location.path( '/' );
			}
		};

		return  {
			testLoginStatus: function() {
				var path = $location.path();

				if( _authenticated === false ) {
					if( localStorage.getItem( 'authenticated' ) !== null ) {
						_login();
					} else if( path !== '/' && path !== '/login' ) {
						_originalPath = path;
						$location.path( '/login' ).search( 'requiresLogin' );
					}
				}
			},
			isLoggedIn: function() {
				return _authenticated;
			},
			login: function( params ) {
				$http.post( sm.apiRoutes.login, params )
					.success( _login )
					.error( function() {
						$location.path( '/login' ).search( 'badLogin' );
					});
			},
			logout: function( reason ) {
				localStorage.removeItem( 'authenticated' );
				_authenticated = false;
				_originalPath = $location.path();
				$location.path( '/login' ).search( reason );
			}
		}

	}]);
