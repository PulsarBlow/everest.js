define(["everest/constants", "everest/system", "everest/httpclient"], function (constants, system, HttpClient) {
    var httpStatusCodes = constants.http.statusCodes,
        httpHeaders = constants.http.headers,
        httpVerbs = constants.http.verbs,
        httpContentTypes = constants.http.contentTypes,
        httpCharsets = constants.http.charsets,
        baseUrl = "https://api.github.com/repos/PulsarBlow/everest.js";

    describe("everest.HttpClient", function () {
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
            expect(HttpClient).toBeDefined();
            expect(httpStatusCodes).toBeDefined();
            expect(httpVerbs).toBeDefined();
            expect(httpContentTypes).toBeDefined();
            expect(httpCharsets).toBeDefined();
        });

        describe("HttpClient.get", function () {

            beforeEach(function () {
                jasmine.Ajax.install();
                onDone = jasmine.createSpy('onDone');
                onFail = jasmine.createSpy('onFail');

                HttpClient.get(baseUrl, {paramTest: "value"}, {headerTest: "value"})
                    .done(onDone)
                    .fail(onFail);

                request = jasmine.Ajax.requests.mostRecent();
                expect(request.url).toBe(baseUrl + '?paramTest=value');
                expect(request.method).toBe(httpVerbs.GET);
                expect(request.requestHeaders).toBeDefined();
                expect(request.requestHeaders["headerTest"]).toBeDefined();
                expect(request.requestHeaders["headerTest"]).toBe("value");
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

        describe("HttpClient.post", function () {

            beforeEach(function () {
                jasmine.Ajax.install();
                onDone = jasmine.createSpy('onDone');
                onFail = jasmine.createSpy('onFail');

                HttpClient.post(baseUrl, {key1: "value"}, {headerTest: "value"})
                    .done(onDone)
                    .fail(onFail);

                request = jasmine.Ajax.requests.mostRecent();
                expect(request.url).toBe(baseUrl);
                expect(request.method).toBe(httpVerbs.POST);
                expect(request.requestHeaders).toBeDefined();
                expect(request.requestHeaders["headerTest"]).toBeDefined();
                expect(request.requestHeaders["headerTest"]).toBe("value");

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

        describe("HttpClient.put", function () {

            beforeEach(function () {
                jasmine.Ajax.install();
                onDone = jasmine.createSpy('onDone');
                onFail = jasmine.createSpy('onFail');

                HttpClient.put(baseUrl, {key1: "value"}, {headerTest: "value"})
                    .done(onDone)
                    .fail(onFail);

                request = jasmine.Ajax.requests.mostRecent();
                expect(request.url).toBe(baseUrl);
                expect(request.method).toBe(httpVerbs.PUT);
                expect(request.requestHeaders).toBeDefined();
                expect(request.requestHeaders["headerTest"]).toBeDefined();
                expect(request.requestHeaders["headerTest"]).toBe("value");

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

        describe("HttpClient.del", function () {

            beforeEach(function () {
                jasmine.Ajax.install();
                onDone = jasmine.createSpy('onDone');
                onFail = jasmine.createSpy('onFail');

                HttpClient.del(baseUrl, {key1: "value"}, {headerTest: "value"})
                    .done(onDone)
                    .fail(onFail);

                request = jasmine.Ajax.requests.mostRecent();
                expect(request.url).toBe(baseUrl);
                expect(request.method).toBe(httpVerbs.DELETE);
                expect(request.requestHeaders).toBeDefined();
                expect(request.requestHeaders["headerTest"]).toBeDefined();
                expect(request.requestHeaders["headerTest"]).toBe("value");

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

        describe("HttpClient.put", function () {

            beforeEach(function () {
                jasmine.Ajax.install();
                onDone = jasmine.createSpy('onDone');
                onFail = jasmine.createSpy('onFail');

                HttpClient.patch(baseUrl, {key1: "value"}, {headerTest: "value"})
                    .done(onDone)
                    .fail(onFail);

                request = jasmine.Ajax.requests.mostRecent();
                expect(request.url).toBe(baseUrl);
                expect(request.method).toBe(httpVerbs.PATCH);
                expect(request.requestHeaders).toBeDefined();
                expect(request.requestHeaders["headerTest"]).toBeDefined();
                expect(request.requestHeaders["headerTest"]).toBe("value");

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

        describe("HttpClient", function() {

            describe("HttpClient constructor", function() {
                it("should initialize properly", function() {
                    expect(new HttpClient()).toBeDefined();
                })
            });

            describe("HttpClient._configuration", function() {
                it("should fill default configuration properly", function() {
                    var client = new HttpClient();
                    expect(client).toBeDefined();
                    expect(client._configuration.accept).toBe(httpContentTypes.JSON);
                    expect(client._configuration.acceptCharset).toBe(httpCharsets.UTF8);
                    expect(client._configuration.contentType).toBe(httpContentTypes.JSON);
                    expect(client._configuration.cache).toBe(true);
                    expect(client._configuration.strictSSL).toBe(false);

                    client = new HttpClient({});
                    expect(client).toBeDefined();
                    expect(client._configuration.accept).toBe(httpContentTypes.JSON);
                    client = new HttpClient({accept: httpContentTypes.ATOM});
                    expect(client).toBeDefined();
                    expect(client._configuration.accept).toBe(httpContentTypes.ATOM);
                });

            });

            describe("HttpClient.prototype.get", function () {

                beforeEach(function () {
                    jasmine.Ajax.install();
                    onDone = jasmine.createSpy('onDone');
                    onFail = jasmine.createSpy('onFail');

                    var client = new HttpClient();
                    client.get(baseUrl, {paramTest: "value"}, {headerTest: "value"})
                        .done(onDone)
                        .fail(onFail);

                    request = jasmine.Ajax.requests.mostRecent();
                    expect(request.url).toBe(baseUrl + '?paramTest=value');
                    expect(request.method).toBe(httpVerbs.GET);
                    expect(request.requestHeaders).toBeDefined();
                    expect(validateHeadersFromConfiguration(client._configuration, request.requestHeaders)).toBe(true);
                    expect(request.requestHeaders["headerTest"]).toBeDefined();
                    expect(request.requestHeaders["headerTest"]).toBe("value");
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

            describe("HttpClient.prototype.get with strictSSL", function() {

                beforeEach(function () {
                    jasmine.Ajax.install();
                    onDone = jasmine.createSpy('onDone');
                    onFail = jasmine.createSpy('onFail');

                    var client = new HttpClient({strictSSL: true});
                    client.get(baseUrl, {paramTest: "value"}, {headerTest: "value"})
                        .done(onDone)
                        .fail(onFail);

                    request = jasmine.Ajax.requests.mostRecent();
                    expect(request.url).toBe(baseUrl + '?paramTest=value');
                    expect(request.method).toBe(httpVerbs.GET);
                    expect(request.requestHeaders).toBeDefined();
                    expect(validateHeadersFromConfiguration(client._configuration, request.requestHeaders)).toBe(true);
                    expect(request.requestHeaders["headerTest"]).toBeDefined();
                    expect(request.requestHeaders["headerTest"]).toBe("value");
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

            describe("HttpClient.prototype.post", function () {

                beforeEach(function () {
                    jasmine.Ajax.install();
                    onDone = jasmine.createSpy('onDone');
                    onFail = jasmine.createSpy('onFail');
                    var client = new HttpClient();
                    client.post(baseUrl, {key1: "value"}, {headerTest: "value"})
                        .done(onDone)
                        .fail(onFail);

                    request = jasmine.Ajax.requests.mostRecent();
                    expect(request.url).toBe(baseUrl);
                    expect(request.method).toBe(httpVerbs.POST);
                    expect(request.requestHeaders).toBeDefined();
                    expect(validateHeadersFromConfiguration(client._configuration, request.requestHeaders)).toBe(true);
                    expect(request.requestHeaders["headerTest"]).toBeDefined();
                    expect(request.requestHeaders["headerTest"]).toBe("value");

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

            describe("HttpClient.prototype.put", function () {

                beforeEach(function () {
                    jasmine.Ajax.install();
                    onDone = jasmine.createSpy('onDone');
                    onFail = jasmine.createSpy('onFail');

                    var client = new HttpClient();
                    client.put(baseUrl, {key1: "value"}, {headerTest: "value"})
                        .done(onDone)
                        .fail(onFail);

                    request = jasmine.Ajax.requests.mostRecent();
                    expect(request.url).toBe(baseUrl);
                    expect(request.method).toBe(httpVerbs.PUT);
                    expect(request.requestHeaders).toBeDefined();
                    expect(validateHeadersFromConfiguration(client._configuration, request.requestHeaders)).toBe(true);
                    expect(request.requestHeaders["headerTest"]).toBeDefined();
                    expect(request.requestHeaders["headerTest"]).toBe("value");

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

            describe("HttpClient.prototype.del", function () {

                beforeEach(function () {
                    jasmine.Ajax.install();
                    onDone = jasmine.createSpy('onDone');
                    onFail = jasmine.createSpy('onFail');

                    var client = new HttpClient();
                    client.del(baseUrl, {key1: "value"}, {headerTest: "value"})
                        .done(onDone)
                        .fail(onFail);

                    request = jasmine.Ajax.requests.mostRecent();
                    expect(request.url).toBe(baseUrl);
                    expect(request.method).toBe(httpVerbs.DELETE);
                    expect(request.requestHeaders).toBeDefined();
                    expect(validateHeadersFromConfiguration(client._configuration, request.requestHeaders)).toBe(true);
                    expect(request.requestHeaders["headerTest"]).toBeDefined();
                    expect(request.requestHeaders["headerTest"]).toBe("value");

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

            describe("HttpClient.prototype.patch", function () {

                beforeEach(function () {
                    jasmine.Ajax.install();
                    onDone = jasmine.createSpy('onDone');
                    onFail = jasmine.createSpy('onFail');

                    var client = new HttpClient();
                    client.patch(baseUrl, {key1: "value"}, {headerTest: "value"})
                        .done(onDone)
                        .fail(onFail);

                    request = jasmine.Ajax.requests.mostRecent();
                    expect(request.url).toBe(baseUrl);
                    expect(request.method).toBe(httpVerbs.PATCH);
                    expect(request.requestHeaders).toBeDefined();
                    expect(validateHeadersFromConfiguration(client._configuration, request.requestHeaders)).toBe(true);
                    expect(request.requestHeaders["headerTest"]).toBeDefined();
                    expect(request.requestHeaders["headerTest"]).toBe("value");

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

            describe("HttpClient.prototype.withQueryStringParam", function () {

                beforeEach(function () {
                    jasmine.Ajax.install();
                    onDone = jasmine.createSpy('onDone');
                    onFail = jasmine.createSpy('onFail');

                    var client = new HttpClient().withQueryStringParam("withParam", "withValue");
                    client.get(baseUrl, {paramTest: "value"}, {headerTest: "value"})
                        .done(onDone)
                        .fail(onFail);

                    request = jasmine.Ajax.requests.mostRecent();
                    expect(request.url).toBe(baseUrl + '?withParam=withValue&paramTest=value');
                    expect(request.method).toBe(httpVerbs.GET);
                    expect(request.requestHeaders).toBeDefined();
                    expect(validateHeadersFromConfiguration(client._configuration, request.requestHeaders)).toBe(true);
                    expect(request.requestHeaders["headerTest"]).toBeDefined();
                    expect(request.requestHeaders["headerTest"]).toBe("value");
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

            describe("HttpClient.prototype.withQueryStringParam", function () {

                beforeEach(function () {
                    jasmine.Ajax.install();
                    onDone = jasmine.createSpy('onDone');
                    onFail = jasmine.createSpy('onFail');

                    var client = new HttpClient().withQueryStringParams({
                        "withParam1": "withValue1",
                        "withParam2": 123
                    });
                    client.get(baseUrl, {paramTest: "value"}, {headerTest: "value"})
                        .done(onDone)
                        .fail(onFail);

                    request = jasmine.Ajax.requests.mostRecent();
                    expect(request.url).toBe(baseUrl + '?withParam1=withValue1&withParam2=123&paramTest=value');
                    expect(request.method).toBe(httpVerbs.GET);
                    expect(request.requestHeaders).toBeDefined();
                    expect(validateHeadersFromConfiguration(client._configuration, request.requestHeaders)).toBe(true);
                    expect(request.requestHeaders["headerTest"]).toBeDefined();
                    expect(request.requestHeaders["headerTest"]).toBe("value");
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

            describe("HttpClient.prototype.withHeader", function () {

                beforeEach(function () {
                    jasmine.Ajax.install();
                    onDone = jasmine.createSpy('onDone');
                    onFail = jasmine.createSpy('onFail');

                    var authToken = "Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==",
                        client = new HttpClient().withHeader(httpHeaders.AUTHORIZATION, authToken);
                    client.put(baseUrl, {key1: "value"}, {headerTest: "value"})
                        .done(onDone)
                        .fail(onFail);

                    request = jasmine.Ajax.requests.mostRecent();
                    expect(request.url).toBe(baseUrl);
                    expect(request.method).toBe(httpVerbs.PUT);
                    expect(request.requestHeaders).toBeDefined();
                    expect(validateHeadersFromConfiguration(client._configuration, request.requestHeaders)).toBe(true);
                    expect(request.requestHeaders["headerTest"]).toBe("value");
                    expect(request.requestHeaders[httpHeaders.AUTHORIZATION]).toBe(authToken);
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

            describe("HttpClient.prototype.withHeaders", function () {

                beforeEach(function () {
                    jasmine.Ajax.install();
                    onDone = jasmine.createSpy('onDone');
                    onFail = jasmine.createSpy('onFail');

                    var authToken = "Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==",
                        client = new HttpClient().withHeaders({
                            "Authorization": authToken,
                            "Range": "bytes=500-999"
                        });
                    client.put(baseUrl, {key1: "value"}, {headerTest: "value"})
                        .done(onDone)
                        .fail(onFail);

                    request = jasmine.Ajax.requests.mostRecent();
                    expect(request.url).toBe(baseUrl);
                    expect(request.method).toBe(httpVerbs.PUT);
                    expect(request.requestHeaders).toBeDefined();
                    expect(validateHeadersFromConfiguration(client._configuration, request.requestHeaders)).toBe(true);
                    expect(request.requestHeaders["headerTest"]).toBe("value");
                    expect(request.requestHeaders[httpHeaders.AUTHORIZATION]).toBe(authToken);
                    expect(request.requestHeaders[httpHeaders.RANGE]).toBe("bytes=500-999");
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
        });
    });

    function validateHeadersFromConfiguration(configuration, headers) {
        system.guard.argumentIsDefined(configuration, "configuration");
        system.guard.argumentIsDefined(headers, "headers");

        var isValid = 1;
        if(configuration.accept && headers[httpHeaders.ACCEPT] !== configuration.accept) {
            isValid &= 0;
        }
//        if(configuration.acceptCharset && headers[httpHeaders.ACCEPT_CHARSET] !== configuration.acceptCharset) {
//            isValid &= 0;
//        }
        if(configuration.contentType &&
            configuration.contentTypeCharset)
            {
                if(headers[httpHeaders.CONTENT_TYPE] !== system.stringFormat("?; charset=?", configuration.contentType, configuration.contentTypeCharset)) {
                    isValid &= 0;
                }

        } else if (configuration.contentType) {
            if(headers[httpHeaders.CONTENT_TYPE] !== configuration.contentType) {
                isValid &= 0;
            }

        }
        if(!configuration.cache && headers[httpHeaders.CACHE_CONTROL] !== constants.http.cacheControls.NO_CACHE) {
            isValid &= 0;
        }

        return new Boolean(isValid).toString() === "true";
    }
});