// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
		'http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js',
		'http://ajax.googleapis.com/ajax/libs/angularjs/1.2.1/angular.min.js',
        'http://ajax.googleapis.com/ajax/libs/angularjs/1.2.1/angular-route.min.js',
        'http://ajax.googleapis.com/ajax/libs/angularjs/1.2.1/angular-animate.min.js',
        'http://ajax.googleapis.com/ajax/libs/angularjs/1.2.1/angular-resource.min.js',
        'http://ajax.googleapis.com/ajax/libs/angularjs/1.2.1/angular-mocks.js',
        'http://netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js',
		'../../app/scripts/*.js',
		'../../app/scripts/**/*.js',
		'spec/*.js'
	],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8420,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  });
};
