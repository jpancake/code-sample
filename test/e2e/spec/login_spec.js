// https://github.com/angular/protractor/blob/master/docs/getting-started.md#organizing-real-tests-page-objects
var LoginPage = function() {
	this.emailInput = element(by.model('params.username'));
	this.passwordInput = element(by.model('params.password'));
	this.loginButton = element( by.css('button[type="submit"]'));

	this.get = function() {
		browser.get( browser.baseUrl );
	};

	this.setEmail = function( email ) {
		this.emailInput.sendKeys( email );
	};

	this.setPassword = function( password ) {
		this.passwordInput.sendKeys( password );
	};
};

var loginPage = new LoginPage();

beforeEach(function() {
	loginPage.get();
});

describe( 'The login page', function() {
	it('should not allow a user to click the "sign in" button without entering either email or password', function() {
		expect( loginPage.loginButton.isEnabled() ).toBe( false );
	});

	it('should not allow clicking the "sign in" button when entering a valid email but no password', function() {
		loginPage.setEmail( browser.params.login.email );
		expect( loginPage.loginButton.isEnabled() ).toBe( false );
	});

	it('should not allow clicking the "sign in" button when entering an invalid email address', function() {
		loginPage.setEmail( 'a@a' );
		expect( loginPage.loginButton.isEnabled() ).toBe( false );
	});

	it('should not be possible to click "sign in" when entering a password but no email address', function() {
		loginPage.setPassword( browser.params.login.password );
		expect( loginPage.loginButton.isEnabled() ).toBe( false );
	});

	it('should allow a user to click the "sign in" button after entering a valid email and password', function() {
		loginPage.setEmail( browser.params.login.email );
		loginPage.setPassword( browser.params.login.password );
		expect( loginPage.loginButton.isEnabled() ).toBe( true );
	});

	it('should display an error if you try to login with invalid credentials', function() {
		loginPage.setEmail( browser.params.login.email );
		loginPage.setPassword( 'badpass' );
		loginPage.loginButton.click();
		expect( browser.getCurrentUrl() ).toMatch( /login\?badLogin/ );
		expect( element( by.css( 'div.alert' ) ).isDisplayed() ).toBe( true );
	});

	it('should display the main page with no querystring params after successfully logging in after failing', function() {
		loginPage.setEmail( browser.params.login.email );
		loginPage.setPassword( 'badpass' );
		loginPage.loginButton.click();
		// we're now on the login failure page
		loginPage.setEmail( browser.params.login.email );
		loginPage.setPassword( browser.params.login.password );
		loginPage.loginButton.click();
		expect( browser.getCurrentUrl() ).toMatch( browser.baseUrl );
	});
});
