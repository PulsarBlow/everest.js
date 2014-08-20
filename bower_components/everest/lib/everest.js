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
        RestApiClient = require("everest/restapiclient");

    // Public API
    return {
        constants: constants,
        system: system,
        URL: URL,
        HttpClient: HttpClient,
        RestApiClient: RestApiClient
    };
});