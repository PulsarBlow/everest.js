define(["everest/constants", "everest/system", "everest/restclient"], function (constants, system, RestClient) {
    var httpStatusCodes = constants.http.statusCodes,
        httpVerbs = constants.http.verbs,
        httpContentTypes = constants.http.contentTypes,
        httpCharsets = constants.http.charsets,
        dataFormats = constants.dataFormats,
        dataEncodings = constants.dataEncodings,
        host = "api.github.com",
        resourcePath = "/repos/PulsarBlow/everest.js",
        resourceUrl = "https://api.github.com/repos/PulsarBlow/everest.js",
        fullUrl = "https://api.github.com/repos/PulsarBlow/everest.js?paramTest=value";

    describe("everest.RestClient", function () {
        var request,
            response = {
                ok: {
                    status: httpStatusCodes.OK,
                    responseText: '{"message": "OK" }'
                },
                created: {
                    status: httpStatusCodes.CREATED,
                    responseText: '{"message": "CREATED" }'
                },
                nocontent: {
                    status: httpStatusCodes.NO_CONTENT
                },
                notFound: {
                    status: httpStatusCodes.NOT_FOUND,
                    responseText: '{"message": "NOT_FOUND" }'
                }
            },
            onDone, onFail;

        it("should be defined", function () {
            expect(RestClient).toBeDefined();
            expect(httpStatusCodes).toBeDefined();
            expect(httpVerbs).toBeDefined();
            expect(httpContentTypes).toBeDefined();
            expect(httpCharsets).toBeDefined();
            expect(dataFormats).toBeDefined();
            expect(dataEncodings).toBeDefined();
        });

        describe("RestClient", function() {

            describe("RestClient constructor", function() {
                it("should initialize properly", function() {
                    expect(new RestClient()).toBeDefined();
                    expect(new RestClient({})).toBeDefined();
                });
            });

            describe("RestClient._configuration", function() {
                it("should fill default configuration properly", function() {
                    var restApi = new RestClient();
                    expect(restApi).toBeDefined();
                    expect(restApi._configuration.dataFormat).toBe(dataFormats.JSON);
                    expect(restApi._configuration.dataEncoding).toBe(dataEncodings.UTF8);
                    expect(restApi._configuration.useCache).toBe(true);
                    expect(restApi._configuration.useSSL).toBe(false);

                    restApi = new RestClient({});
                    expect(restApi._configuration.dataFormat).toBe(dataFormats.JSON);
                    expect(restApi._configuration.dataEncoding).toBe(dataEncodings.UTF8);
                    expect(restApi._configuration.useCache).toBe(true);
                    expect(restApi._configuration.useSSL).toBe(false);

                    restApi = new RestClient({
                        host: host,
                        dataFormat: dataFormats.ATOM
                    });
                    expect(restApi._configuration.host).toBe(host);
                    expect(restApi._configuration.dataFormat).toBe(dataFormats.ATOM);

                    // Ensure configuration propagation to HttpClient succeeded
                    restApi = new RestClient({
                        host: host,
                        dataFormat: dataFormats.ATOM
                    });
                    expect(restApi._httpClient._configuration.contentType).toBe(httpContentTypes.ATOM);
                    expect(restApi._httpClient._configuration.accept).toBe(httpContentTypes.ATOM);
                    expect(restApi._httpClient._configuration.acceptCharset).toBe(httpCharsets.UTF8);
                });
            });

            describe("RestClient.prototype.setConfiguration", function() {
                it("should validate and set the configuration properly", function() {
                    var client = new RestClient();
                    client.setConfiguration({host: "1.example.com"});
                    expect(client._configuration.host).toBe("1.example.com");
                });
            });

            describe("RestClient.prototype.getConfiguration", function() {
                it("should return the configuration properly", function() {
                    var client = new RestClient({host: "1.example.com"});
                    expect(client._configuration.host).toBe("1.example.com");
                    client.setConfiguration({host: "2.example.com"});
                    var configuration = client.getConfiguration();
                    expect(configuration).toBeDefined();
                    expect(configuration.host).toBe("2.example.com");
                });
            });

            describe("RestClient.prototype.read", function () {

                beforeEach(function () {
                    jasmine.Ajax.install();
                    onDone = jasmine.createSpy('onDone');
                    onFail = jasmine.createSpy('onFail');

                    var restApi = new RestClient({host: host, useSSL: true});
                    restApi.read(resourcePath, {paramTest: "value"})
                        .done(onDone)
                        .fail(onFail);

                    request = jasmine.Ajax.requests.mostRecent();
                    expect(request.url).toBe(fullUrl);
                });

                describe("on 200:OK", function () {

                    beforeEach(function () {
                        request.response(response.ok);
                    });

                    it("calls done", function () {
                        expect(onDone).toHaveBeenCalled();
                        var data = onDone.calls.mostRecent().args[0];
                        expect(data).toEqual({message: "OK"});
                    });
                });

                describe("on 404:NOT_FOUND", function () {
                    beforeEach(function () {
                        request.response(response.notFound);
                    });

                    it("calls fail", function () {
                        expect(onDone).not.toHaveBeenCalled();
                        expect(onFail).toHaveBeenCalled();
                        var data = onFail.calls.mostRecent().args[0];
                        expect(data.responseJSON).toEqual({message: "NOT_FOUND"});
                    });
                });
            });

            describe("RestClient.prototype.create", function () {

                beforeEach(function () {
                    jasmine.Ajax.install();
                    onDone = jasmine.createSpy('onDone');
                    onFail = jasmine.createSpy('onFail');
                    var restApi = new RestClient({host: host, useSSL:true});
                    restApi.create(resourcePath, {key1: "value"}, {paramTest: "value"})
                        .done(onDone)
                        .fail(onFail);

                    request = jasmine.Ajax.requests.mostRecent();
                    expect(request.url).toBe(resourceUrl);

                });

                describe("on 201:CREATED", function () {
                    beforeEach(function () {
                        request.response(response.created);
                    });

                    it("calls done", function () {
                        expect(onDone).toHaveBeenCalled();
                        var data = onDone.calls.mostRecent().args[0];
                        expect(data).toEqual({message: "CREATED"});
                    });
                });

                describe("on 404:NOT_FOUND", function () {
                    beforeEach(function () {
                        request.response(response.notFound);
                    });
                    it("calls fail", function () {
                        expect(onDone).not.toHaveBeenCalled();
                        expect(onFail).toHaveBeenCalled();
                        var data = onFail.calls.mostRecent().args[0];
                        expect(data.responseJSON).toEqual({message: "NOT_FOUND"});
                    });
                });
            });

            describe("RestClient.prototype.update", function () {

                beforeEach(function () {
                    jasmine.Ajax.install();
                    onDone = jasmine.createSpy('onDone');
                    onFail = jasmine.createSpy('onFail');

                    var restApi = new RestClient({host: host, useSSL:true});
                    restApi.update(resourcePath, {key1: "value"}, {headerTest: "value"})
                        .done(onDone)
                        .fail(onFail);

                    request = jasmine.Ajax.requests.mostRecent();
                    expect(request.url).toBe(resourceUrl);
                });

                describe("on 200:OK", function () {
                    beforeEach(function () {
                        request.response(response.ok);
                    });

                    it("calls done", function () {
                        expect(onDone).toHaveBeenCalled();
                        var data = onDone.calls.mostRecent().args[0];
                        expect(data).toEqual({message: "OK"});
                    });
                });

                describe("on 404;NOT_FOUND", function () {
                    beforeEach(function () {
                        request.response(response.notFound);
                    });
                    it("calls fail", function () {
                        expect(onDone).not.toHaveBeenCalled();
                        expect(onFail).toHaveBeenCalled();
                        var data = onFail.calls.mostRecent().args[0];
                        expect(data.responseJSON).toEqual({message: "NOT_FOUND"});
                    });
                });
            });

            describe("RestClient.prototype.partialUpdate", function () {

                beforeEach(function () {
                    jasmine.Ajax.install();
                    onDone = jasmine.createSpy('onDone');
                    onFail = jasmine.createSpy('onFail');

                    var restApi = new RestClient({host: host, useSSL:true});
                    restApi.partialUpdate(resourcePath, {key1: "value"}, {headerTest: "value"})
                        .done(onDone)
                        .fail(onFail);

                    request = jasmine.Ajax.requests.mostRecent();
                    expect(request.url).toBe(resourceUrl);
                });

                describe("on 200:OK", function () {
                    beforeEach(function () {
                        request.response(response.ok);
                    });

                    it("calls done", function () {
                        expect(onDone).toHaveBeenCalled();
                        var data = onDone.calls.mostRecent().args[0];
                        expect(data).toEqual({message: "OK"});
                    });
                });

                describe("on 404;NOT_FOUND", function () {
                    beforeEach(function () {
                        request.response(response.notFound);
                    });
                    it("calls fail", function () {
                        expect(onDone).not.toHaveBeenCalled();
                        expect(onFail).toHaveBeenCalled();
                        var data = onFail.calls.mostRecent().args[0];
                        expect(data.responseJSON).toEqual({message: "NOT_FOUND"});
                    });
                });
            });

            describe("RestClient.prototype.remove", function () {

                beforeEach(function () {
                    jasmine.Ajax.install();
                    onDone = jasmine.createSpy('onDone');
                    onFail = jasmine.createSpy('onFail');

                    var restApi = new RestClient({host: host, useSSL:true});
                    restApi.remove(resourcePath, {key1: "value"}, {headerTest: "value"})
                        .done(onDone)
                        .fail(onFail);

                    request = jasmine.Ajax.requests.mostRecent();
                    expect(request.url).toBe(resourceUrl);
                });

                describe("on 204:NoContent", function () {
                    beforeEach(function () {
                        request.response(response.nocontent);
                    });

                    it("calls done", function () {
                        expect(onDone).toHaveBeenCalled();
                        var data = onDone.calls.mostRecent().args[0];
                        expect(data).toBeUndefined();
                    });
                });

                describe("on 404:NOT_FOUND", function () {
                    beforeEach(function () {
                        request.response(response.notFound);
                    });
                    it("calls fail", function () {
                        expect(onDone).not.toHaveBeenCalled();
                        expect(onFail).toHaveBeenCalled();
                        var data = onFail.calls.mostRecent().args[0];
                        expect(data.responseJSON).toEqual({message: "NOT_FOUND"});
                    });
                });
            });

            describe("RestClient.prototype.withQueryStringParam", function () {

                beforeEach(function () {
                    jasmine.Ajax.install();
                    onDone = jasmine.createSpy('onDone');
                    onFail = jasmine.createSpy('onFail');

                    var restApi = new RestClient({host: host, useSSL: true})
                        .withQueryStringParam("withParam", "withValue");
                    restApi.read(resourcePath, {paramTest: "value"})
                        .done(onDone)
                        .fail(onFail);

                    request = jasmine.Ajax.requests.mostRecent();
                    expect(request.url).toBe("https://api.github.com/repos/PulsarBlow/everest.js?withParam=withValue&paramTest=value");
                });

                describe("on 200:OK", function () {

                    beforeEach(function () {
                        request.response(response.ok);
                    });

                    it("calls done", function () {
                        expect(onDone).toHaveBeenCalled();
                        var data = onDone.calls.mostRecent().args[0];
                        expect(data).toEqual({message: "OK"});
                    });
                });

                describe("on 404:NOT_FOUND", function () {
                    beforeEach(function () {
                        request.response(response.notFound);
                    });

                    it("calls fail", function () {
                        expect(onDone).not.toHaveBeenCalled();
                        expect(onFail).toHaveBeenCalled();
                        var data = onFail.calls.mostRecent().args[0];
                        expect(data.responseJSON).toEqual({message: "NOT_FOUND"});
                    });
                });
            });

            describe("RestClient.prototype.withQueryStringParams", function () {

                beforeEach(function () {
                    jasmine.Ajax.install();
                    onDone = jasmine.createSpy('onDone');
                    onFail = jasmine.createSpy('onFail');

                    var restApi = new RestClient({host: host, useSSL: true})
                        .withQueryStringParams({
                            "withParam1":"value",
                            "withParam2":"123"
                        });
                    restApi.read(resourcePath, {paramTest: "value"})
                        .done(onDone)
                        .fail(onFail);

                    request = jasmine.Ajax.requests.mostRecent();
                    expect(request.url).toBe("https://api.github.com/repos/PulsarBlow/everest.js?withParam1=value&withParam2=123&paramTest=value");
                });

                describe("on 200:OK", function () {

                    beforeEach(function () {
                        request.response(response.ok);
                    });

                    it("calls done", function () {
                        expect(onDone).toHaveBeenCalled();
                        var data = onDone.calls.mostRecent().args[0];
                        expect(data).toEqual({message: "OK"});
                    });
                });

                describe("on 404:NOT_FOUND", function () {
                    beforeEach(function () {
                        request.response(response.notFound);
                    });

                    it("calls fail", function () {
                        expect(onDone).not.toHaveBeenCalled();
                        expect(onFail).toHaveBeenCalled();
                        var data = onFail.calls.mostRecent().args[0];
                        expect(data.responseJSON).toEqual({message: "NOT_FOUND"});
                    });
                });
            });

            describe("RestClient.prototype.withHeader", function () {

                beforeEach(function () {
                    jasmine.Ajax.install();
                    onDone = jasmine.createSpy('onDone');
                    onFail = jasmine.createSpy('onFail');

                    var restApi = new RestClient({host: host, useSSL: true})
                        .withQueryStringParam("withParam", "withValue")
                        .withHeader("withHeader", "value");
                    restApi.read(resourcePath, {paramTest: "value"})
                        .done(onDone)
                        .fail(onFail);

                    request = jasmine.Ajax.requests.mostRecent();
                    expect(request.url).toBe("https://api.github.com/repos/PulsarBlow/everest.js?withParam=withValue&paramTest=value");
                    expect(request.requestHeaders["withHeader"]).toBeDefined();
                    expect(request.requestHeaders["withHeader"]).toBe("value");
                });

                describe("on 200:OK", function () {

                    beforeEach(function () {
                        request.response(response.ok);
                    });

                    it("calls done", function () {
                        expect(onDone).toHaveBeenCalled();
                        var data = onDone.calls.mostRecent().args[0];
                        expect(data).toEqual({message: "OK"});
                    });
                });

                describe("on 404:NOT_FOUND", function () {
                    beforeEach(function () {
                        request.response(response.notFound);
                    });

                    it("calls fail", function () {
                        expect(onDone).not.toHaveBeenCalled();
                        expect(onFail).toHaveBeenCalled();
                        var data = onFail.calls.mostRecent().args[0];
                        expect(data.responseJSON).toEqual({message: "NOT_FOUND"});
                    });
                });
            });

            describe("RestClient.prototype.withHeaders", function () {

                beforeEach(function () {
                    jasmine.Ajax.install();
                    onDone = jasmine.createSpy('onDone');
                    onFail = jasmine.createSpy('onFail');

                    var restApi = new RestClient({host: host, useSSL: true})
                        .withQueryStringParams({
                            "withParam1":"value",
                            "withParam2":"123"
                        })
                        .withHeaders({
                            "header1": "value",
                            "header2": "123"
                        });
                    restApi.read(resourcePath, {paramTest: "value"})
                        .done(onDone)
                        .fail(onFail);

                    request = jasmine.Ajax.requests.mostRecent();
                    expect(request.url).toBe("https://api.github.com/repos/PulsarBlow/everest.js?withParam1=value&withParam2=123&paramTest=value");
                    expect(request.requestHeaders["header1"]).toBeDefined();
                    expect(request.requestHeaders["header1"]).toBe("value");
                    expect(request.requestHeaders["header2"]).toBeDefined();
                    expect(request.requestHeaders["header2"]).toBe("123");
                });

                describe("on 200:OK", function () {

                    beforeEach(function () {
                        request.response(response.ok);
                    });

                    it("calls done", function () {
                        expect(onDone).toHaveBeenCalled();
                        var data = onDone.calls.mostRecent().args[0];
                        expect(data).toEqual({message: "OK"});
                    });
                });

                describe("on 404:NOT_FOUND", function () {
                    beforeEach(function () {
                        request.response(response.notFound);
                    });

                    it("calls fail", function () {
                        expect(onDone).not.toHaveBeenCalled();
                        expect(onFail).toHaveBeenCalled();
                        var data = onFail.calls.mostRecent().args[0];
                        expect(data.responseJSON).toEqual({message: "NOT_FOUND"});
                    });
                });
            });
        });
    });
});