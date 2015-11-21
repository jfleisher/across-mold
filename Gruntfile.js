// Generated on 2013-11-22 using generator-webapp 0.4.3
// 'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-obfuscator');
    grunt.initConfig({
        // configurable paths
        yeoman: {
            app: 'app',
            dist: 'dist'
        },
        watch: {
            jade: {
                files: ['<%= yeoman.app %>/scripts/templates/{,*/}*{,*/}*.jade'],
                tasks: ['jade']
            },
            coffee: {
                files: ['<%= yeoman.app %>/scripts/{,*/}*{,*/}*.coffee'],
                tasks: ['coffee:dist']
            },
            coffeeTest: {
                files: ['test/spec/{,*/}*.coffee'],
                tasks: ['coffee:test']
            },
            compass: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['compass:server', 'autoprefixer']
            },
            styles: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
                tasks: ['copy:styles', 'autoprefixer']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= yeoman.app %>/*.html',
                    '.tmp/styles/{,*/}*.css',
                    '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
                    '<%= yeoman.app %>/images/{,*/}*.{gif,png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                // change this to '0.0.0.0' to access the server from outside
                hostname: '0.0.0.0'
            },
            testServer: {
                options: {
                    open: true,
                    port: 9002,
                    base: [
                        '.tmp',
                        'test',
                        '<%= yeoman.app %>'
                    ]
                }
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        '<%= yeoman.app %>'
                    ]
                }
            },
            test: {
                options: {
                    base: [
                        '.tmp',
                        'test',
                        '<%= yeoman.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= yeoman.dist %>'
                }
            }
        },
        jst: {
          compile: {
            files: {
              "<%= yeoman.app %>/scripts/templates.js": ["<%= yeoman.app %>/scripts/templates/**/*.html"]
            }
          }
        },
        jade: {
          compile: {
            options: {
              compileDebug: false,
              client: true,
              amd: true,
              data: {
                debug: false,
              }
            },
            files: {
              ".tmp/scripts/templates.js": ["<%= yeoman.app %>/scripts/templates/{,*/}*{,*/}*.jade"],
              "dist/scripts/templates.js": ["<%= yeoman.app %>/scripts/templates/{,*/}*{,*/}*.jade"]
            }
          }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts/{,*/}*.js',
                '!<%= yeoman.app %>/scripts/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        },
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/index.html']
                }
            }
        },
        coffee: {
            dist: {
                options: {
                    sourceMap: false
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/scripts',
                    src: '{,*/}*{,*/}*.coffee',
                    dest: '.tmp/scripts',
                    ext: '.js'
                }]
            },
            build: {
                options: {
                    sourceMap: false
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/scripts',
                    src: '**/*.coffee',
                    dest: 'dist/scripts',
                    ext: '.js'
                }]
            },
            test: {
                files: [{
                    expand: true,
                    cwd: 'test/spec',
                    src: '{,*/}*.coffee',
                    dest: '.tmp/spec',
                    ext: '.js'
                }]
            }
        },
        compass: {
            options: {
                sassDir: '<%= yeoman.app %>/styles',
                cssDir: '.tmp/styles',
                generatedImagesDir: '.tmp/images/generated',
                imagesDir: '<%= yeoman.app %>/images',
                javascriptsDir: '<%= yeoman.app %>/scripts',
                fontsDir: '<%= yeoman.app %>/styles/fonts',
                importPath: '<%= yeoman.app %>/bower_components',
                httpImagesPath: '/images',
                httpGeneratedImagesPath: '/images/generated',
                httpFontsPath: '/styles/fonts',
                relativeAssets: false,
                assetCacheBuster: false
            },
            dist: {
                options: {
                    generatedImagesDir: '<%= yeoman.dist %>/images/generated'
                }
            },
            server: {
                options: {
                    debugInfo: true
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/',
                    dest: 'dist/styles/'
                }]
            }
        },
        // not used since Uglify task does concat,
        // but still available if needed
        /*concat: {
            dist: {}
        },*/
        requirejs: {
            dist: {
                // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
                options: {
                    // `name` and `out` is set by grunt-usemin
                    baseUrl: '.tmp/scripts',
                    optimize: 'uglify2',
                    generateSourceMaps: true,
                    preserveLicenseComments: false,
                    useStrict: true,
                    wrap: true,
                    uglify2: { } // https://github.com/mishoo/UglifyJS2
                }
            }
        },
        uglify: {
          options: {
            mangle: true
          },
          my_target: {
            files: {
              'dist/scripts/makinit.min.js': ['dist/scripts/views/*.js']
            }
          }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/{,*/}*{,*/}*.js',
                        '<%= yeoman.dist %>/styles/{,*/}*.css',
                        '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
                        '<%= yeoman.dist %>/styles/fonts/{,*/}*.*'
                    ]
                }
            }
        },
        useminPrepare: {
            options: {
                dest: '<%= yeoman.dist %>'
            },
            html: '<%= yeoman.app %>/index.html'
        },
        usemin: {
            options: {
                dirs: ['<%= yeoman.dist %>']
            },
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css']
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        cssmin: {
            // This task is pre-configured if you do not wish to use Usemin
            // blocks for your CSS. By default, the Usemin block from your
            // `index.html` will take care of minification, e.g.
            //
            //     <!-- build:css({.tmp,app}) styles/main.css -->
            //
            dist: {
                 files: {
                     '<%= yeoman.dist %>/styles/main.css': [
                         '.tmp/styles/{,*/}*.css',
                         '<%= yeoman.app %>/styles/{,*/}*.css'
                     ]
                 }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    //collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    src: '*.html',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        // Put files not handled in other tasks here
        copy: {
          // fixes coffeescript source maps
            coffee: {
                files: [{
                  expand: true,
                  dot: true,
                  cwd: '<%= yeoman.app %>/scripts',
                  dest: '.tmp/scripts',
                  src: '**/*.coffee'
                }]
              },
            // this, and the vendor task below, fix the requirejs task not being able to
            // find bower components and vendor scripts.
            // the bowerComponents task is pretty silly, as it just copies everything.
            // only the needed files will be loaded, but this will make deploys a bit slower. :/
            bowerComponents: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>/bower_components',
                    dest: '.tmp/bower_components',
                    dest: 'dist/bower_components',
                    src: [
                        '{,*/}*{,*/}*.*'
                    ]
                }]
            },
            vendor: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>/scripts/vendor',
                    dest: '.tmp/scripts/vendor',
                    dest: 'dist/scripts/vendor',
                    src: [
                        '{,*/}*{,*/}*.*'
                    ]
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'images/{,*/}*.{webp,gif}',
                        'styles/fonts/{,*/}*.*',
                        'bower_components/{,*/}*{,*/}*.js'
                    ]
                }]
            },
            styles: {
                expand: true,
                dot: true,
                cwd: '<%= yeoman.app %>/styles',
                dest: '.tmp/styles/',
                dest: 'dist/styles/',
                src: '**/**/*.*'
            }
        },
        modernizr: {
            devFile: '<%= yeoman.app %>/bower_components/modernizr/modernizr.js',
            outputFile: '<%= yeoman.dist %>/bower_components/modernizr/modernizr-custom.js',
            files: [
                '<%= yeoman.dist %>/scripts/{,*/}*.js',
                '<%= yeoman.dist %>/styles/{,*/}*.css',
                '!<%= yeoman.dist %>/scripts/vendor/*'
            ],
            uglify: true
        },
        concurrent: {
            server: [
                'jade',
                'compass',
                'coffee:dist',
                'copy:styles'
            ],
            test: [
                'jade',
                'compass',
                'copy:styles'
            ],
            dist: [
                'jade',
                'compass',
                'coffee',
                'imagemin',
                'svgmin',
                'copy:styles',
                'htmlmin'
            ]
        },
        bower: {
            options: {
                exclude: ['modernizr']
            },
            all: {
                rjsConfig: '<%= yeoman.app %>/scripts/main.js'
            }
        },
        obfuscator: {
            //files: ['<%= yeoman.dist %>/scripts/**/*.js'],
            files: ['./dist/scripts/templates.js'],
            entry: 'app.js',
            out: './dist/scripts/makinit.min.js',
            strings: true,
            root: __dirname
        }
    });

    grunt.registerTask('server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'copy:coffee',
            'concurrent:server',
            'autoprefixer',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'concurrent:test',
        'autoprefixer',
        'connect:test',
        'mocha'
    ]);

    grunt.registerTask('test-server', [
        'clean:server',
        'concurrent:test',
        'concurrent:server',
        'autoprefixer',
        'connect:testServer',
        'watch'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'coffee:build',
        'copy:bowerComponents',
        'concurrent:dist',
        'autoprefixer',
        'copy:vendor'
    ]);

    grunt.registerTask('publish', [
        'clean:dist',
        'coffee:build',
        'copy:bowerComponents',
        'concurrent:dist',
        'autoprefixer',
        'copy:vendor',
        'obfuscator'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);

    //notifications when test fails
    // grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-contrib-jade', 'grunt-notify');
};
