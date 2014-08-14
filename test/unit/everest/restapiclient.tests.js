define(["everest/constants", "everest/system", "everest/restapiclient"], function (constants, system, RestApiClient) {
    var httpStatusCodes = constants.http.statusCodes,
        httpHeaders = constants.http.headers,
        httpVerbs = constants.http.verbs,
        httpContentTypes = constants.http.contentTypes,
        httpCharsets = constants.http.charsets,
        dataFormats = constants.dataFormats,
        dataEncodings = constants.dataEncodings,
        baseUrl = "http://github.com/PulsarBlow",
        resourceUrl = baseUrl + "/EverestJs",
        fullUrl = resourceUrl + "?paramTest=value";

    describe("everest.RestApiClient", function () {
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
            expect(RestApiClient).toBeDefined();
            expect(httpStatusCodes).toBeDefined();
            expect(httpVerbs).toBeDefined();
            expect(httpContentTypes).toBeDefined();
            expect(httpCharsets).toBeDefined();
            expect(dataFormats).toBeDefined();
            expect(dataEncodings).toBeDefined();
        });

        describe("RestApiClient", function() {

            describe("RestApiClient constructor", function() {
                it("should initialize properly", function() {
                    expect(new RestApiClient()).toBeDefined();
                })
            });

            describe("RestApiClient._configuration", function() {
                it("should fill default configuration properly", function() {
                    var restApi = new RestApiClient();
                    expect(restApi).toBeDefined();
                    expect(restApi._configuration.dataFormat).toBe(dataFormats.JSON);
                    expect(restApi._configuration.dataEncoding).toBe(dataEncodings.UTF8);
                    expect(restApi._configuration.useCache).toBe(false);
                    expect(restApi._configuration.strictSSL).toBe(false);

                    restApi = new RestApiClient({});
                    expect(restApi._configuration.dataFormat).toBe(dataFormats.JSON);
                    expect(restApi._configuration.dataEncoding).toBe(dataEncodings.UTF8);
                    expect(restApi._configuration.useCache).toBe(false);
                    expect(restApi._configuration.strictSSL).toBe(false);

                    restApi = new RestApiClient({
                        baseUrl: baseUrl,
                        dataFormat: dataFormats.ATOM
                    });
                    expect(restApi._configuration.baseUrl).toBe(baseUrl);
                    expect(restApi._configuration.dataFormat).toBe(dataFormats.ATOM);

                    // Ensure configuration propagation to HttpClient succeeded
                    restApi = new RestApiClient({
                        baseUrl: baseUrl,
                        dataFormat: dataFormats.ATOM
                    });
                    expect(restApi._httpService._configuration.contentType).toBe(httpContentTypes.ATOM);
                    expect(restApi._httpService._configuration.accept).toBe(httpContentTypes.ATOM);
                    expect(restApi._httpService._configuration.acceptCharset).toBe(httpCharsets.UTF8);
                });

            });

            describe("RestApiClient.prototype.read", function () {

                beforeEach(function () {
                    jasmine.Ajax.install();
                    onDone = jasmine.createSpy('onDone');
                    onFail = jasmine.createSpy('onSuccess');

                    var restApi = new RestApiClient({baseUrl: baseUrl});
                    restApi.read('EverestJs', {paramTest: "value"})
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

            describe("RestApiClient.prototype.create", function () {

                beforeEach(function () {
                    jasmine.Ajax.install();
                    onDone = jasmine.createSpy('onDone');
                    onFail = jasmine.createSpy('onSuccess');
                    var restApi = new RestApiClient({baseUrl: baseUrl});
                    restApi.create('EverestJs', {key1: "value"}, {paramTest: "value"})
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

            describe("RestApiClient.prototype.update", function () {

                beforeEach(function () {
                    jasmine.Ajax.install();
                    onDone = jasmine.createSpy('onDone');
                    onFail = jasmine.createSpy('onSuccess');

                    var restApi = new RestApiClient({baseUrl: baseUrl});
                    restApi.update("EverestJs", {key1: "value"}, {headerTest: "value"})
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

            describe("RestApiClient.prototype.remove", function () {

                beforeEach(function () {
                    jasmine.Ajax.install();
                    onDone = jasmine.createSpy('onDone');
                    onFail = jasmine.createSpy('onSuccess');

                    var restApi = new RestApiClient({baseUrl: baseUrl});
                    restApi.remove("EverestJs", {key1: "value"}, {headerTest: "value"})
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
        });
    });
});