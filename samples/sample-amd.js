define(["jquery", "knockout", "everest"], function($, ko, ê){
   "use strict";

    var defaultBaseUrl = "https://api.github.com",
        defaultResourcePath = "/repos/PulsarBlow/everestjs",
        $loader,
        restApi = new ê.RestApiClient({
            baseUrl: defaultBaseUrl,
            useCache: true
        });

    function ViewModel() {
        this.baseUrl = ko.observable(defaultBaseUrl);
        this.resourcePath = ko.observable(defaultResourcePath);
        this.result = ko.observable("");
    }

    ViewModel.prototype.readResource = function () {
        var that = this;

        // Reset the baseUrl (in case your changed it in the input field)
        restApi.setConfiguration({baseUrl: that.baseUrl()});

        // Triggers the read and handles the outcome
        $loader.removeClass("hidden");
        restApi.read(that.resourcePath())
            .done(function (data) {
                that.result(JSON.stringify(data));
                console.log("ResApiClient read success", data);
                $('pre.highlight').each(function (i, block) {
                    hljs.highlightBlock(block);
                });
            })
            .fail(function () {
                console.log("RestApiClient read fail", arguments);
            })
            .always(function () {
                console.log("RestApiClient read completed");
                $loader.addClass("hidden");
            });
    };

    $(document).ready(function () {
        $loader = $("#loader");
        // Databinds the viewModel. Just some Knockout stuff here, nothing related
        // to EverestJs
        ko.applyBindings(new ViewModel());
        // Highlight code

    });
});