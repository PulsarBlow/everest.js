module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            test : {
                port : 8000
            }
        },
        jasmine: {
            travis: {
                //src: 'lib/**/*.js',
                options: {
                    vendor: [
                        "bower_components/jasmine-ajax/lib/mock-ajax.js"
                    ],
                    specs: [
                        "test/unit/everest.tests.js",
                        "test/unit/everest/system.tests.js",
                        "test/unit/everest/url.tests.js",
                        "test/unit/everest/httpclient.tests.js",
                        "test/unit/everest/restapiclient.tests.js"
                    ],
                    host: 'http://127.0.0.1:8000/',
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfig: {
                            "baseUrl": "./",
                            "paths": {
                                "jquery": "bower_components/jquery/dist/jquery",
                                "everest": "lib/everest"
                            }
                        }
                    }
                }
            }
        },
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
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-connect');

    // Default task
    grunt.registerTask('default', ['requirejs', 'uglify']);
    grunt.registerTask('travis', ['connect', 'jasmine']);
};