module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %>-<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> https://github.com/dqsmith/bubblejumper-js*/\n'
            },
            build: {
                src: 'src/js/*.js',
                dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.js'
            }
        },
        watch: {
            scripts: {
                files: ['src/css/*.css', 'src/js/*.js', 'src/*.html'],
                tasks: ['clean', 'uglify', 'cssmin', 'copy'],
                options: {
                    interrupt: true,
                    livereload: true
                },
            },
        },
        clean: {
            scripts: {
                src: ['dist/*.js', 'dist/*.html', 'dist/*.min.css']
            },
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'src/css',
                    src: ['**/*.css', '**/!*.min.css'],
                    dest: 'dist/',
                    ext: '.min.css'
                }]
            }
        },
        copy: {
            main: {
                cwd: 'src',
                expand: true,
                src: ['**/*.html'],
                dest: 'dist'
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['clean', 'uglify', 'cssmin', 'copy', 'watch']);

};