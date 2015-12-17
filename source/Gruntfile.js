module.exports = function( grunt ) {
    'use strict';

    function readOptionalJSON( filepath ) {
        var data = {};
        try {
            data = grunt.file.readJSON( filepath );
        } catch ( e ) {}
        return data;
    }

    var gzip = require( 'gzip-js' ),
        srcHintOptions = readOptionalJSON( 'src/.jshintrc' );

    // The concatenated file won't pass onevar
    // But our modules can
    delete srcHintOptions.onevar;

    grunt.initConfig({
        pkg: grunt.file.readJSON( 'package.json' ),
        'compare_size': {
            files: [ 'dist/appcan.js', 'dist/appcan.min.js' ],
            options: {
                compress: {
                    gz: function( contents ) {
                        return gzip.zip( contents, {} ).length;
                    }
                },
                cache: 'build/.sizecache.json'
            }
        },
        build: {
            all: {
                dest: 'dist/appcan.js'
            }
        },
        concat: {
            core:{
                options: {
                    separator: ';',
                    sourceMap:false,
					banner:  '/*! appcan v<%= pkg.version %> | ' +
                        ' from 3g2win.com */',
                },
                src: ['src/lib/zepto/zepto.js',
                        'src/lib/underscore/underscore.js',
                        'src/lib/backbone/backbone.js',
                        'src/appcan.js',
                        'src/appcan_base.js',
                        'src/appcan_detect.js',
                        'src/appcan_crypto.js',
                        'src/appcan_database.js',
                        'src/appcan_device.js',
                        'src/appcan_eventEmitter.js',
                        'src/appcan_file.js',
                        'src/appcan_Model.js',
                        'src/appcan_request.js',
                        'src/appcan_locStorage.js',
                        'src/appcan_string.js',
                        'src/appcan_User.js',
                        'src/appcan_view.js',
                        'src/appcan_window.js',
                        'src/plugin/appcan_ajaxoffline.js',
                        'src/plugin/appcan_icache.js',
                        'src/appcan_widget.js',
                        'src/appcan_widgetOne.js',
                ],
                dest: 'dist/appcan.js',
                //dest: '../appcan_lib_test/android_iphone/dist/appcan.js',
            },
            basic: {
                options: {
                    separator: ';',
                    sourceMap:false
                },
                src: [
                    'src/lib/zepto/zepto.js',
                    'src/lib/underscore/underscore.js',
                    'src/lib/backbone/backbone.js',                    'src/appcan.js',
                    'src/appcan_base.js',
                    'src/appcan_window.js',
                    'src/appcan_file.js',
                ],
                dest: 'dist/appcan_base.js',
            },
            control:{
                src:[
                    'src/plugins/appcan.control.js'
                ],
                dest:'dist/appcan.control.js'
            },
            plugin: {
                src: [
                     'src/plugin/appcan_plugin.js'
                ],
                dest: 'dist/appcan_plugin.js',
            },
            slide: {
                src: [
                    'src/plugin/appcan_slide.js'
                ],
                dest: 'dist/appcan_slide.js',
            },
            listview: {
                src:[
                    'src/plugins/appcan.listview.js'
                ],
                dest: 'dist/appcan.listview.js'
            },
            tab: {
                src:[
                    'src/plugins/appcan.tab.js'
                ],
                dest: 'dist/appcan.tab.js'
            },
            treeview: {
                src:[
                    'src/plugins/appcan.treeview.js'
                ],
                dest: 'dist/appcan.treeview.js'
            },
            slider: {
                src:[
                    'src/plugins/appcan.slider.js'
                ],
                dest: 'dist/appcan.slider.js'
            },
            optionList: {
                src:[
                    'src/plugins/appcan.optionList.js'
                ],
                dest: 'dist/appcan.optionList.js'
            },
        },
        jsonlint: {
            pkg: {
                src: [ 'package.json' ]
            }
        },
        jshint: {
            all: {
                src: [
                    'src/**/*.js', 'Gruntfile.js', 'test/**/*.js', 'build/**/*.js'
                ],
                options: {
                    jshintrc: true
                }
            },
            dist: {
                src: 'dist/appcan.js',
                options: srcHintOptions
            }
        },
        testswarm: {
            tests: []
        },
        watch: {
            files: [ '<%= jshint.all.src %>' ],
            tasks: 'dev'
        },
        uglify: {
            all: {
                /*files: {
                    'dist/appcan.min.js': [ 'dist/appcan.js' ],
                    'dist/appcan_plugin.min.js': [ 'dist/appcan_plugin.js' ]
                },
				*/
				files:grunt.file.expandMapping(['dist/*.js'], './', {
			        rename: function(destBase, destPath) {
			            return destBase+destPath.replace('.js', '.min.js');
			        }
			    }),
                options: {
                    preserveComments: false,
                    sourceMap: false,
                    sourceMapName: 'dist/appcan.min.map',
                    ASCIIOnly:true,
					report: 'min',
                    beautify: {
                        'ascii_only': true
                    },
                    banner: '/*! appcan v<%= pkg.version %> | ' +
                        ' from 3g2win.com */',
                    compress: {
                        'hoist_funs': false,
                        loops: false,
                        unused: false
                    }
                }
            }
        }
    });

    // Load grunt tasks from NPM packages
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-jsonlint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-compare-size');

    grunt.registerTask( 'lint', [ 'jshint' ] );

    // Short list as a high frequency watch task
    grunt.registerTask( 'dev', ['concat','lint' ] );

    // Default grunt
    grunt.registerTask( 'default', [ 'jsonlint', 'dev', 'uglify', 'compare_size' ] );
};