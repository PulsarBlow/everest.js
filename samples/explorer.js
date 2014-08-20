/*global define */
define([
    "jquery",
    "knockout",
    "everest"
], function ($, ko, ê) {
    "use strict";

    var httpVerbs = ê.constants.http.verbs,
        system = ê.system;

    function getServiceMethod(httpVerb) {
        system.guard.argumentNotNullOrEmpty(httpVerb, "httpVerb");
        switch(httpVerb.toLowerCase())
        {
            case httpVerbs.GET.toLowerCase():
                return "read";
            case httpVerbs.POST.toLowerCase():
                return "create";
            case httpVerbs.PUT.toLowerCase():
                return "update";
            case httpVerbs.DELETE.toLowerCase():
                return "remove";
            default:
                throw new Error("This API method is not supported");
        }
    }

    function Explorer() {
        this.options = {
            baseUrl: ko.observable(""),
            dataFormat: ko.observable("")
        };
        this.resourcePath = ko.observable("");
        this.httpVerb = ko.observable("");
    }

    Explorer.prototype.requestApi = function () {
        var restApi = new ê.RestApiClient({
            baseUrl: this.options.baseUrl(),
            dataFormat: this.options.dataFormat()
        }),
            serviceMethod = getServiceMethod(this.httpVerb());

        restApi[serviceMethod](this.resourcePath())
            .done(function(data) {
                console.log("data", data);
            })
            .fail(function() {
                console.log("Api call failed");
            })

    };

    ko.applyBindings(new Explorer());
});