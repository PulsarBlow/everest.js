/*global define */

/**
 * The main module that defines the public interface for EverestJs,
 * a REST Api client for the browser.
 */
define(function (require) {
    'use strict';

    var $ = require("jquery"),
        constants = require("everest/constants"),
        system = require("everest/system"),
        URL = require("everest/url"),
        HttpClient = require("everest/httpclient"),
        RestClient = require("everest/restclient");

    // Public API
    return {
        constants: constants,
        system: system,
        URL: URL,
        HttpClient: HttpClient,
        RestClient: RestClient,

        /**
         * Creates a new RestClient
         * @param {*} configuration RestApi client configuration
         */
        createRestClient: function(configuration) {
            return new RestClient(configuration);
        },

        /**
         * Creates a new HttpClient
         * @param configuration
         * @returns {HttpClient}
         */
        createHttpClient: function(configuration) {
          return new HttpClient(configuration);
        }
    };
});