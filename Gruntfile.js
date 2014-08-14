module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        requirejs: {
          compile: {
              options: {
                  "baseUrl": "./",
                  "paths": {
                      "jquery": "bower_components/jquery/dist/jquery",
                      "almond": "bower_components/almond/almond",
                      "everest": "lib/everest"
                  },
                  "include": [
                      "almond",
                      "everest"
                  ],
                  "exclude": ["jquery"],
                  "out": "dist/everest.js",
                  "wrap": {
                      "startFile": "build/wrap.start",
                      "endFile": "build/wrap.end"
                  },
                  optimize: "none"
              }
          }
        },
        uglify: {
            options: {
                compress: {
                    drop_console: true
                },
                report: 'min',
                preserveComments: 'some',
                mangle: false // dont mangle variables/functions names
            },
            default: {
                files: {
                    "dist/everest.min.js": ["dist/everest.js"]
                }
            }
        }
    });

    // Plugins
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task
    grunt.registerTask('default', ['requirejs', 'uglify']);
};