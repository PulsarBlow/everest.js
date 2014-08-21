define([
    "jquery",
    "everest/constants",
    "everest/system",
    "everest/url"
], function($, constants, system, URL){
    "use strict";

    var httpHeaders = constants.http.headers,
        httpVerbs = constants.http.verbs,
        httpContentTypes = constants.http.contentTypes,
        httpCharsets = constants.http.charsets,

        defaultConfiguration = {

            /**
             * The default accept header is application/json
             */
            accept: httpContentTypes.JSON,

            /**
             * The default accept-charset is utf-8
             */
            acceptCharset: httpCharsets.UTF8,
            /**
             * The default content type is application/json; charset=utf-8
             */
            contentType: httpContentTypes.JSON,
            /**
             * The default charset appended to content type header
             */
            contentTypeCharset: httpCharsets.UTF8,

            /**
             * Specifies whether GET and HEAD request should be cached
             */
            cache: true,
            /**
             * All request will be made over HTTPS only
             */
            strictSSL: false
        };


    function toJSON(obj) {
        if (!obj) {
            return JSON.stringify({});
        }
        return JSON.stringify(obj);
    }

    function formatData(data) {
        return toJSON(data);
    }

    function formatHeaders(headers) {
        if (!headers) {
            return {};
        }
        return headers;
    }

    function formatContentType(contentType, charset) {
        return system.stringFormat("?; charset=?", contentType, charset);
    }

    function formatUrl(uri, strictSSL) {
        if(!strictSSL) {
            return uri;
        }
        var url = new URL(uri);
        url.protocol = constants.protocols.HTTPS;
        return url.toString();
    }

    function createHeadersFromConfiguration(configuration, existingHeaders) {
        if(!configuration && !existingHeaders) {
            return {};
        } else if (!configuration) {
            return existingHeaders;
        }

        if(!existingHeaders) {
            existingHeaders = formatHeaders(existingHeaders);
        }

        if(configuration.accept) {
            existingHeaders[httpHeaders.ACCEPT] = configuration.accept;
        }
        if(configuration.acceptCharset) {
            // Deactivate that at this time being.
            // Chrome does not let this header to be set
            // http://src.chromium.org/svn/branches/WebKit/375.alt/LayoutTests/http/tests/xmlhttprequest/set-dangerous-headers-expected.txt
            //existingHeaders[httpHeaders.ACCEPT_CHARSET] = configuration.acceptCharset;
        }
        if(configuration.contentType) {
            existingHeaders[httpHeaders.CONTENT_TYPE] = formatContentType(configuration.contentType, configuration.contentTypeCharset);
        }
        if(configuration.cache === false) {
            existingHeaders[httpHeaders.CACHE_CONTROL] = constants.http.cacheControls.NO_CACHE;
        }

        return existingHeaders;
    }

    /**
     * Defines an HttpClient constructor function
     * @param {Object} [configuration] - The HttpClient configuration
     * @constructor
     */
    function HttpClient(configuration) {
        this._query = {};
        this._headers = {};

        // TODO: Find a clean way to add the header if the preflight request allow any headers
        //this._headers[constants.everest.USERAGENT_HEADER] = system.stringFormat(constants.everest.USERAGENT_HEADER_FORMAT, system.version);
        this._configuration = $.extend({}, defaultConfiguration, configuration);
    }

    /**
     * Adds one query string parameter to the client which will be appended to each request executions
     * @param {string} name - Query string parameter name
     * @param {string|Number} value - Query string parameter value
     * @returns {HttpClient} - Returns the current HttpClient instance, allowing expression chaining.
     */
    HttpClient.prototype.withQueryStringParam = function(name, value) {
        if(system.isEmpty(name)) {
            return this;
        }
        if(!this._query) {
            this._query = {};
        }
        this._query[name] = value;

        return this;
    };

    /**
     * Adds a set of query string parameters to the client which will be appended to each request executions
     * @param {Object} params - An object containing the key/value pairs to add
     */
    HttpClient.prototype.withQueryStringParams = function(params) {
        if(system.isEmpty(params)) {
            return this;
        }
        if(!this._query) {
            this._query = {};
        }

        this._query = $.extend({}, this._query, params);

        return this;
    };

    /**
     * Adds one header to the client which will be appended to each request executions
     * @param {string} name - Header name
     * @param {string|Number} value - Header value
     * @returns {HttpClient} - Returns the current HttpClient instance, allowing expression chaining.
     */
    HttpClient.prototype.withHeader = function(name, value) {
        if(system.isEmpty(name)) {
            return this;
        }
        if(!this._headers) {
            this._headers = {};
        }
        this._headers[name] = value;

        return this;
    };

    /**
     * Adds a set of headers to the client which will be appended to each request executions
     * @param {Object} headers - An object containing the key/value pairs to add
     */
    HttpClient.prototype.withHeaders = function(headers) {
        if(system.isEmpty(headers)) {
            return this;
        }
        if(!this._headers) {
            this._headers = {};
        }

        this._headers = $.extend({}, this._headers, headers);

        return this;
    };

    /**
     * Executes a GET HTTP request using the configuration of this client instance.
     * @param {string} url - The url where to send the HTTP request
     * @param {Object} [query] - An object containing the query string parameters to be added to this request
     * @param {Object} [headers] - An object containing the headers to be added to this this request
     * @returns {Object} Returns a deferred Promise
     */
    HttpClient.prototype.get = function(url, query, headers) {
        return HttpClient.get(
            formatUrl(url, this._configuration.strictSSL),
            $.extend({}, this._query, query),
            $.extend({}, this._headers, createHeadersFromConfiguration(this._configuration, headers)));
    };

    /**
     * Executes a POST HTTP request using the configuration of this client instance.
     * @param {string} url - The url where to send the HTTP request
     * @param {Object|*} [body] - The body (data) to be added to this request
     * @param {Object} [headers] - An object containing the headers to be added to this request
     * @returns {Object} - Returns a deferred Promise
     */
    HttpClient.prototype.post = function(url, body, headers) {
        return HttpClient.post(
            formatUrl(url, this._configuration.strictSSL),
            body,
            $.extend({}, this._headers, createHeadersFromConfiguration(this._configuration, headers)));
    };

    /**
     * Executes a PUT HTTP request using the configuration of this client instance.
     * @param {string} url - The url where to send the HTTP request
     * @param {Object|*} [body] - The body (data) to be added to this request
     * @param {Object} [headers] - An object containing the headers to be added to this request
     * @returns {Object} - Returns a deferred Promise
     */
    HttpClient.prototype.put = function(url, body, headers) {
        return HttpClient.put(
            formatUrl(url, this._configuration.strictSSL),
            body,
            $.extend({}, this._headers, createHeadersFromConfiguration(this._configuration, headers)));
    };

    /**
     * Executes a PATCH HTTP request using the configuration of this client instance.
     * @param {string} url - The url where to send the HTTP request
     * @param {Object|*} [body] - The body (data) to be added to this request
     * @param {Object} [headers] - An object containing the headers to be added to this request
     * @returns {Object} - Returns a deferred Promise
     */
    HttpClient.prototype.patch = function(url, body, headers) {
        return HttpClient.patch(
            formatUrl(url, this._configuration.strictSSL),
            body,
            $.extend({}, this._headers, createHeadersFromConfiguration(this._configuration, headers)));
    };

    /**
     * Executes a DELETE HTTP request using the configuration of this client instance.
     * @param {string} url - The url where to send the HTTP request
     * @param {Object} [query] - An object containing the query string parameters to be added to this request
     * @param {Object} [headers] - An object containing the headers to be added to this this request
     * @returns {Object} Returns a deferred Promise
     */
    HttpClient.prototype.del = function(url, query, headers) {
      return HttpClient.del(
          formatUrl(url, this._configuration.strictSSL),
          $.extend({}, this._query, query),
          $.extend({}, this._headers, createHeadersFromConfiguration(this._configuration, headers)));
    };

    /**
     * Executes a GET HTTP request
     * @param {string} url - The url where to send this GET HTTP request
     * @param {Object} [query] - An object containing additional query string parameters to be added to this request.
     * @param {Object} [headers] - An object containing additional headers to be added to this request
     * @returns {Object} - Returns a deferred Promise
     */
    HttpClient.get = function (url, query, headers) {
        return $.ajax(url, {
            data: query,
            headers: formatHeaders(headers)
        }).always(function () {
            console.log('[GET] ' + url, { url: url, query: query, headers: headers, args: arguments });
        });
    };

    /**
     * Executes a POST HTTP request
     * @param {string} url - The url where to send the HTTP request
     * @param {Object|*} [body] - The body (data) to be added to this request
     * @param {Object} [headers] - An object containing the headers to be added to this request
     * @returns {Object} - Returns a deferred Promise
     */
    HttpClient.post= function (url, body, headers) {
        return $.ajax({
            url: url,
            data: formatData(body),
            type: httpVerbs.POST,
            contentType: httpContentTypes.JSON,
            dataType: 'json',
            headers: formatHeaders(headers)
        }).always(function () {
            console.log('[POST] ' + url, { url: url, data: body, headers: headers, args: arguments });
        });
    };

    /**
     * Executes a PUT HTTP request
     * @param {string} url - The url where to send the HTTP request
     * @param {Object|*} [body] - The body (data) to be added to this request
     * @param {Object} [headers] - An object containing the headers to be added to this request
     * @returns {Object} - Returns a deferred Promise
     */
    HttpClient.put = function (url, body, headers) {
        return $.ajax({
            url: url,
            data: formatData(body),
            type: httpVerbs.PUT,
            contentType: httpContentTypes.JSON,
            dataType: 'json',
            headers: formatHeaders(headers)
        }).always(function () {
            console.log('[PUT] ' + url, { url: url, data: body, headers: headers, args: arguments });
        });
    };

    /**
     * Executes a DELETE HTTP request
     * @param {string} url - The url where to send this GET HTTP request
     * @param {Object} [query] - An object containing additional query string parameters to be added to this request.
     * @param {Object} [headers] - An object containing additional headers to be added to this request
     * @returns {Object} - Returns a deferred Promise
     */
    HttpClient.del = function (url, query, headers) {
        return $.ajax({
            url: url,
            data: query,
            type: httpVerbs.DELETE,
            contentType: httpContentTypes.JSON,
            dataType: 'json',
            headers: formatHeaders(headers)
        }).always(function () {
            console.log('[DELETE] ' + url, { url: url, query: query, headers: headers, args: arguments });
        });
    };

    /**
     * Executes a PATCH HTTP request
     * @param {string} url - The url where to send the HTTP request
     * @param {Object|*} [body] - The body (data) to be added to this request
     * @param {Object} [headers] - An object containing the headers to be added to this request
     * @returns {Object} - Returns a deferred Promise
     */
    HttpClient.patch = function (url, body, headers) {
        return $.ajax({
            url: url,
            data: formatData(body),
            type: httpVerbs.PATCH,
            contentType: httpContentTypes.JSON,
            dataType: 'json',
            headers: formatHeaders(headers)
        }).always(function () {
            console.log('[PATCH] ' + url, { url: url, data: body, headers: headers, args: arguments });
        });
    };

    return HttpClient;
});