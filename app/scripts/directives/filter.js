angular.module('angularAdminApp')
	.directive( 'dropDown', ['$compile', '$timeout', function( $compile, $timeout ) {

	var template = '<li ng-repeat="(key,val) in list" data-content="{{key}}">{{ val }}</li>';

	var getList = function( refObj, localObj ) {
		var refKey, returnObj = {};

		for( refKey in refObj ) {
			if( localObj[ refKey ] === undefined ) { // an available option has not been used locally
				returnObj[ refKey ] = refObj[ refKey ]; // make it available
			}
		}

		return returnObj;
	};

	var init = function(scope, el, attrs) {
		if( scope.local !== undefined ) {
			var defaultValue = attrs.fieldType === 'str' ? '' : [];
			scope.list = getList( scope.ref, scope.local );
			if( $.isEmptyObject( scope.list ) ) {
				$( el ).parent().siblings( '.dropdown-toggle' ).attr('disabled','disabled');
			} else {
				$( el ).parent().on('click', 'li', function() {
					var stub = attrs.app === undefined ? scope.$parent.data : scope.$parent.data[ attrs.app ];
					stub[ attrs.usedby.substr( attrs.usedby.indexOf('.') + 1) ][ $( this ).attr('data-content') ] = defaultValue;
					scope.$apply( function() {
						linker( scope, $( this ).parent() );
					} );
				});
			}
		} else {
			/*
			 the $timeout usage here is not ideal. there's probably a nicer way to accomplish this, but i'm not sure
			 how to go about it. for right now, this is necessary for filter detail pages -- the directive attempts
			 to link the elements before the data has returned from the server.
			 */
			$timeout( function() { // will not work if you pass the args in as params of this lambda -- behold, the power of closures
			    init( scope, el, attrs );
			}, 300)
		}

	};

	// thanks to http://onehungrymind.com/angularjs-dynamic-templates/ for the following bit of magic
	var linker = function( scope, el ) {
		scope.list = getList( scope.ref, scope.local );
		el.html( template );
		$compile(el.contents())(scope);

		if( $.isEmptyObject( scope.list ) ) {
			$( scope.buttonEl ).attr('disabled','disabled')
		} else {
			$( scope.buttonEl ).removeAttr( 'disabled' );
		}
	};

    return {
		restrict: 'E',
		link: function( scope, el, attrs ) {
			init( scope, el, attrs );

			scope.buttonEl = $(el ).parent().siblings('.dropdown-toggle');

			scope.$on( 'remove', function( e, from, app ) {
				if( 'data.' + from === attrs.usedby || attrs.app == app ) {
					linker( scope, el );
				}
			});
		},
		replace: true,
		template: template,
		scope: {
			'ref': '=ref',
			'local': '=usedby'
		}
	}
}] );