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
            cache: false,
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
    
    function createAjaxOptions(httpServiceConfiguration) {
        return {
            contentType: formatContentType(
                httpServiceConfiguration.contentType,
                httpServiceConfiguration.charset),
            accepts: httpServiceConfiguration.accept
        }
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
     * @param configuration
     * @constructor
     */
    function HttpClient(configuration) {
        this._configuration = $.extend({}, defaultConfiguration, configuration);
    }

    HttpClient.prototype.get = function(url, query, headers) {
        return HttpClient.get(
            formatUrl(url, this._configuration.strictSSL),
            query,
            createHeadersFromConfiguration(this._configuration, headers));
    };

    HttpClient.prototype.post = function(url, body, headers) {
        return HttpClient.post(
            formatUrl(url, this._configuration.strictSSL),
            body,
            createHeadersFromConfiguration(this._configuration, headers));
    };

    HttpClient.prototype.put = function(url, body, headers) {
        return HttpClient.put(
            formatUrl(url, this._configuration.strictSSL),
            body,
            createHeadersFromConfiguration(this._configuration, headers));
    };

    HttpClient.prototype.del = function(url, query, headers) {
      return HttpClient.del(
          formatUrl(url, this._configuration.strictSSL),
          query,
          createHeadersFromConfiguration(this._configuration, headers));
    };

    /**
     * Executes a GET HTTP request
     * @param url
     * @param query
     * @param headers
     * @returns {Promise} Returns a deferred promise
     */
    HttpClient.get = function (url, query, headers) {
        var promise = $.ajax(url, {
            data: query,
            headers: formatHeaders(headers)
        });

        promise.always(function () {
            console.log('[GET] ' + url, { url: url, query: query, headers: headers, args: arguments });
        });

        return promise;
    };

    /**
     * Executes a POST HTTP request
     * @param url
     * @param body
     * @param headers
     * @returns {Promise} Returns a deferred promise
     */
    HttpClient.post= function (url, body, headers) {
        var promise = $.ajax({
            url: url,
            data: formatData(body),
            type: httpVerbs.POST,
            contentType: httpContentTypes.JSON,
            dataType: 'json',
            headers: formatHeaders(headers)
        }).always(function () {
            console.log('[POST] ' + url, { url: url, data: body, headers: headers, args: arguments });
        });

        return promise;
    };

    /**
     * Executes a PUT HTTP request
     * @param url
     * @param body
     * @param headers
     * @returns {Promise} Returns a deferred promise
     */
    HttpClient.put = function (url, body, headers) {
        var promise = $.ajax({
            url: url,
            data: formatData(body),
            type: httpVerbs.PUT,
            contentType: httpContentTypes.JSON,
            dataType: 'json',
            headers: formatHeaders(headers)
        });
        promise.always(function () {
            console.log('[PUT] ' + url, { url: url, data: body, headers: headers, args: arguments });
        });
        return promise;
    };

    /**
     * Executes a DELETE HTTP request
     * @param url
     * @param query
     * @param headers
     * @returns {Promise} Returns a deferred promise
     */
    HttpClient.del = function (url, query, headers) {
        var promise = $.ajax({
            url: url,
            data: query,
            type: httpVerbs.DELETE,
            contentType: httpContentTypes.JSON,
            dataType: 'json',
            headers: formatHeaders(headers)
        });
        promise.always(function () {
            console.log('[DELETE] ' + url, { url: url, query: query, headers: headers, args: arguments });
        });
        return promise;
    };

    return HttpClient;
});