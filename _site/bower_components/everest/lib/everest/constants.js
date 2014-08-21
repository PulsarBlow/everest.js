define(function () {
    "use strict";

    var constants = {
        /**
         * Value for an empty (non initialized) UUID
         *
         * @const
         * @type {string}
         */
        UUID_EMPTY: "00000000-0000-0000-0000-000000000000",

        protocols: {
            HTTP: "http:",
            HTTPS: "https:"
        },

        dataFormats: {
            JSON: "json",
            FORM: "form",
            XML: "xml",
            ATOM: "atom"
        },

        dataEncodings: {
            UTF8: "utf-8"
        },

        http: {

            headers: {

                AUTHORIZATION: "Authorization",
                CONTENT_MD5: "Content-MD5",
                CONTENT_TYPE: "Content-Type",
                CACHE_CONTROL: "Cache-Control",
                DATE: "Date",
                ETAG: "ETag",
                USER_AGENT: "User-Agent",
                ACCEPT: "Accept",
                ACCEPT_CHARSET: "Accept-Charset",
                HOST: "Host",
                RANGE: "Range"
            },

            verbs: {
                GET: "GET",
                POST: "POST",
                PUT: "PUT",
                DELETE: "DELETE",
                HEAD: "HEAD",
                MERGE: "MERGE",
                PATCH: "PATCH"
            },

            statusCodes: {
                OK: 200,
                CREATED: 201,
                ACCEPTED: 202,
                NO_CONTENT: 204,
                PARTIAL_CONTENT: 206,
                BAD_REQUEST: 400,
                UNAUTHORIZED: 401,
                FORBIDDEN: 403,
                NOT_FOUND: 404,
                CONFLICT: 409,
                LENGTH_REQUIRED: 411,
                PRECONDITION_FAILED: 412
            },

            contentTypes: {
                TEXT: "text/plain",
                HTML: "text/html",
                XML: "application/xml",
                FORM: "application/x-www-form-urlencoded",
                ATOM: "application/atom+xml",
                JSON: "application/json"
            },

            charsets: {
                UTF8: "utf-8"
            },

            cacheControls: {

                /**
                 * Tells the server or the client to validate the cahce content using the If-.. headers
                 */
                NO_CACHE: "no-cache",

                /**
                 * Instruct the server or the client that the content is stale and should validated before using it
                 */
                INVALIDATE: "max-age=0",

                /**
                 * Instruct a browser application to make a best effort not to write content to disk.
                 */
                NO_STORE: "no-store"
            }
        },

        everest: {
            environments: {
                DEBUG: "DEBUG",
                RELEASE: "RELEASE"
            },
            USERAGENT_HEADER: "X-Alt-User-Agent",
            USERAGENT_HEADER_FORMAT: "Everest.js/? (+https://github.com/PulsarBlow/everest.js)"
        }
    };

    return constants;
});