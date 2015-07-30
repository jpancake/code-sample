var LoginPage = function() {
	this.emailInput = element(by.model('params.username'));
	this.passwordInput = element(by.model('params.password'));
	this.loginButton = element( by.css('button[type="submit"]'));

	this.setEmail = function( email ) {
		this.emailInput.sendKeys( email );
	};

	this.setPassword = function( password ) {
		this.passwordInput.sendKeys( password );
	};
};

var badUrl, goodUrl, loginPage = new LoginPage();
goodUrl = browser.baseUrl + 'catalog/collections';
badUrl = browser.baseUrl + 'badpath';

beforeEach(function() {
	// clear any existing auth cookies/localStorage settings/etc
	browser.manage().deleteAllCookies();
	/*
		you have to use WebDriver's 'executeScript' method to clear localStorage as this
		code isn't executing in a 'normal' browser context. took me a whole lot of searching
		to find this: https://github.com/angular/protractor/issues/188
	 */
	browser.executeScript(  'window.localStorage.clear();' );
});

describe( 'The site', function() {
    it('should redirect you to the home page if an un-authenticated user tries to go to a page that requires login', function() {
        browser.get( badUrl );

		expect( browser.getCurrentUrl() ).toEqual( browser.baseUrl );
    });

	it('should display a message telling you to login if an unauthed-user tried to access a restricted page', function() {
	    browser.get( goodUrl );

		expect( browser.getCurrentUrl() ).toMatch( /login\?requiresLogin/ );
		expect( element(by.css( 'div.alert' )).isDisplayed() ).toBe( true );
	});

	it('should redirect a user to the originally requested page after logging in', function() {
		browser.get( goodUrl ).then( function() {
			loginPage.setEmail( browser.params.login.email );
			loginPage.setPassword( browser.params.login.password );
			loginPage.loginButton.click();
			expect( browser.getCurrentUrl() ).toEqual( goodUrl );
		});
	});

	it('should redirect a user to the home page if she tries to go to the login page when already logged in', function() {
		browser.executeScript( 'window.localStorage.setItem("authenticated", true);' );
	    browser.get( browser.baseUrl + 'login' ).then(function() {
			expect( browser.getCurrentUrl() ).toEqual( browser.baseUrl );
	    })
	})
});