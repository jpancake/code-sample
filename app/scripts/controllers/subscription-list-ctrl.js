'use strict';

angular.module('angularAdminApp')
	.controller( 'SubscriptionListCtrl',[ 'subscriptionService', '$scope', function( subscriptionService, $scope ) {
		$scope.subscriptionList = subscriptionService.getSubscriptions() // returns a promise
			.then( function( data ) { // resolves the promise
				$scope.subscriptionList = data;
			});
	}]);
