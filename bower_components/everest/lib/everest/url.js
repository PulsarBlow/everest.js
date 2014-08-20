define(function() {
    function URL(uri) {
        var parser = document.createElement('a');
        parser.href = uri;

        this.protocol = parser.protocol;
        this.hostname = parser.hostname;
        this.port = parser.port;
        this.pathname = parser.pathname;
        this.search = parser.search;
        this.hash = parser.hash;
        this.host = parser.host;
        this.username = parser.username;
        this.password = parser.password;
    }

    // use native if it exists; otherwise use the shim
    if(window.URL) {
        return window.URL;
    } else {
        return URL;
    }
});