angular.module('angularAdminApp')
	.directive( 'smFocus', [function() { // forces autofocus
		return {
			restrict: 'A',
			link: function( scope, el ) {
				$( el ).focus();
			}
		}
	}])
	.directive ('statusListener', [ function() { // displays status of an async request
		return {
			restrict: 'A',
			link: function( scope, el ) {
				scope.$on( 'SAVE-SUCCESS', function( e, msg ) { //fade in, then out
					msg = typeof( msg ) === 'undefined' ? 'The record was successfully saved.' : msg;
					el.html('<div class="alert alert-success"><strong>'+ msg +'</strong></div>')
						.show()
						.animate( {opacity: 1}, 1000, function() {
							$( this ).animate( {opacity: 0}, 3000, function() { // end of fade in
								$( this ).removeClass( 'alert-success' ).hide();
							} )
						});
				} );

				scope.$on( 'SAVE-FAILURE', function( e, response ) {
					// if an unhandled exception occurs within the api, it will return an html 500 response
					// instead of the json response we'd normally receive.
					var errorMessage = response.error === undefined ? 'A server error occurred' : response.error.message;

					el.html( '<div class="alert alert-dismissable alert-danger">There was a problem with your request, the details are below: <br><strong>' + errorMessage + '</strong>' +
							'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button></div>' )
						.show()
						.animate( { opacity: 1 }, 2000 )
				} )
			}
		}
	}])
	.directive('hideWhenLoading', [ '$rootScope', function( $rootScope ) { // occludes an element until all requests have successfully returned
		return {
			restrict: 'A',
			link: function( scope, el ) {
				el.prepend( '<div class="loading"></div>' );
				// this catches a case that can occur when a view/controller that doesn't
				// make any async requests on load will be stuck with a loading screen
				// as the intercepter-svc fires the event before the scope's listener has been bound
				if ( $rootScope.requestCount === 0 ) {
					$('div.loading').remove();
				}
				scope.$on( 'LOAD-FINISH', function() {
					$('div.loading').remove();
				});
			}
		}
	}])
	.directive('environment', [ '$location', function( $location ) {
	    return {
			restrict: 'A',
			link: function( scope, el ) {
				var env, html, host = $location.host();

				html = {
					localhost: '<span class="glyphicon glyphicon-home"></span>localhost<span class="glyphicon glyphicon-home"></span>',
					production: '<span class="glyphicon glyphicon-fire"></span>production<span class="glyphicon glyphicon-fire"></span>',
					test: '<span class="glyphicon glyphicon-thumbs-up"></span>test<span class="glyphicon glyphicon-thumbs-down"></span>'
				};

				if ( host.indexOf( 'appspot.com' ) > -1 ) {
					env = host.indexOf( 'test') > -1 ? 'test' : 'production';
				} else {
					env = 'localhost';
				}

				el.addClass( env ).find( 'div.navbar-env' ).append( html[ env ] );
			}
		}
	}])
	.directive('fileModel', ['$parse', function ($parse) {
	    return {
	        restrict: 'A',
	        link: function(scope, element, attrs) {
	            var model = $parse(attrs.fileModel);
	            var modelSetter = model.assign;

	            element.bind('change', function(){
	                scope.$apply(function(){
	                    modelSetter(scope, element[0].files[0]);
	                });
	            });
	        }
	    }
	}])
    .directive('trendingEntry', ['$timeout', function($timeout){
        var changeHandler = function( args ) {
            if( args !== undefined ){
                var el = args.el;
                var scope = args.scope;
            }
            var newVal = parseInt( el.val() );
            var oldVal = 0;
            // make sure both values are valid integers
            if ( newVal ) {
                el.attr('disabled', 'disabled');

                scope.updateEntry(el.attr('data-id'), newVal)
                    .then( function() {
                        scope.getEntries();
                        el.addClass('success');
                        el.attr( 'data-original-val', el.val() );
                        // mark parent form as clean
                        scope[el.parent().attr('name')].$setPristine();
                        $timeout(function() {
                            el.removeAttr('disabled').removeClass('success');
                        }, 2000);

                    });
            } else {
                el.val( oldVal );
            }

        };

        return {
            restrict: 'A',
            link: function( scope, el ){
                // directives bind before the template vals have been inserted, so if
                // we don't assign the attr in this way, data-original-val will be ''
                el.one( 'focus', function() {
                    el.attr( 'data-original-val', el.val() );
                });

                el.keyup(function () {
                    changeHandler( {el: el, scope: scope} );
                });

                el.change(function() {
                    changeHandler( {el: el, scope: scope} );
                })
            }
        }
    }]);
