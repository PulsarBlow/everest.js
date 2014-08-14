/*!
 * https://github.com/sadams/lite-url/blob/master/src/lite-url.js
 */

define(function () {
    'use strict';

    /**
     * In memory cache for so we don't parse the same url twice
     * @type {{}}
     */
    var urlCache = {};

    /**
     * For parsing query params out
     * @type {RegExp}
     */
    var queryParser = /(?:^|&)([^&=]*)=?([^&]*)/g;

    /**
     * For parsing a url into component parts
     * there are other parts which are suppressed (?:) but we only want to represent what would be available
     *  from `(new URL(urlstring))` in this api.
     *
     * @type {RegExp}
     */
    var uriParser = /^(?:(?:(([^:\/#\?]+:)?(?:(?:\/\/)(?:(?:(?:([^:@\/#\?]+)(?:\:([^:@\/#\?]*))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((?:\/?(?:[^\/\?#]+\/+)*)(?:[^\?#]*)))?(\?[^#]+)?)(#.*)?/;
    var keys = [
        "href",                    // http://user:pass@host.com:81/directory/file.ext?query=1#anchor
        "origin",                  // http://user:pass@host.com:81
        "protocol",                // http:
        "username",                // user
        "password",                // pass
        "host",                    // host.com:81
        "hostname",                // host.com
        "port",                    // 81
        "pathname",                // /directory/file.ext
        "search",                  // ?query=1
        "hash"                     // #anchor
    ];


    /**
     * Uri parsing method.
     *
     * @param str
     * @returns {{
     *   href:string,
     *   origin:string,
     *   protocol:string,
     *   username:string,
     *   password:string,
     *   host:string,
     *   hostname:string,
     *   port:string,
     *   path:string,
     *   search:string,
     *   hash:string,
     *   params:{}
     * }}
     */
    function URL(str) {

        var that = this,
            matches = uriParser.exec(str),
            i = keys.length;

        while (i--) {
            that[keys[i]] = matches[i] || '';
        }

        that.params = {};
        var query = that.search ? that.search.substring(that.search.indexOf('?') + 1) : '';
        query.replace(queryParser, function ($0, $1, $2) {
            if ($1) {
                that.params[$1] = $2;
            }
        });

        that.url = str;
//        that.href = uri.href;
//        that.origin = uri.origin;
//        that.protocol = uri.protocol;
//        that.username = uri.username;
//        that.password = uri.password;
//        that.host = uri.host;
//        that.hostname = uri.hostname;
//        that.port = uri.port;
//        that.pathname = uri.pathname;
//        that.search = uri.search;
//        that.hash = uri.hash;
//        that.params = uri.params;
//        that.url = uri.url;
    }
    URL.prototype.toString = function() {
      return this.url;
    };

    return URL;
});