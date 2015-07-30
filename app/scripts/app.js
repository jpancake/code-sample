'use strict';

var sm = typeof( sm ) === 'undefined' ? {} : sm;

sm.apiPathPrefix = '/admin/api/';

sm.apiRoutes = {
	accessPass: sm.apiPathPrefix + 'access_passes',
	broadcast: sm.apiPathPrefix + 'notifications/broadcast',
	collections: sm.apiPathPrefix + 'collections',
	filters: sm.apiPathPrefix + 'filters',
	getAllSongs: sm.apiPathPrefix + 'songs',
	login: sm.apiPathPrefix + 'login',
	promotions: sm.apiPathPrefix + 'promotions',
	subscriptions: sm.apiPathPrefix + 'subscription_info',
    contests: sm.apiPathPrefix + 'contests',
    contestImages: sm.apiPathPrefix + 'contest_images',
    webConfig: sm.apiPathPrefix + 'web_config',
    mcnUserStatus: sm.apiPathPrefix + 'mcn_user_status',
    mcnUserContractStatus: sm.apiPathPrefix + 'mcn_user_contract_status',
    mcnUserInfo: sm.apiPathPrefix + 'mcn_user_info',
    inviteMCNUser: sm.apiPathPrefix + 'invite_mcn_user',
    inviteNewMCNUser: sm.apiPathPrefix + 'add_invited_mcn_user',
    inviteRejectedMCNUser: sm.apiPathPrefix + 'invite_rejected_mcn_user',
};


angular.module('angularAdminApp', [
  'ngAnimate', 'ngResource', 'ngRoute', 'ui.bootstrap', 'smServices'
])
	.config([ '$routeProvider', function ( $routeProvider ) {
		$routeProvider
		.when('/', {
			templateUrl: 'views/main.html',
			controller: 'MainCtrl'
		})
		// access pass admin views
		.when( '/access-pass', {
			templateUrl: 'views/list-pages/access-pass.html',
			controller: 'AccessPassListCtrl'
		})
		.when( '/access-pass/add', {
			templateUrl: 'views/detail-pages/access-pass.html',
			controller: 'AccessPassCtrl'
		})
		.when( '/access-pass/:accessPassId', {
			templateUrl: 'views/detail-pages/access-pass.html',
			controller: 'AccessPassCtrl'
		})
		// catalog admin views
		.when('/catalog/filters', {
			templateUrl: 'views/catalog/filters.html',
			controller: 'FiltersCtrl'
		})
		.when('/catalog/filters/add', {
			templateUrl: 'views/catalog/filter.html',
			controller: 'FilterCtrl'
		})
		.when('/catalog/filter/:filterId', {
			templateUrl: 'views/catalog/filter.html',
			controller: 'FilterCtrl'
		})
		.when('/catalog/promotions', {
			templateUrl: 'views/catalog/promotions.html',
			controller: 'PromotionsCtrl'
		})
		.when('/catalog/promotions/add', {
			templateUrl: 'views/catalog/promotion.html',
			controller: 'PromotionCtrl'
		})
		.when('/catalog/promotion/:promotionId', {
			templateUrl: 'views/catalog/promotion.html',
			controller: 'PromotionCtrl'
		})
		.when('/catalog/collections', {
			templateUrl: 'views/catalog/collections.html',
			controller: 'CollectionsCtrl'
		})
		.when('/catalog/collections/add', {
			templateUrl: 'views/catalog/collection.html',
			controller: 'CollectionCtrl'
		})
		.when('/catalog/collection/:collectionId', {
			templateUrl: 'views/catalog/collection.html',
			controller: 'CollectionCtrl'
		})
		// login views
		.when('/login', {
			templateUrl: 'views/login.html',
			controller: 'LoginCtrl'
		})
		// web config admin views
        .when('/web-config', {
			templateUrl: 'views/web-config.html',
			controller: 'WebConfigCtrl'
		})
		// subscription info admin views
		.when('/subscription-info', {
			templateUrl: 'views/list-pages/subscription-info.html',
			controller: 'SubscriptionListCtrl'
		})
		.when('/subscription-info/add', {
			templateUrl: 'views/detail-pages/subscription-info.html',
			controller: 'SubscriptionCtrl'
		})
		.when('/subscription-info/:subscriptionId', {
			templateUrl: 'views/detail-pages/subscription-info.html',
			controller: 'SubscriptionCtrl'
		})
		// notification broadcast admin views
		.when('/broadcast', {
				templateUrl: 'views/detail-pages/broadcast.html',
				controller: 'BroadcastCtrl'
			})
		.when('/broadcast/:platform', {
				templateUrl: 'views/detail-pages/broadcast.html',
				controller: 'BroadcastCtrl'
			})
		// contest admin views
		.when('/contests', {
                templateUrl: 'views/list-pages/contests.html',
                controller: 'ContestsCtrl'
            })
		.when('/contests/add', {
				templateUrl: 'views/detail-pages/contest.html',
				controller: 'ContestCtrl'
			})
		.when('/contests/:contestSlug', {
				templateUrl: 'views/detail-pages/contest.html',
				controller: 'ContestCtrl'
			})
		.when('/contests/:contestSlug/stats', {
				templateUrl: 'views/detail-pages/contest-stats.html',
				controller: 'ContestStatsCtrl'
			})
		// trending contest entries admin views
        .when('/trending', {
                templateUrl: 'views/list-pages/trending.html',
                controller: 'ContestsCtrl'
            })
        .when('/trending/:contestSlug', {
                templateUrl: 'views/detail-pages/trending.html',
                controller: 'TrendingCtrl'
            })
        // MCN accept/deny admin views
        .when('/mcn-user-status', {
                templateUrl: 'views/list-pages/mcn-user-status.html',
                controller: 'MCNUserStatusListCtrl'
            })
        .when('/mcn-user-status/:mcnUserID', {
                templateUrl: 'views/detail-pages/mcn-user-status.html',
                controller: 'MCNUserStatusCtrl'
            })
        // MCN user info admin views
        .when('/mcn-user-info', {
                templateUrl: 'views/detail-pages/mcn-user-info.html',
                controller: 'MCNUserInfoCtrl'
            })
        // MCN user create + invite admin views
        .when('/mcn-user-contract-status', {
                templateUrl: 'views/list-pages/mcn-user-contract-status.html',
                controller: 'MCNUserContractCtrl'
            })
        .when('/invite-mcn-user', {
                templateUrl: 'views/detail-pages/invite-mcn-user.html',
                controller: 'InviteMCNUserCtrl'
            })
        .when('/invite-new-mcn-user', {
                templateUrl: 'views/detail-pages/invite-new-mcn-user.html',
                controller: 'InviteNewMCNUserCtrl'
            })
        // other views
        .when('/mcn-rejected-user', {
                templateUrl: 'views/list-pages/mcn-rejected-user.html',
                controller: 'MCNRejectedUserListCtrl'
            })
        .when('/mcn-rejected-user/:mcnUserID', {
                templateUrl: 'views/detail-pages/mcn-rejected-user.html',
                controller: 'MCNRejectedUserCtrl'
            })
		.otherwise({
			redirectTo: '/'
		});
	}])
	.config([ '$httpProvider', function( $httpProvider ) {
		$httpProvider.interceptors.push('httpResponseInterceptor');
	}])
;

angular.module( 'smServices', [] );
