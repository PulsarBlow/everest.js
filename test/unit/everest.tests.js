define(['everest'], function (everest) {
    describe("everest", function () {
        it("should be defined", function () {
            expect(everest).toBeDefined();
        });
    });

    describe("everest.createRestClient", function () {
        it("should create a new RestClient properly", function () {
            expect(everest.createRestClient()).toBeTruthy();
            expect(everest.createRestClient({})).toBeTruthy();
            expect(everest.createRestClient({host: "api.github.com", useSSL: true})).toBeTruthy();
        });
    });

    describe("everest.createHttpClient", function () {
        it("should create a new HttpClient properly", function () {
            expect(everest.createHttpClient()).toBeTruthy();
            expect(everest.createHttpClient({})).toBeTruthy();
            expect(everest.createHttpClient({host: "api.github.com", useSSL: true})).toBeTruthy();
        });
    });

    describe("everest RestClient in real conditions", function() {
        var restClient = everest.createRestClient({host: "api.github.com", useSSL:false}),
            githubResult;

//        beforeEach(function (done) {
//            githubResult = null;
//            restClient.read('/repos/PulsarBlow/everestjs').done(function(data) {
//                githubResult = data;
//            }).fail(function() {
//                console.log('failed', arguments);
//            }).always(function() {
//                done();
//            });
//        });

//        it("should read github api properly", function() {
//            restClient.read('/repos/PulsarBlow/everest.js').done(function(data) {
//                console.log('done', arguments);
//            }).fail(function() {
//                console.log('failed', arguments);
//            }).always(function() {
//                console.log('always', arguments);
//            });
//        });


    });
});
