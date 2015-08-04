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
            options: {
                separator: ';',
                sourceMap:true
            },
            dist: {
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
                    'src/appcan_storage.js',
                    'src/appcan_string.js',
                    'src/appcan_User.js',
                    'src/appcan_view.js',
                    'src/appcan_window.js',
               ],
              dest: 'dist/appcan.js',
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
				files: {
					'dist/appcan.min.js': [ 'dist/appcan.js' ]
				},
				options: {
					preserveComments: false,
					sourceMap: true,
					sourceMapName: 'dist/appcan.min.map',
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
	//test auto update

	// Load grunt tasks from NPM packages
	grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-jsonlint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-compare-size');


	grunt.registerTask( 'lint', [ 'jshint' ] );

	// Short list as a high frequency watch task
	grunt.registerTask( 'dev', [ 'concat' ] );

	// Default grunt
	grunt.registerTask( 'default', [ 'jsonlint', 'dev', 'uglify', 'compare_size' ] );
};
