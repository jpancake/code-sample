'use strict';

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    clean: {
        admin: ['.tmp', 'dist/'],
        tmp: '.tmp'
    },
  	express: {
		web:{
			options: {
				background: false,
				port: 8082,
				script: 'server.js'
			}
		}
	},
	copy: {
	  'admin': {
		  expand: true,
		  cwd: 'app/styles/',
		  dest: 'dist/styles/',
		  src: '{,*/}*.css'
	  }
	},
    rev: {
      admin: {
        files: {
          src: [
            'dist/scripts/app.js'
          ]
        }
      }
    },
    useminPrepare: {
        admin: {
            options: {
                dest: 'dist',
                type: 'html'
            },
            src: 'app/index.html'
        }
    },
    usemin: {
        admin: {
            options: {
                assetDirs: ['dist/'],
                type: 'html'
            },
            files: { src: ['dist/*.html'] }
        }
    },
    htmlmin: {
        admin: {
            files: [{
                expand: true,
                cwd: 'app/',
                src: ['*.html', 'views/*.html', 'views/**/*.html'],
                dest: 'dist/'
            }]
        }
    },
    karma: {
        unit: {
            configFile: 'test/unit/karma.conf.js',
            singleRun: true
          }
    },
    ngAnnotate: {
      admin: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: ['*.js'],
          dest: 'dist/scripts'
        }]
      }
    },
    uglify: {
        admin: {
            files: {
              'dist/scripts/app.js': [
                'dist/scripts/app.js'
              ]
            }
        }
    }
  });

    grunt.registerTask('test', ['karma']);
    grunt.registerTask('server', ['express']);
    grunt.registerTask('build', [
        'clean:admin',
        'useminPrepare:admin',
        'htmlmin:admin',
        'concat', // concat task is created by useminPrepare & doesn't have its own config block
        'ngAnnotate:admin', // ensure the minifier doesn't remove necessary angular annotations
        'uglify:admin',
        'rev:admin',
        'usemin:admin',
		'copy:admin'
    ]);
	grunt.registerTask('default', ['test', 'build', 'server']);
};
