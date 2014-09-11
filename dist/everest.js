/*!
 * Everest JS - A REST Api client for the browser.
 * Version, see : everest.system.version
 * http://github.com/PulsarBlow/everest.js
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD.
        define(['jquery'], factory);
    } else {
        // Browser globals
        root.ê = factory(root.$);
        root.everest = factory(root.$);
    }
}(this, function ($) {/**
 * @license almond 0.2.9 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);
                name = name.split('/');
                lastIndex = name.length - 1;

                // Node .js allowance:
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                name = baseParts.concat(name);

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("almond", function(){});

define('everest/constants',[],function () {
    

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
/*global define */
define('everest/system',["jquery", "everest/constants"], function ($, constants) {
    

    /**
     * Escape user input to be treated as a literal string within a regular expression.
     * @param string
     * @returns {*|XML|string|void}
     */
    function escapeRegExp(string){
        return string.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
    }

    /**
     * Encodes an URI.
     * @param {string} uri The URI to be encoded.
     * @return {string} The encoded URI.
     */
    function encodeUri(uri) {
        return encodeURIComponent(uri)
            .replace(/!/g, '%21')
            .replace(/'/g, '%27')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
            .replace(/\*/g, '%2A');
    }

    /**
     * Returns true if the given value is a number
     * @param value
     * @returns {boolean}
     */
    function isNumeric(value) {
        return typeof value === 'number' && isFinite(value);
    }

    /**
     * Checks if a value is null
     *
     * @param {object} value The value to check for null or undefined.
     * @return {bool} True if the value is null or undefined, false otherwise.
     */
    function isNull(value) {
        return value === null;
    }

    /**
     * Checks if a value is undefined
     * @param value
     * @returns {Boolean|boolean}
     */
    function isUndefined(value) {
        return value === void 0;
    }

    /**
     * Checks if a value is null or undefined.
     * @param value
     * @returns {Boolean|boolean}
     */
    function isUndefinedOrNull(value) {
        return isNull(value) || isUndefined(value);
    }

    /**
     * Checks if an value is empty.
     * An empty array is length = 0
     * An empty object has no own properties
     * @param {object} value The object to check if it is null.
     * @return {bool} True if the object is empty, false otherwise.
     */
    function isEmpty(value) {

        if (isUndefinedOrNull(value)) {
            return true;
        }

        if (isArray(value) || isString(value)) {
            return value.length === 0;
        }

        // empty object ?
        if (isObject(value)) {
            for (var key in value) {
                if (value.hasOwnProperty(key)) {
                    return false;
                }
            }
            return true;
        }

        return false;
    }

    /**
     * Checks if a value is an object. Note that Javascript arrays and functions are objects,
     * while (normal) strings and numbers are not.
     * @param value
     * @returns {Boolean|boolean}
     */
    function isObject(value) {
        return value === Object(value);
    }

    /**
     * Checks if a value is an array.
     * @param value
     * @returns {Boolean|boolean}
     */
    function isArray(value) {
        return toString.call(value) === "[object Array]";
    }

    /**
     * Determines if an value contains an integer number.
     *
     * @param {object}  value  The object to assert.
     * @return {bool} True if the object contains an integer number; false otherwise.
     */
    function isInt(value) {
        return typeof value === 'number' && parseFloat(value) == parseInt(value, 10) && !isNaN(value);
    }

    /**
     * Determines if a value is a boolean.
     * @param value
     * @returns {Boolean|boolean} True if the value is a boolean; false otherwise.
     */
    function isBoolean(value) {
        if (isUndefinedOrNull(value)) {
            return false;
        }

        return value === true ||
            value === false ||
            toString.call(value) === "[object Boolean]";
    }

    /**
     * Checks if an object is a string.
     *
     * @param {object} value The object to check if it is a string.
     * @return {bool} True if the object is a string, false otherwise.
     */
    function isString(value) {
        if (isUndefinedOrNull(value)) {
            return false;
        }

        return toString.call(value) === "[object String]";
    }

    /**
     * Check if an object is a function
     * @param {object} value The object to check whether it is function
     * @return {bool} True if the specified object is function, otherwise false
     */
    function isFunction(value) {
        if (isUndefinedOrNull(value)) {
            return false;
        }

        return typeof value === "function";
    }

    /**
     * Returns the number of keys (properties) in an object.
     * @param {object} value The object which keys are to be counted.
     * @return {number} The number of keys in the object.
     */
    function objectKeysLength(value) {
        if (isUndefinedOrNull(value) || !isObject(value)) {
            return 0;
        }

        return Object.keys(value).length;
    }

    /**
     * Returns the name of the first property in an object.
     *
     * @param {object} value The object which key is to be returned.
     * @return {number} The name of the first key in the object.
     */
    function objectFirstKey(value) {
        if (!isUndefinedOrNull(value) && isObject(value) && Object.keys(value).length > 0) {
            return Object.keys(value)[0];
        }

        // Object has no properties
        return null;
    }

    /**
     * Checks if a value is an empty string (literally).
     *
     * @param {object} value The value to check for an empty string, null or undefined.
     * @return {bool} True if the value is an empty string, null or undefined, false otherwise.
     */
    function stringIsEmpty(value) {
        return value === "";
    }

    /**
     * Formats a text replacing '?' by the arguments.
     * @param {string}       text      The string where the ? should be replaced.
     * @param {array}        arguments Value(s) to insert in question mark (?) parameters.
     * @return {string}
     */
    function stringFormat(text) {
        if (arguments.length > 1) {
            for (var i = 0; text.indexOf('?') !== -1; i++) {
                var value = arguments[i + 1];
                text = text.replace('?', isUndefinedOrNull(value) ? "" : value);
            }
        }

        return text;
    }

    /**
     * Trims the pattern from the beginning of a string
     * @param {string} text The string where to search and replace
     * @param {string} pattern The pattern to look up
     * @returns {string} The cleaned-up string
     */
    function stringTrimStart(text, pattern) {
        if(isEmpty(text) || isEmpty(pattern)) {
            return text;
        }
        var esc = escapeRegExp(pattern);
        var reg = !esc ? new RegExp("^\\s+") : new RegExp("^"+esc+"+");
        return text.replace(reg, "");
    }

    /**
     * Trims the pattern from the end of a string
     * @param {string} text The string where to search and replace
     * @param {string} pattern The pattern to look up
     * @returns {string} The cleaned-up string
     */
    function stringTrimEnd(text, pattern) {
        if(isEmpty(text) || isEmpty(pattern)) {
            return text;
        }
        var esc = escapeRegExp(pattern),
            reg = !esc ? new RegExp("\\s+$") : new RegExp(esc+"+$");
        return text.replace(reg, "");
    }

    /**
     * Trim the pattern from the beginning and the end of a string
     * @param {string} text The string where to search and replace
     * @param {string} pattern The pattern to look up
     * @returns {string} The cleaned-up string
     */
    function stringTrim(text, pattern) {
        if(isEmpty(text) || isEmpty(pattern)) {
            return text;
        }
        var esc = escapeRegExp(pattern),
            reg = !esc ? new RegExp("^\\s+|\\s+$", "g") :
                new RegExp("^"+ esc + "+|"+esc+"+$", "g");
        return text.replace(reg, "");
    }

    /**
     * Determines if a string starts with another.
     * @param {string}       text      The string to assert.
     * @param {string}       prefix    The string prefix.
     * @return {bool} True if the string starts with the prefix; false otherwise.
     */
    function stringStartsWith(text, prefix) {
        if (isEmpty(prefix)) {
            return true;
        }

        return text.substr(0, prefix.length) === prefix;
    }

    /**
     * Determines if a string ends with another.
     * @param {string}       text      The string to assert.
     * @param {string}       suffix    The string suffix.
     * @return {bool} True if the string ends with the suffix; false otherwise.
     */
    function stringEndsWith(text, suffix) {
        if (isEmpty(suffix)) {
            return true;
        }

        return text.substr(text.length - suffix.length) === suffix;
    }

    /**
     * Determines if a string contains the given pattern
     * @param {string} value The value where to search for the pattern
     * @param {string} pattern The pattern which should be look up for
     * @return {bool} True if the value contains the pattern
     */
    function stringContains(value, pattern) {
        if(isEmpty(value) || isEmpty(pattern)) {
            return false;
        }

        return value.indexOf(pattern) !== -1;
    }

    /**
     * Serializes an object into a string
     * @param obj
     * @param indent
     * @returns {string} The string representation of the serialized object
     */
    function serialize(obj, indent) {
        if(!indent) { indent = 4; }
        return JSON.stringify(obj, null, indent);
    }

    /**
     * The current version of Everest.js
     * @type {string}
     */
    var version = "1.1.1-alpha";

    /**
     * Returns the current environment
     * @type {string}
     */
    var environment = constants.everest.environments.RELEASE;
    
    var uuid = {
        newUuid: function () {
            /* jshint -W016 */
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        isUuid: function (value) {
            var reg = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            return reg.test(value) || value === constants.UUID_EMPTY;

        },
        empty: constants.UUID_EMPTY
    };

    var system = {

        /**
         * Returns the current environment
         */
        environment: environment,

        /**
         * Returns the current version of Everest.js
         */
        version: version,

        noop: function() {},

        /**
         * Returns a new deferred object
         * @returns {*}
         */
        deferred: function () {
            return $.Deferred();
        },

        /**
         * UUID
         */
        uuid: uuid,

        /**
         * Guards
         */
        guard: {

            /**
             * Ensures that the given argument value is not null,
             * otherwise throws an error
             * @param {*} argValue The argument value
             * @param {string} argName The argument name, to be used in error message
             * @throws {Error} Throws an error if the guarded condition is not respected
             */
            argumentNotNull: function (argValue, argName) {
                if (isUndefinedOrNull(argValue)) {
                    throw new Error(stringFormat("ArgumentNull exception : ? is null", argName));
                }
            },

            /**
             * Ensures that the given argument value is not null or empty,
             * otherwise throws an error
             * @param {*} argValue The argument value
             * @param {string} argName The argument name, to be used in error message
             * @throws {Error} Throws an error if the guarded condition is not respected
             */
            argumentNotNullOrEmpty: function (argValue, argName) {
                var message = stringFormat("ArgumentNull exception : ? is null or empty", argName);
                if (isUndefinedOrNull(argValue)) {
                    throw new Error(message);
                }
                if (isObject(argValue) && isEmpty(argValue)) {
                    throw new Error(message);
                }
                if (isString(argValue) && stringIsEmpty(argValue)) {
                    throw new Error(message);
                }
            },

            /**
             * Ensures that the given argument value is a numeric,
             * otherwise throws an error
             * @param {*} argValue The argument value
             * @param {string} argName The argument name, to be used in error message
             * @throws {Error} Throws an error if the guarded condition is not respected
             */
            argumentIsNumeric: function (argValue, argName) {
                if (!isNumeric(argValue)) {
                    throw new Error(stringFormat("Argument exception : ? is not a number", argName));
                }
            },

            /**
             * Ensures that the given argument value is numeric or undefined,
             * otherwise throws an error
             * @param {*} argValue The argument value
             * @param {string} argName The argument name, to be used in error message
             * @throws {Error} Throws an error if the guarded condition is not respected
             */
            argumentIsNumericOrUndefined: function (argValue, argName) {
                if (!isUndefined(argValue) && !isNumeric(argValue)) {
                    throw new Error(stringFormat("Argument exception : ? is not an optional number", argName));
                }
            },

            /**
             * Ensures that the given argument value is a function,
             * otherwise throws an error
             * @param {*} argValue The argument value
             * @param {string} argName The argument name, to be used in error message
             * @throws {Error} Throws an error if the guarded condition is not respected
             */
            argumentIsFunction: function (argValue, argName) {
                if (!isFunction(argValue)) {
                    throw new Error(stringFormat("Argument exception : ? is not a function", argName));
                }
            },

            /**
             * Ensures that the given argument value is defined,
             * otherwise throws an error
             * @param {*} argValue The argument value
             * @param {string} argName The argument name, to be used in error message
             * @throws {Error} Throws an error if the guarded condition is not respected
             */
            argumentIsDefined: function (argValue, argName) {
                if (isUndefined(argValue)) {
                    throw new Error(stringFormat("Argument exception : ? is undefined", argName));
                }
            }
        },

        /**
         * Returns true if the given value is a number
         * @param value
         * @returns {boolean}
         */
        isNumeric: isNumeric,

        /**
         * Checks if a value is null
         *
         * @param {object} value The value to check for null or undefined.
         * @return {bool} True if the value is null or undefined, false otherwise.
         */
        isNull: isNull,

        /**
         * Checks if a value is undefined
         * @param value
         * @returns {Boolean|boolean}
         */
        isUndefined: isUndefined,

        /**
         * Checks if a value is null or undefined.
         * @param value
         * @returns {Boolean|boolean}
         */
        isUndefinedOrNull: isUndefinedOrNull,

        /**
         * Checks if an value is empty.
         * An empty array is length = 0
         * An empty object has no own properties
         * @param {object} value The object to check if it is null.
         * @return {bool} True if the object is empty, false otherwise.
         */
        isEmpty: isEmpty,

        /**
         * Checks if a value is an object. Note that Javascript arrays and functions are objects,
         * while (normal) strings and numbers are not.
         * @param value
         * @returns {Boolean|boolean}
         */
        isObject: isObject,

        /**
         * Checks if a value is an array.
         * @param value
         * @returns {Boolean|boolean}
         */
        isArray: isArray,

        /**
         * Determines if an value contains an integer number.
         *
         * @param {object}  value  The object to assert.
         * @return {bool} True if the object contains an integer number; false otherwise.
         */
        isInt: isInt,

        /**
         * Determines if a value is a boolean.
         * @param value
         * @returns {Boolean|boolean} True if the value is a boolean; false otherwise.
         */
        isBoolean: isBoolean,

        /**
         * Checks if an object is a string.
         *
         * @param {object} value The object to check if it is a string.
         * @return {bool} True if the object is a string, false otherwise.
         */
        isString: isString,

        /**
         * Check if an object is a function
         * @param {object} value The object to check whether it is function
         * @return {bool} True if the specified object is function, otherwise false
         */
        isFunction: isFunction,

        /**
         * Encodes an URI.
         * @param {string} uri The URI to be encoded.
         * @return {string} The encoded URI.
         */
        encodeUri: encodeUri,

        /**
         * Returns the number of keys (properties) in an object.
         * @param {object} value The object which keys are to be counted.
         * @return {number} The number of keys in the object.
         */
        objectKeysLength: objectKeysLength,

        /**
         * Returns the name of the first property in an object.
         *
         * @param {object} value The object which key is to be returned.
         * @return {number} The name of the first key in the object.
         */
        objectFirstKey: objectFirstKey,

        /**
         * Checks if a value is an empty string (literally).
         *
         * @param {object} value The value to check for an empty string, null or undefined.
         * @return {bool} True if the value is an empty string, null or undefined, false otherwise.
         */
        stringIsEmpty: stringIsEmpty,

        /**
         * Formats a text replacing '?' by the arguments.
         * @param {string}       text      The string where the ? should be replaced.
         * @param {array}        arguments Value(s) to insert in question mark (?) parameters.
         * @return {string}
         */
        stringFormat: stringFormat,

        /**
         * Trims the pattern from the beginning of a string
         * @param {string} text The string where to search and replace
         * @param {string} pattern The pattern to look up
         * @returns {string} The cleaned-up string
         */
        stringTrimStart: stringTrimStart,

        /**
         * Trims the pattern from the end of a string
         * @param {string} text The string where to search and replace
         * @param {string} pattern The pattern to look up
         * @returns {string} The cleaned-up string
         */
        stringTrimEnd: stringTrimEnd,

        /**
         * Trim the pattern from the beginning and the end of a string
         * @param {string} text The string where to search and replace
         * @param {string} pattern The pattern to look up
         * @returns {string} The cleaned-up string
         */
        stringTrim: stringTrim,

        /**
         * Determines if a string starts with another.
         * @param {string}       text      The string to assert.
         * @param {string}       prefix    The string prefix.
         * @return {bool} True if the string starts with the prefix; false otherwise.
         */
        stringStartsWith: stringStartsWith,

        /**
         * Determines if a string ends with another.
         * @param {string}       text      The string to assert.
         * @param {string}       suffix    The string suffix.
         * @return {bool} True if the string ends with the suffix; false otherwise.
         */
        stringEndsWith: stringEndsWith,

        /**
         * Determines if a string contains the given pattern
         * @param {string} value The value where to search for the pattern
         * @param {string} pattern The pattern which should be look up for
         * @return {bool} True if the value contains the pattern
         */
        stringContains: stringContains,

        /**
         * Serializes an object into a string
         * @param obj
         * @param indent
         * @returns {string} The string representation of the serialized object
         */
        serialize: serialize,

        /**
         * Returns true if the current environment is DEBUG
         * @returns {boolean} True if the current environment is DEBUG
         */
        isDebug: function() {
            return environment === constants.everest.environments.DEBUG;
        }
    };

    return system;
});
define('everest/url',[],function () {
    

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
     * Create a new Url instance from the given uri
     *
     * @param {string} uri The uri to parse
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
    function URL(uri) {

        var that = this,
            matches = uriParser.exec(uri),
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

        that.url = uri;
    }

    /**
     * Returns the string representation of this Url object
     * @returns {*|URL.url}
     */
    URL.prototype.toString = function() {
      return this.url;
    };

    return URL;
});
define('everest/httpclient',[
    "jquery",
    "everest/constants",
    "everest/system",
    "everest/url"
], function($, constants, system, URL){
    

    var httpHeaders = constants.http.headers,
        httpVerbs = constants.http.verbs,
        httpContentTypes = constants.http.contentTypes,
        httpCharsets = constants.http.charsets,

        defaultConfiguration = {

            /**
             * The default accept header is application/json
             */
            accept: httpContentTypes.JSON,

            /**
             * The default accept-charset is utf-8
             */
            acceptCharset: httpCharsets.UTF8,
            /**
             * The default content type is application/json; charset=utf-8
             */
            contentType: httpContentTypes.JSON,
            /**
             * The default charset appended to content type header
             */
            contentTypeCharset: httpCharsets.UTF8,

            /**
             * Specifies whether GET and HEAD request should be cached
             */
            cache: true,
            /**
             * All request will be made over HTTPS only
             */
            strictSSL: false
        };


    function toJSON(obj) {
        if (!obj) {
            return JSON.stringify({});
        }
        return JSON.stringify(obj);
    }

    function formatData(data) {
        return toJSON(data);
    }

    function formatHeaders(headers) {
        if (!headers) {
            return {};
        }
        return headers;
    }

    function formatContentType(contentType, charset) {
        return system.stringFormat("?; charset=?", contentType, charset);
    }

    function formatUrl(uri, strictSSL) {
        if(!strictSSL) {
            return uri;
        }
        var url = new URL(uri);
        url.protocol = constants.protocols.HTTPS;
        return url.toString();
    }

    function createHeadersFromConfiguration(configuration, existingHeaders) {
        if(!configuration && !existingHeaders) {
            return {};
        } else if (!configuration) {
            return existingHeaders;
        }

        if(!existingHeaders) {
            existingHeaders = formatHeaders(existingHeaders);
        }

        if(configuration.accept) {
            existingHeaders[httpHeaders.ACCEPT] = configuration.accept;
        }
        if(configuration.acceptCharset) {
            // Deactivate that at this time being.
            // Chrome does not let this header to be set
            // http://src.chromium.org/svn/branches/WebKit/375.alt/LayoutTests/http/tests/xmlhttprequest/set-dangerous-headers-expected.txt
            //existingHeaders[httpHeaders.ACCEPT_CHARSET] = configuration.acceptCharset;
        }
        if(configuration.contentType) {
            existingHeaders[httpHeaders.CONTENT_TYPE] = formatContentType(configuration.contentType, configuration.contentTypeCharset);
        }
        if(configuration.cache === false) {
            existingHeaders[httpHeaders.CACHE_CONTROL] = constants.http.cacheControls.NO_CACHE;
        }

        return existingHeaders;
    }

    /**
     * Defines an HttpClient constructor function
     * @param {Object} [configuration] - The HttpClient configuration
     * @constructor
     */
    function HttpClient(configuration) {
        this._query = {};
        this._headers = {};

        // TODO: Find a clean way to add the header if the preflight request allow any headers
        //this._headers[constants.everest.USERAGENT_HEADER] = system.stringFormat(constants.everest.USERAGENT_HEADER_FORMAT, system.version);
        this._configuration = $.extend({}, defaultConfiguration, configuration);
    }

    /**
     * Adds one query string parameter to the client which will be appended to each request executions
     * @param {string} name - Query string parameter name
     * @param {string|Number} value - Query string parameter value
     * @returns {HttpClient} - Returns the current HttpClient instance, allowing expression chaining.
     */
    HttpClient.prototype.withQueryStringParam = function(name, value) {
        if(system.isEmpty(name)) {
            return this;
        }
        if(!this._query) {
            this._query = {};
        }
        this._query[name] = value;

        return this;
    };

    /**
     * Adds a set of query string parameters to the client which will be appended to each request executions
     * @param {Object} params - An object containing the key/value pairs to add
     */
    HttpClient.prototype.withQueryStringParams = function(params) {
        if(system.isEmpty(params)) {
            return this;
        }
        if(!this._query) {
            this._query = {};
        }

        this._query = $.extend({}, this._query, params);

        return this;
    };

    /**
     * Adds one header to the client which will be appended to each request executions
     * @param {string} name - Header name
     * @param {string|Number} value - Header value
     * @returns {HttpClient} - Returns the current HttpClient instance, allowing expression chaining.
     */
    HttpClient.prototype.withHeader = function(name, value) {
        if(system.isEmpty(name)) {
            return this;
        }
        if(!this._headers) {
            this._headers = {};
        }
        this._headers[name] = value;

        return this;
    };

    /**
     * Adds a set of headers to the client which will be appended to each request executions
     * @param {Object} headers - An object containing the key/value pairs to add
     */
    HttpClient.prototype.withHeaders = function(headers) {
        if(system.isEmpty(headers)) {
            return this;
        }
        if(!this._headers) {
            this._headers = {};
        }

        this._headers = $.extend({}, this._headers, headers);

        return this;
    };

    /**
     * Executes a GET HTTP request using the configuration of this client instance.
     * @param {string} url - The url where to send the HTTP request
     * @param {Object} [query] - An object containing the query string parameters to be added to this request
     * @param {Object} [headers] - An object containing the headers to be added to this this request
     * @returns {Object} Returns a deferred Promise
     */
    HttpClient.prototype.get = function(url, query, headers) {
        return HttpClient.get(
            formatUrl(url, this._configuration.strictSSL),
            $.extend({}, this._query, query),
            $.extend({}, this._headers, createHeadersFromConfiguration(this._configuration, headers)));
    };

    /**
     * Executes a POST HTTP request using the configuration of this client instance.
     * @param {string} url - The url where to send the HTTP request
     * @param {Object|*} [body] - The body (data) to be added to this request
     * @param {Object} [headers] - An object containing the headers to be added to this request
     * @returns {Object} - Returns a deferred Promise
     */
    HttpClient.prototype.post = function(url, body, headers) {
        return HttpClient.post(
            formatUrl(url, this._configuration.strictSSL),
            body,
            $.extend({}, this._headers, createHeadersFromConfiguration(this._configuration, headers)));
    };

    /**
     * Executes a PUT HTTP request using the configuration of this client instance.
     * @param {string} url - The url where to send the HTTP request
     * @param {Object|*} [body] - The body (data) to be added to this request
     * @param {Object} [headers] - An object containing the headers to be added to this request
     * @returns {Object} - Returns a deferred Promise
     */
    HttpClient.prototype.put = function(url, body, headers) {
        return HttpClient.put(
            formatUrl(url, this._configuration.strictSSL),
            body,
            $.extend({}, this._headers, createHeadersFromConfiguration(this._configuration, headers)));
    };

    /**
     * Executes a PATCH HTTP request using the configuration of this client instance.
     * @param {string} url - The url where to send the HTTP request
     * @param {Object|*} [body] - The body (data) to be added to this request
     * @param {Object} [headers] - An object containing the headers to be added to this request
     * @returns {Object} - Returns a deferred Promise
     */
    HttpClient.prototype.patch = function(url, body, headers) {
        return HttpClient.patch(
            formatUrl(url, this._configuration.strictSSL),
            body,
            $.extend({}, this._headers, createHeadersFromConfiguration(this._configuration, headers)));
    };

    /**
     * Executes a DELETE HTTP request using the configuration of this client instance.
     * @param {string} url - The url where to send the HTTP request
     * @param {Object} [query] - An object containing the query string parameters to be added to this request
     * @param {Object} [headers] - An object containing the headers to be added to this this request
     * @returns {Object} Returns a deferred Promise
     */
    HttpClient.prototype.del = function(url, query, headers) {
      return HttpClient.del(
          formatUrl(url, this._configuration.strictSSL),
          $.extend({}, this._query, query),
          $.extend({}, this._headers, createHeadersFromConfiguration(this._configuration, headers)));
    };

    /**
     * Executes a GET HTTP request
     * @param {string} url - The url where to send this GET HTTP request
     * @param {Object} [query] - An object containing additional query string parameters to be added to this request.
     * @param {Object} [headers] - An object containing additional headers to be added to this request
     * @returns {Object} - Returns a deferred Promise
     */
    HttpClient.get = function (url, query, headers) {
        return $.ajax(url, {
            data: query,
            headers: formatHeaders(headers)
        }).always(function () {
            console.log('[GET] ' + url, { url: url, query: query, headers: headers, args: arguments });
        });
    };

    /**
     * Executes a POST HTTP request
     * @param {string} url - The url where to send the HTTP request
     * @param {Object|*} [body] - The body (data) to be added to this request
     * @param {Object} [headers] - An object containing the headers to be added to this request
     * @returns {Object} - Returns a deferred Promise
     */
    HttpClient.post= function (url, body, headers) {
        return $.ajax({
            url: url,
            data: formatData(body),
            type: httpVerbs.POST,
            contentType: httpContentTypes.JSON,
            dataType: 'json',
            headers: formatHeaders(headers)
        }).always(function () {
            console.log('[POST] ' + url, { url: url, data: body, headers: headers, args: arguments });
        });
    };

    /**
     * Executes a PUT HTTP request
     * @param {string} url - The url where to send the HTTP request
     * @param {Object|*} [body] - The body (data) to be added to this request
     * @param {Object} [headers] - An object containing the headers to be added to this request
     * @returns {Object} - Returns a deferred Promise
     */
    HttpClient.put = function (url, body, headers) {
        return $.ajax({
            url: url,
            data: formatData(body),
            type: httpVerbs.PUT,
            contentType: httpContentTypes.JSON,
            dataType: 'json',
            headers: formatHeaders(headers)
        }).always(function () {
            console.log('[PUT] ' + url, { url: url, data: body, headers: headers, args: arguments });
        });
    };

    /**
     * Executes a DELETE HTTP request
     * @param {string} url - The url where to send this GET HTTP request
     * @param {Object} [query] - An object containing additional query string parameters to be added to this request.
     * @param {Object} [headers] - An object containing additional headers to be added to this request
     * @returns {Object} - Returns a deferred Promise
     */
    HttpClient.del = function (url, query, headers) {
        return $.ajax({
            url: url,
            data: query,
            type: httpVerbs.DELETE,
            contentType: httpContentTypes.JSON,
            dataType: 'json',
            headers: formatHeaders(headers)
        }).always(function () {
            console.log('[DELETE] ' + url, { url: url, query: query, headers: headers, args: arguments });
        });
    };

    /**
     * Executes a PATCH HTTP request
     * @param {string} url - The url where to send the HTTP request
     * @param {Object|*} [body] - The body (data) to be added to this request
     * @param {Object} [headers] - An object containing the headers to be added to this request
     * @returns {Object} - Returns a deferred Promise
     */
    HttpClient.patch = function (url, body, headers) {
        return $.ajax({
            url: url,
            data: formatData(body),
            type: httpVerbs.PATCH,
            contentType: httpContentTypes.JSON,
            dataType: 'json',
            headers: formatHeaders(headers)
        }).always(function () {
            console.log('[PATCH] ' + url, { url: url, data: body, headers: headers, args: arguments });
        });
    };

    return HttpClient;
});
define('everest/restclient',[
    "jquery",
    "everest/constants",
    "everest/system",
    "everest/url",
    "everest/httpclient"
], function ($, constants, system, URL, HttpClient) {
    

    var httpContentTypes = constants.http.contentTypes,
        httpCharsets = constants.http.charsets,
        dataFormats = constants.dataFormats,
        dataEncodings = constants.dataEncodings,
        defaultConfiguration = {
            host: "",
            dataFormat: dataFormats.JSON,
            dataEncoding: constants.http.charsets.UTF8,
            useCache: true,
            useSSL: false
        };

    function createClientConfiguration(restClientConfiguration) {
        if(!restClientConfiguration) {
            return {};
        }
        var httpServiceConfiguration = {};
        if(restClientConfiguration.dataFormat) {
            httpServiceConfiguration["accept"] =
                httpServiceConfiguration["contentType"]
                    = dataFormatToHttpContentType(restClientConfiguration.dataFormat);
        }
        if(restClientConfiguration.dataEncoding) {
            httpServiceConfiguration["acceptCharset"] =
                httpServiceConfiguration["contentTypeCharset"] =
                    dataEncodingToHttpCharset(restClientConfiguration.dataEncoding);
        }
        if(restClientConfiguration.useCache === true) {
            httpServiceConfiguration["cache"] = true;
        }
        if(restClientConfiguration.useSSL === true) {
            httpServiceConfiguration["strictSSL"] = true;
        }
        return httpServiceConfiguration;
    }

    function dataFormatToHttpContentType(dataFormat) {
        if(system.isEmpty(dataFormat)) {
            return httpContentTypes.JSON;
        }
        switch(dataFormat.toLowerCase())
        {
            case dataFormats.XML:
                return httpContentTypes.XML;
            case dataFormats.ATOM:
                return httpContentTypes.ATOM;
            case dataFormats.FORM:
                return httpContentTypes.FORM;
            default:
                return httpContentTypes.JSON;
        }
    }

    function dataEncodingToHttpCharset(dataEncoding) {
        // we only support UTF8 at this time being
        return httpCharsets.UTF8;
    }

    function createBaseUrl(host, useSSL) {
        if(system.isEmpty(host) || system.stringContains(host, "http://") || system.stringContains(host, "https://")) {
            return host;
        }
        return system.stringFormat("??", useSSL ? "https://" : "http://", system.stringTrim(host, "/"));
    }

    function createResourceUrl(baseUrl, path) {
        if(system.isEmpty(baseUrl) || system.isEmpty(path)){
            return baseUrl;
        }
        return system.stringFormat("?/?",
            system.stringTrimEnd(baseUrl, "/"),
            system.stringTrimStart(path, "/")
        );
    }

    function validateConfiguration(configuration) {
        // Do not process in ENV:DEBUG
        if(system.isDebug() || system.isEmpty(configuration)) {
            return;
        }

        if(!system.isObject(configuration)) {
            console.warn("RestClient configuration is not an object", configuration);
        }
        Object.keys(configuration).forEach(function(element, index) {
            if(system.isUndefined(defaultConfiguration[element])) {
                console.warn("RestClient configuration key is not defined (name: %s)", element);
            }
        });
        // @endif
    }

    /**
     * Create a new RestClient
     * @param {Object} [configuration] - The configuration to apply to the new RestClient instance
     * @constructor
     */
    function RestClient(configuration) {
        this._initialize(configuration);
    }

    /**
     * Read a REST resource
     * @access public
     * @param {string} path - Path to the resource
     * @param {Object} query - Additional query parameters to send with the request
     * @returns {Promise} Returns a deferred Promise
     */
    RestClient.prototype.read = function(path, query) {
        return this._httpClient.get(
            createResourceUrl(createBaseUrl(this._configuration.host, this._configuration.useSSL), path),
            query);
    };

    /**
     * Create a new REST resource
     * @access public
     * @param {string} path - Path to the resource
     * @param {Object} data - The data representation of the REST resource
     * @returns {Promise} Returns a deferred Promise
     */
    RestClient.prototype.create = function(path, data) {
        return this._httpClient.post(
            createResourceUrl(createBaseUrl(this._configuration.host, this._configuration.useSSL), path),
            data);
    };

    /**
     * Update an existing REST resource
     * @access public
     * @param {string} path - Path to the resource
     * @param {Object} data - The data representation of the REST resource
     * @returns {Promise} Returns a deferred Promise
     */
    RestClient.prototype.update = function(path, data) {
        return this._httpClient.put(
            createResourceUrl(createBaseUrl(this._configuration.host, this._configuration.useSSL), path),
            data);
    };

    /**
     * Delete a REST resource
     * @access public
     * @param {string} path - Path to the resource
     * @param {Object} query - Additional query parameters to send with the request
     * @returns {Promise} Returns a deferred Promise
     */
    RestClient.prototype.remove = function(path, query) {
        return this._httpClient.del(
            createResourceUrl(createBaseUrl(this._configuration.host, this._configuration.useSSL), path),
            query);
    };

    /**
     * Partially update an existing REST resource
     * @access public
     * @param {string} path - Path to the resource
     * @param {Object} data - The data representation of the REST resource
     * @returns {Promise} Returns a deferred Promise
     */
    RestClient.prototype.partialUpdate = function(path, data) {
      return this._httpClient.patch(
          createResourceUrl(createBaseUrl(this._configuration.host, this._configuration.useSSL), path),
          data);
    };

    /**
     * Apply a new configuration to the current RestClient instance
     * @access public
     * @param {Object} configuration - The configuration to use to reconfigure the RestClient instance
     * @returns {RestClient} Returns the current instance, allowing expression chaining.
     */
    RestClient.prototype.setConfiguration = function(configuration) {
        validateConfiguration(configuration);
        this._configuration = $.extend({}, defaultConfiguration, this._configuration, configuration);
        return this;
    };

    /**
     * Gets the configuration associated to the current RestClient instance
     * @access public
     * @returns {Object} Returns the configuration associated to the current RestClient instance
     */
    RestClient.prototype.getConfiguration = function() {
        return this._configuration;
    };

    /**
     * Add a query string parameter which will be used by the underlying HttpClient.
     * @param {string} name - The name of the query string parameter
     * @param {string} value - The value of the query string parameter
     * @returns {RestClient} Returns the current RestClient instance, allowing expression chaining
     */
    RestClient.prototype.withQueryStringParam = function(name, value) {
        this._httpClient.withQueryStringParam(name, value);
        return this;
    };

    /**
     * Add a set of query string parameters which will be used by the underlying HttpClient.
     * @param {Object} params - An object containing the query string parameters to be added.
     * @returns {RestClient} Returns the current RestClient instance, allowing expression chaining
     */
    RestClient.prototype.withQueryStringParams = function(params) {
        this._httpClient.withQueryStringParams(params);
        return this;
    };

    /**
     * Adds an HTTP header which will be used by the underlying HttpClient
     * @param {string} name - The name of the HTTP header
     * @param {string} value - The value of the HTTP header
     * @returns {RestClient} Returns the current RestClient instance, allowing expression chaining
     */
    RestClient.prototype.withHeader = function(name, value) {
        this._httpClient.withHeader(name, value);
        return this;
    };

    /**
     * Adds a set of HTTP headers which will be used by the underlying HttpClient
     * @param {Object} headers - An object containing the header to be added.
     * @returns {RestClient} Returns the current RestClient instance, allowing expression chaining
     */
    RestClient.prototype.withHeaders = function(headers) {
        this._httpClient.withHeaders(headers);
        return this;
    };

    /**
     * Initialize the current RestClient instance,
     * that is, apply the new configuration and recreate a new instance of the
     * underlying HttpClient
     * @access private
     * @param configuration
     */
    RestClient.prototype._initialize = function(configuration) {
        this.setConfiguration(configuration);
        this._httpClient = new HttpClient(createClientConfiguration(this._configuration));
    };

    return RestClient;
});
/*global define */

/**
 * The main module that defines the public interface for EverestJs,
 * a REST Api client for the browser.
 */
define('everest',['require','jquery','everest/constants','everest/system','everest/url','everest/httpclient','everest/restclient'],function (require) {
    

    var $ = require("jquery"),
        constants = require("everest/constants"),
        system = require("everest/system"),
        URL = require("everest/url"),
        HttpClient = require("everest/httpclient"),
        RestClient = require("everest/restclient");

    // Public API
    return {
        constants: constants,
        system: system,
        URL: URL,
        HttpClient: HttpClient,
        RestClient: RestClient,

        /**
         * Creates a new RestClient
         * @param {*} configuration RestApi client configuration
         */
        createRestClient: function(configuration) {
            return new RestClient(configuration);
        },

        /**
         * Creates a new HttpClient
         * @param configuration
         * @returns {HttpClient}
         */
        createHttpClient: function(configuration) {
          return new HttpClient(configuration);
        }
    };
});
    //Register in the values from the outer closure for common dependencies
    //as local almond modules
    define('jquery', function () {
        return $;
    });

    //Use almond's special top-level, synchronous require to trigger factory
    //functions, get the final module value, and export it as the public
    //value.
    return require('everest');
}));