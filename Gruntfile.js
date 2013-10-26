//----------------------------------------------------------------------------------------------------------------------
// RPGKeeper Gruntfile.
//----------------------------------------------------------------------------------------------------------------------

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
		project: {
			css: "client/css",
			less: "client/less",
			systems: {
				less: "systems/**/less",
                js: "systems/**/js",
                controllers: "<%= project.systems.js %>/*controllers*.js",
                filters: "<%= project.systems.js %>/*filters*.js",
                widgets: "systems/**/widgets/**/*.js"
			}
		},
        html2js: {
            rpgkeeper: {
                src: ['client/**/*.tpl.html'],
                dest: 'client/js/client.templates.js',
                options: {
                    base: 'client',
                    module: 'rpgkeeper.client.templates',
                    rename: function (moduleName) {
                        return '/' + moduleName.replace('.tpl', '');
                    }
                }
            },
            systems: {
                src: ['systems/**/*.tpl.html'],
                dest: 'client/js/systems.templates.js',
                options: {
                    base: '.',
                    module: 'rpgkeeper.systems.templates',
                    rename: function (moduleName) {
                        return '/' + moduleName.replace('.tpl', '');
                    }
                }
            }
        },
        less: {
            dev: {
                options: {
                    paths: ['vendor']
                },
                files: {
                    '<%= project.css %>/rpgkeeper.css': ['<%= project.less %>/*.less', 'systems/**/*.less']
                }
            },
            min: {
                options: {
                    paths: ['vendor'],
                    compress: true
                },
                files: {
                    '<%= project.css %>/rpgkeeper.min.css': ['<%= project.less %>/*.less', 'systems/**/*.less']
                }
            }
        },
        develop: {
            server: {
                file: 'server.js'
            }
        },
        watch: {
            rpgkeeper: {
                files: ['server.js', 'lib/*.js', 'systems/**/system.js', 'systems/**/models.js'],
                tasks: ['develop'],
                options: {
                    atBegin: true,
                    nospawn: true
                }
            },
            systems_js: {
                files: ['<%= project.systems.js %>/*.js', '<%= project.systems.widgets %>'],
                tasks: ['controllers', 'filters', 'widgets'],
                options: {
                    atBegin: true
                }
            },
            html2js: {
                files: ['systems/**/*.tpl.html', 'client/**/*.tpl.html'],
                tasks: ['html2js'],
                options: {
                    atBegin: true
                }
            },
            less: {
                files: ['<%= project.less %>/*.less', 'systems/**/*.less'],
                tasks: ['less'],
                options: {
                    atBegin: true
                }
            }
        }
    });

    // Grunt Tasks.
    grunt.loadNpmTasks('grunt-develop');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Task for building systems.controllers.js
    grunt.registerTask('controllers', 'build systems.controllers.js file', function () {
        grunt.file.copy('client/js/systems.controllers.tpl.js', 'client/js/systems.controllers.js', {process: grunt.template.process});
    });

    // Task for building systems.filters.js
    grunt.registerTask('filters', 'build systems.filters.js file', function () {
        grunt.file.copy('client/js/systems.filters.tpl.js', 'client/js/systems.filters.js', {process: grunt.template.process});
    });

    // Task for building systems.widgets.js
    grunt.registerTask('widgets', 'build systems.widgets.js file', function () {
        grunt.file.copy('client/js/systems.widgets.tpl.js', 'client/js/systems.widgets.js', {process: grunt.template.process});
    });

    grunt.registerTask('build', ['less', 'systems_js', 'html2js']);
};
