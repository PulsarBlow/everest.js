define([
    "jquery",
    "everest/constants",
    "everest/system",
    "everest/url",
    "everest/httpclient"
], function ($, constants, system, URL, HttpClient) {
    "use strict";

    var httpContentTypes = constants.http.contentTypes,
        httpCharsets = constants.http.charsets,
        dataFormats = constants.dataFormats,
        dataEncodings = constants.dataEncodings,
        defaultConfiguration = {
            host: "",
            dataFormat: dataFormats.JSON,
            dataEncoding: constants.http.charsets.UTF8,
            useCache: true,
            useSSL: false
        };

    function createClientConfiguration(restClientConfiguration) {
        if(!restClientConfiguration) {
            return {};
        }
        var httpServiceConfiguration = {};
        if(restClientConfiguration.dataFormat) {
            httpServiceConfiguration["accept"] =
                httpServiceConfiguration["contentType"]
                    = dataFormatToHttpContentType(restClientConfiguration.dataFormat);
        }
        if(restClientConfiguration.dataEncoding) {
            httpServiceConfiguration["acceptCharset"] =
                httpServiceConfiguration["contentTypeCharset"] =
                    dataEncodingToHttpCharset(restClientConfiguration.dataEncoding);
        }
        if(restClientConfiguration.useCache === true) {
            httpServiceConfiguration["cache"] = true;
        }
        if(restClientConfiguration.useSSL === true) {
            httpServiceConfiguration["strictSSL"] = true;
        }
        return httpServiceConfiguration;
    }

    function dataFormatToHttpContentType(dataFormat) {
        if(system.isEmpty(dataFormat)) {
            return httpContentTypes.JSON;
        }
        switch(dataFormat.toLowerCase())
        {
            case dataFormats.XML:
                return httpContentTypes.XML;
            case dataFormats.ATOM:
                return httpContentTypes.ATOM;
            case dataFormats.FORM:
                return httpContentTypes.FORM;
            default:
                return httpContentTypes.JSON;
        }
    }

    function dataEncodingToHttpCharset(dataEncoding) {
        // we only support UTF8 at this time being
        return httpCharsets.UTF8;
    }

    function createBaseUrl(host, useSSL) {
        if(system.isEmpty(host) || system.stringContains(host, "http://") || system.stringContains(host, "https://")) {
            return host;
        }
        return system.stringFormat("??", useSSL ? "https://" : "http://", system.stringTrim(host, "/"));
    }

    function createResourceUrl(baseUrl, path) {
        if(system.isEmpty(baseUrl) || system.isEmpty(path)){
            return baseUrl;
        }
        return system.stringFormat("?/?",
            system.stringTrimEnd(baseUrl, "/"),
            system.stringTrimStart(path, "/")
        );
    }

    function validateConfiguration(configuration) {
        // Do not process in ENV:DEBUG
        if(system.isDebug() || system.isEmpty(configuration)) {
            return;
        }

        if(!system.isObject(configuration)) {
            console.warn("RestClient configuration is not an object", configuration);
        }
        Object.keys(configuration).forEach(function(element, index) {
            if(system.isUndefined(defaultConfiguration[element])) {
                console.warn("RestClient configuration key is not defined (name: %s)", element);
            }
        });
        // @endif
    }

    /**
     * Create a new RestClient
     * @param {Object} [configuration] - The configuration to apply to the new RestClient instance
     * @constructor
     */
    function RestClient(configuration) {
        this._initialize(configuration);
    }

    /**
     * Read a REST resource
     * @access public
     * @param {string} path - Path to the resource
     * @param {Object} query - Additional query parameters to send with the request
     * @returns {Promise} Returns a deferred Promise
     */
    RestClient.prototype.read = function(path, query) {
        return this._httpClient.get(
            createResourceUrl(createBaseUrl(this._configuration.host, this._configuration.useSSL), path),
            query);
    };

    /**
     * Create a new REST resource
     * @access public
     * @param {string} path - Path to the resource
     * @param {Object} data - The data representation of the REST resource
     * @returns {Promise} Returns a deferred Promise
     */
    RestClient.prototype.create = function(path, data) {
        return this._httpClient.post(
            createResourceUrl(createBaseUrl(this._configuration.host, this._configuration.useSSL), path),
            data);
    };

    /**
     * Update an existing REST resource
     * @access public
     * @param {string} path - Path to the resource
     * @param {Object} data - The data representation of the REST resource
     * @returns {Promise} Returns a deferred Promise
     */
    RestClient.prototype.update = function(path, data) {
        return this._httpClient.put(
            createResourceUrl(createBaseUrl(this._configuration.host, this._configuration.useSSL), path),
            data);
    };

    /**
     * Delete a REST resource
     * @access public
     * @param {string} path - Path to the resource
     * @param {Object} query - Additional query parameters to send with the request
     * @returns {Promise} Returns a deferred Promise
     */
    RestClient.prototype.remove = function(path, query) {
        return this._httpClient.del(
            createResourceUrl(createBaseUrl(this._configuration.host, this._configuration.useSSL), path),
            query);
    };

    /**
     * Partially update an existing REST resource
     * @access public
     * @param {string} path - Path to the resource
     * @param {Object} data - The data representation of the REST resource
     * @returns {Promise} Returns a deferred Promise
     */
    RestClient.prototype.partialUpdate = function(path, data) {
      return this._httpClient.patch(
          createResourceUrl(createBaseUrl(this._configuration.host, this._configuration.useSSL), path),
          data);
    };

    /**
     * Apply a new configuration to the current RestClient instance
     * @access public
     * @param {Object} configuration - The configuration to use to reconfigure the RestClient instance
     * @returns {RestClient} Returns the current instance, allowing expression chaining.
     */
    RestClient.prototype.setConfiguration = function(configuration) {
        validateConfiguration(configuration);
        this._configuration = $.extend({}, defaultConfiguration, this._configuration, configuration);
        return this;
    };

    /**
     * Gets the configuration associated to the current RestClient instance
     * @access public
     * @returns {Object} Returns the configuration associated to the current RestClient instance
     */
    RestClient.prototype.getConfiguration = function() {
        return this._configuration;
    };

    /**
     * Add a query string parameter which will be used by the underlying HttpClient.
     * @param {string} name - The name of the query string parameter
     * @param {string} value - The value of the query string parameter
     * @returns {RestClient} Returns the current RestClient instance, allowing expression chaining
     */
    RestClient.prototype.withQueryStringParam = function(name, value) {
        this._httpClient.withQueryStringParam(name, value);
        return this;
    };

    /**
     * Add a set of query string parameters which will be used by the underlying HttpClient.
     * @param {Object} params - An object containing the query string parameters to be added.
     * @returns {RestClient} Returns the current RestClient instance, allowing expression chaining
     */
    RestClient.prototype.withQueryStringParams = function(params) {
        this._httpClient.withQueryStringParams(params);
        return this;
    };

    /**
     * Adds an HTTP header which will be used by the underlying HttpClient
     * @param {string} name - The name of the HTTP header
     * @param {string} value - The value of the HTTP header
     * @returns {RestClient} Returns the current RestClient instance, allowing expression chaining
     */
    RestClient.prototype.withHeader = function(name, value) {
        this._httpClient.withHeader(name, value);
        return this;
    };

    /**
     * Adds a set of HTTP headers which will be used by the underlying HttpClient
     * @param {Object} headers - An object containing the header to be added.
     * @returns {RestClient} Returns the current RestClient instance, allowing expression chaining
     */
    RestClient.prototype.withHeaders = function(headers) {
        this._httpClient.withHeaders(headers);
        return this;
    };

    /**
     * Initialize the current RestClient instance,
     * that is, apply the new configuration and recreate a new instance of the
     * underlying HttpClient
     * @access private
     * @param configuration
     */
    RestClient.prototype._initialize = function(configuration) {
        this.setConfiguration(configuration);
        this._httpClient = new HttpClient(createClientConfiguration(this._configuration));
    };

    return RestClient;
});