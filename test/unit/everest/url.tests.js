define(["everest/url"], function (URL) {
    describe("everest.URL", function () {

        it("should be defined", function () {
            expect(URL).toBeDefined();
        });

        it ("should parse properly", function () {
            var url = new URL("https://foo:bar@github.com:2014/PulsarBlow/12345678?foo=bar#test");

            expect(url.protocol).toBe("https:");
            expect(url.hostname).toBe("github.com");
            expect(url.port).toBe("2014");
            expect(url.pathname).toBe("/PulsarBlow/12345678");
            expect(url.search).toBe("?foo=bar");
            expect(url.hash).toBe("#test");
            expect(url.host).toBe("github.com:2014");
            expect(url.username).toBe("foo");
            expect(url.password).toBe("bar");
        });

        it("should be mutable", function() {
            var url = new URL("http://github.com/PulsarBlow");
            url.protocol = "https:";
            expect(url.protocol).toBe("https:");
        });
    });
});