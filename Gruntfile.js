'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    clean: {
        admin: ['.tmp', 'webapp2/admin/html/dist/*','!webapp2/admin/html/dist/.git*'],
        tmp: '.tmp'
    },
    rev: {
      admin: {
        files: {
          src: [
            'webapp2/admin/html/dist/scripts/{,*/}*.js',
            'webapp2/admin/html/dist/styles/{,*/}*.css'
          ]
        }
      }
    },
    useminPrepare: {
        admin: {
            options: {
                dest: 'webapp2/admin/html/dist',
                type: 'html'
            },
            src: 'webapp2/admin/html/app/index.html'
        },
        wa2: {
            options: {
                type: 'html',
                flow: {
                    steps: {
                        css: ['concat'],
                        js: ['concat', 'uglify']
                    }

                }
            },
            src: 'webapp2/website/templates/layout.html'
        }
    },
    usemin: {
        admin: {
            options: {
                assetDirs: ['webapp2/admin/html/dist'],
                type: 'html'
            },
            files: { src: ['webapp2/admin/html/dist/*.html'] }
        },
        wa2: {
            options: {
                type: 'html'
            },
            files: { src: ['webapp2/website/templates/layout.html'] }
        }
    },
    htmlmin: {
        admin: {
            files: [{
                expand: true,
                cwd: 'webapp2/admin/html/app',
                src: ['*.html', 'views/*.html', 'views/**/*.html'],
                dest: 'webapp2/admin/html/dist'
            }]
        }
    },
    copy: {
        'admin': {
            expand: true,
            cwd: 'webapp2/admin/html/app/styles',
            dest: '.tmp/styles/',
            src: '{,*/}*.css'
        },
        // copy all html files in templates/ to templates/<foo>.html.bak
        'wa2-backup': {
            files: [{
                expand: true,
                cwd: 'webapp2/website/templates',
                src: '*.html',
                dest: 'webapp2/website/templates',
                ext: '.html.bak',
                extDot: 'first'
            }]
        },
        'wa2-tmp': {
            files: [
                { expand: true, flatten: true, filter: 'isFile',
                    src: 'webapp2/website/scripts/**', dest: '.tmp/wa2/scripts/' },
                { expand: true, flatten: true, filter: 'isFile',
                    src: 'webapp2/website/lib/circleplayer/*.js', dest: '.tmp/wa2/lib/circleplayer/' },
                { '.tmp/wa2/lib/handlebars.runtime-v1.3.0.js' : 'webapp2/website/lib/handlebars.runtime-v1.3.0.js' },
                { '.tmp/wa2/lib/jplayer2.6.0/jquery.jplayer.min.js' :
                    'webapp2/website/lib/jplayer2.6.0/jquery.jplayer.min.js' },
                { '.tmp/wa2/lib/circle.skin/smcircle.player.css' :
                    'webapp2/website/lib/circle.skin/smcircle.player.css' }
            ]
        },
        'wa2-styles': {
            files: [{
                cwd: 'webapp2/website/styles',
                src: ['*.css'],
                dest: '.tmp/wa2/styles'
            }]
        },
        'wa2-restore': {
             // copy backed-up html files over the originals
            restore: {
                files: [{
                    expand: true,
                    cwd: 'webapp2/website/templates',
                    src: '*.html.bak',
                    dest: 'webapp2/website/templates',
                    ext: '.html',
                    extDot: 'first'
                }]
            }
        }
    },
    karma: {
        unit: {
            configFile: 'webapp2/admin/html/test/unit/karma.conf.js',
            singleRun: true
          }
    },
    ngAnnotate: {
      admin: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: ['*.js'],
          dest: 'webapp2/admin/html/dist/scripts'
        }]
      }
    },
    cssmin: {
        admin: {
            options: {report: 'min'},
            files: [{
                expand: true,
                cwd: '.tmp/concat/styles/',
                src: ['*.css'],
                dest: 'webapp2/admin/html/dist/styles/'
            }]
        },
        wa2: {
            options: { report: 'min' },
            files: [{
                expand: true,
                cwd: '.tmp/concat/wa2/styles/',
                src: ['*.css'],
                dest: 'webapp2/website/styles/'
            }]
        }
    },
    uglify: {
        admin: {
            files: {
              'webapp2/admin/html/dist/scripts/scripts.js': [
                'webapp2/admin/html/dist/scripts/scripts.js'
              ]
            }
        },
        wa2: {
            options: { report: 'min' },

            files: [{
                expand: true,
                cwd: '.tmp/concat/wa2/scripts/',
                src: ['*.js'],
                dest: 'webapp2/website/scripts/'
            }]
        }
    },
    sass: {
        wa2: {
            options: {quiet: false},
            files: [
                {
                    expand: true,
                    cwd: 'webapp2/website/scss',
                    src: ['**.scss'],
                    dest: '.tmp/wa2/styles',
                    ext: '.css'
                }
            ]
        },
        'wa2-dev': {
            options: {quiet: false},
            files: [
                {
                    expand: true,
                    cwd: 'webapp2/website/scss',
                    src: ['**.scss'],
                    dest: 'webapp2/website/styles',
                    ext: '.css'
                }
            ]
        }

    },
    handlebars: {
        compile: {
            options: {
                namespace: 'Handlebars.templates',
                processName: function(filePath){
                    // takes 'foo/bar.js' and returns 'bar'
                    return filePath.split('/')[1].split('.')[0];
                }
            },
            files: {
                'webapp2/website/scripts/profile-recording-list.js' :
                    'webapp2/website/scripts/profile-recording-list.handlebars'
            }
        }
    },
    watch: {
            handlebars: {
                files: 'webapp2/website/scripts/*.handlebars',
                tasks: ['handlebars']
            },
            css: {
                files: 'webapp2/website/scss/**',
                tasks: ['sass:wa2-dev']
            }
        }
  });

    grunt.registerTask('test:admin', ['karma']);

    grunt.registerTask('build:admin', [
        'clean:admin',
        'useminPrepare:admin',
        'copy:admin',
        'htmlmin:admin',
        'concat', // concat task is created by useminPrepare & doesn't have its own config block
        'ngAnnotate:admin', // ensure the minifier doesn't remove necessary angular annotations
        'cssmin:admin', // copy & process generated css files from .tmp to dist
        'uglify:admin',
        'rev:admin',
        'usemin:admin',
        'clean:tmp'
    ]);

    // this task is run before the files are deployed to GAE
    grunt.registerTask('build:wa2', [
        'clean:tmp',
        'copy:wa2-backup', // back up templates
        'sass:wa2', // compile files in scss/ to styles/
        'handlebars', // pre-compile handlebar templates
        'useminPrepare:wa2', // tell grunt which files to operate on
        'copy:wa2-tmp', // copy scripts and styles to .tmp/wa2
        'concat', // concatenate files
        'cssmin:wa2', // minify css files & copy results to styles/
        'uglify:wa2', // minify js files & copy results to scripts/
        'usemin:wa2', // update html with generated file paths
        'clean:tmp' // remove wa2 directory & temp directories
    ]);

    grunt.registerTask('restore:wa2', [
        'copy:wa2-restore',

    ]);
    grunt.registerTask('dev:wa2', [  'watch' ]);
};
