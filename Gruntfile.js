'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    clean: {
        admin: ['.tmp'],
        tmp: '.tmp'
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
              'dist/scripts/scripts.js': [
                'dist/scripts/scripts.js'
              ]
            }
        }
    }
  });

    grunt.registerTask('test:admin', ['karma']);

    grunt.registerTask('build:admin', [
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

};
