//----------------------------------------------------------------------------------------------------------------------
// LDSGLights Gruntfile.
//----------------------------------------------------------------------------------------------------------------------

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        build: {
            css: "build/css",
            js: "build/js"
        },
		project: {
            index: "client/index.html",
            less_dir: "client/less",
            less: "<%= project.less_dir %>/*.less",
            js_dir: "client/js",
            js: "<%= project.js_dir %>/*.js",
            flatpages_dir: "client/flatpages",
            flatpages: "<%= project.flatpages_dir %>/**/*.tpl.html"
		},
        html2js: {
            lightsite: {
                src: ['client/**/*.tpl.html'],
                dest: '<%= build.js %>/templates.js',
                options: {
                    base: 'client',
                    module: 'lightsite.templates',
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
                    '<%= project.css %>/lightsite.css': ['<%= project.less %>', '<%= project.flatpages_dir %>/**/*.less']
                }
            },
            min: {
                options: {
                    paths: ['vendor'],
                    compress: true
                },
                files: {
                    '<%= project.css %>/lightsite.css': ['<%= project.less %>', '<%= project.flatpages_dir %>/**/*.less']
                }
            }
        },
        develop: {
            server: {
                file: 'server.js'
            }
        },
        copy: {
            lightsite: {
                src: '<%= project.index %>',
                expand: true,
                cwd: 'build/',
                filter: 'isFile',
                flatten: true,
                dest: 'build/'
            }
        },
        watch: {
            lightsite: {
                files: ['server.js', 'server/**/*.js'],
                tasks: ['develop'],
                options: {
                    atBegin: true,
                    nospawn: true
                }
            },
            copy: {
                files: ['client/index.html'],
                tasks: ['copy'],
                options: {
                    atBegin: true
                }
            },
            html2js: {
                files: ['client/**/*.tpl.html'],
                tasks: ['html2js'],
                options: {
                    atBegin: true
                }
            },
            less: {
                files: ['<%= project.less %>', '<%= project.flatpages_dir %>/**/*.less'],
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
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('build', ['less', 'systems_js', 'html2js']);
};
