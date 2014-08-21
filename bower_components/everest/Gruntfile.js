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
                options: {
                    vendor: [
                        "bower_components/jasmine-ajax/lib/mock-ajax.js"
                    ],
                    specs: [
                        "test/unit/everest.tests.js",
                        "test/unit/everest/system.tests.js",
                        "test/unit/everest/url.tests.js",
                        "test/unit/everest/httpclient.tests.js",
                        "test/unit/everest/restclient.tests.js"
                    ],
                    host: 'http://127.0.0.1:8000/',
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfig: {
                            "host": "./",
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
                  "host": "./",
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
        },
        version: {
            options: {

            },
            default: {
                src: ["lib/everest/system.js"]
            }
        },
        preprocess: {
            options: {
                context: {
                    DEBUG: true
                }
            },
            default: {
                src: "dist/everest.js",
                dest: "dist/everest.js"
            }
        }

    });

    // Plugins
    grunt.loadNpmTasks('grunt-version');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-preprocess');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-connect');


    // Default task
    grunt.registerTask('default', ['version', 'requirejs', 'preprocess', 'uglify']);

    // Travis task
    grunt.registerTask('travis', ['connect', 'jasmine']);
};