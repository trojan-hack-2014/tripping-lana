module.exports = function (grunt) {

	require('load-grunt-tasks')(grunt);

	var appConfig = {
		app: require('./bower.json').appPath || 'app',
		dist: 'dist'
	};

	grunt.initConfig({
		mysettings: appConfig,
		watch: {
	      bower: {
	        files: ['bower.json'],
	        tasks: ['wiredep']
	      },
	      js: {
	        files: ['<%= mysettings.app %>/scripts/{,*/}*.js'],
	        tasks: ['newer:jshint:all'],
	        options: {
	          livereload: '<%= connect.options.livereload %>'
	        }
	      },
	      gruntfile: {
	        files: ['Gruntfile.js']
	      },
	      livereload: {
	        options: {
	          livereload: '<%= connect.options.livereload %>'
	        },
	        files: [
	          '<%= mysettings.app %>/{,*/}*.html',
	          '.tmp/styles/{,*/}*.css',
	          '<%= mysettings.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
	        ]
	      }
	    },

	    // The actual grunt server settings
	    connect: {
	      options: {
	        port: 9000,
	        // Change this to '0.0.0.0' to access the server from outside.
	        hostname: 'localhost',
	        livereload: 35729
	      },
	      livereload: {
	        options: {
	          open: true,
	          middleware: function (connect) {
	            return [
	              connect.static('.tmp'),
	              connect().use(
	                '/bower_components',
	                connect.static('./bower_components')
	              ),
	              connect.static(appConfig.app)
	            ];
	          }
	        }
	      },
	      dist: {
	        options: {
	          open: true,
	          base: '<%= mysettings.dist %>'
	        }
	      }
	    },
	    jshint: {
	      options: {
	        jshintrc: '.jshintrc',
	        reporter: require('jshint-stylish')
	      },
	      all: {
	        src: [
	          'Gruntfile.js',
	          '<%= mysettings.app %>/scripts/{,*/}*.js'
	        ]
	      },
	      test: {
	        options: {
	          jshintrc: 'test/.jshintrc'
	        },
	        src: ['test/spec/{,*/}*.js']
	      }
	    },
	    clean: {
	      dist: {
	        files: [{
	          dot: true,
	          src: [
	            '.tmp',
	            '<%= mysettings.dist %>/{,*/}*',
	            '!<%= mysettings.dist %>/.git*'
	          ]
	        }]
	      },
	      server: '.tmp'
	    },
	    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },


    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= mysettings.dist %>/scripts/{,*/}*.js',
          '<%= mysettings.dist %>/styles/{,*/}*.css',
          '<%= mysettings.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= mysettings.dist %>/styles/fonts/*'
        ]
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= mysettings.app %>',
          dest: '<%= mysettings.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'views/{,*/}*.html',
            'images/{,*/}*.*',
            'fonts/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= mysettings.dist %>/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: '.',
          src: 'bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*',
          dest: '<%= mysettings.dist %>'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= mysettings.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },
	});
	 grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
	    if (target === 'dist') {
	      return grunt.task.run(['build', 'connect:dist:keepalive']);
	    }

	    grunt.task.run([
	      'clean:server',
	      'autoprefixer',
	      'connect:livereload',
	      'watch'
	    ]);
	  });
	 grunt.registerTask('build', [
    'clean:dist',
    'autoprefixer',
    'concat',
    'copy:dist',
    'cdnify',
    'uglify',
    'filerev'

  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
}
