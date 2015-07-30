'use strict';

angular.module('angularAdminApp')
	.controller( 'BroadcastCtrl', ['$http', '$routeParams', '$scope', function( $http, $routeParams, $scope ) {
		var i, optionalFields = [ 'notification_badge', 'notification_sound', 'notification_icon_url', 'notification_internal_uri' ];

		$scope.platforms = {
			all: 'All',
			android: 'Android',
			ios: 'iOS'
		};

		$scope.clients = {
			all: 'All',
			sm: 'StarMaker',
			tvp: 'The Voice'
		};

		$scope.data = {
			notification_message: '',
			platform: 'all',
			client_code: 'all',
			notification_internal_uri: '',
			notification_badge: '',
			notification_sound: '',
			notification_icon_url: ''
		};

		$scope.broadcast_clients = '';
		$scope.broadcast_platforms = '';

		if( $routeParams.platform !== undefined && $scope.platforms[ $routeParams.platform] !== undefined ) {
			$scope.data.platform = $routeParams.platform;
		}

		function updatePlatformMessaging() {
			if( $scope.data.platform === 'all') {
				$scope.broadcast_platforms = 'iOS + Android'
			} else {
				$scope.broadcast_platforms = $scope.platforms[ $scope.data.platform ];
			}
		}

		function updateClientMessaging() {
			if( $scope.data.client_code === 'all' ) {
				$scope.broadcast_clients = 'all apps'
			} else {
				$scope.broadcast_clients = $scope.clients[ $scope.data.client_code ];
			}
		}

		function trimEmpty( field, sourceObj ) {
			if( sourceObj[ field ] === '' ) {
			    delete( sourceObj[ field ] );
			}
		}

		$scope.save = function( invalid ) {
			if( !invalid ) {
				var postData = angular.copy( $scope.data );

				if( $scope.data.platform === 'android' ) {
					delete( postData.notification_badge );
					delete( postData.notification_sound );
				} else if ( $scope.data.platform === 'ios' ) {
					delete( postData.notification_icon_url );
				} else { // platform is 'all', but the api expects null for this case
					postData.platform = null;
				}

				if( postData.client_code === 'all' ) {
				    postData.client_code = null;
				}

				for( i=0; i < optionalFields.length; i++ ) {
					trimEmpty( optionalFields[ i ], postData );
				}
			}

			$http({
				data: postData,
				method: 'POST',
				url: sm.apiRoutes.broadcast
			}).success( function() {
				$scope.$emit( 'SAVE-SUCCESS', 'The message was successfully broadcast.' );
			}).error( function( data ) {
				$scope.$emit( 'SAVE-FAILURE', data );
			});
		};

		$scope.$watch( 'data.platform', updatePlatformMessaging );
		$scope.$watch( 'data.client_code', updateClientMessaging );
		$scope.$emit( 'LOAD-FINISH' );
	}] );