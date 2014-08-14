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
        baseUrl: "",
        dataFormat: dataFormats.JSON,
        dataEncoding: constants.http.charsets.UTF8,
        useCache: false,
        strictSSL: false
    };

    function createHttpServiceConfiguration(restServiceConfiguration) {
        if(!restServiceConfiguration) {
            return {};
        }
        var httpServiceConfiguration = {};
        if(restServiceConfiguration.dataFormat) {
            httpServiceConfiguration["accept"] =
                httpServiceConfiguration["contentType"]
                    = dataFormatToHttpContentType(restServiceConfiguration.dataFormat);
        }
        if(restServiceConfiguration.dataEncoding) {
            httpServiceConfiguration["acceptCharset"] =
                httpServiceConfiguration["contentTypeCharset"] =
                    dataEncodingToHttpCharset(restServiceConfiguration.dataEncoding);
        }
        if(restServiceConfiguration.useCache === true) {
            httpServiceConfiguration["cache"] = true;
        }
        if(restServiceConfiguration.strictSSL === true) {
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

    function createResourceUrl(baseUrl, path) {
        if(system.isEmpty(baseUrl) || system.isEmpty(path)){
            return baseUrl;
        }
        return system.stringFormat("?/?",
            system.stringTrimEnd(baseUrl, "/"),
            system.stringTrimStart(path, "/")
        );
    }

    function RestApiClient(configuration) {
        this._initialize(configuration);
    }

    RestApiClient.prototype.read = function(path, query) {
        return this._httpService.get(
            createResourceUrl(this._configuration.baseUrl, path),
            query);
    };

    RestApiClient.prototype.create = function(path, data) {
        return this._httpService.post(
            createResourceUrl(this._configuration.baseUrl, path),
            data);
    };

    RestApiClient.prototype.update = function(path, data) {
        return this._httpService.put(
            createResourceUrl(this._configuration.baseUrl, path),
            data);
    };

    RestApiClient.prototype.remove = function(path, query) {
        return this._httpService.del(
            createResourceUrl(this._configuration.baseUrl, path),
            query);
    };

    RestApiClient.prototype.setConfiguration = function(configuration) {
        this._configuration = $.extend({}, defaultConfiguration, configuration);
    }
    RestApiClient.prototype.getConfiguration = function() {
        return this._configuration;
    }

    RestApiClient.prototype._initialize = function(configuration) {
        this.setConfiguration(configuration);
        this._httpService = new HttpClient(createHttpServiceConfiguration(this._configuration));
    }

    return RestApiClient;
});