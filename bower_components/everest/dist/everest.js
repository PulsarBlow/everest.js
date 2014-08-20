/*!
 * Everest JS - A REST Api client for the browser.
 * Version 1.0.0-alpha
 * http://github.com/PulsarBlow/EverestJs
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
                HOST: "Host"
            },

            verbs: {
                GET: "GET",
                POST: "POST",
                PUT: "PUT",
                DELETE: "DELETE",
                HEAD: "HEAD",
                MERGE: "MERGE"
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
                console.log(key);
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
     *
     * @param {string}       text      The string to assert.
     * @param {string}       prefix    The string prefix.
     * @return {Bool} True if the string starts with the prefix; false otherwise.
     */
    function stringStartsWith(text, prefix) {
        if (isEmpty(prefix)) {
            return true;
        }

        return text.substr(0, prefix.length) === prefix;
    }

    /**
     * Determines if a string ends with another.
     *
     * @param {string}       text      The string to assert.
     * @param {string}       suffix    The string suffix.
     * @return {Bool} True if the string ends with the suffix; false otherwise.
     */
    function stringEndsWith(text, suffix) {
        if (isEmpty(suffix)) {
            return true;
        }

        return text.substr(text.length - suffix.length) === suffix;
    }

    var version = "1.0.0-alpha";

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

        version: version,

        deferred: function () {
            return $.Deferred();
        },

        uuid: uuid,

        guard: {
            argumentNotNull: function (argValue, argName) {
                if (isUndefinedOrNull(argValue)) {
                    throw new Error(stringFormat("ArgumentNull exception : ? is null", argName));
                }
            },
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
            argumentIsNumber: function (argValue, argName) {
                if (!isNumeric(argValue)) {
                    throw new Error(stringFormat("Argument exception : ? is not a number", argName));
                }
            },
            argumentIsOptionalNumber: function (argValue, argName) {
                if (!isUndefined(argValue) && !isNumeric(argValue)) {
                    throw new Error(stringFormat("Argument exception : ? is not an optional number", argName));
                }
            },
            argumentIsFunction: function (argValue, argName) {
                if (!isFunction(argValue)) {
                    throw new Error(stringFormat("Argument exception : ? is not a function", argName));
                }
            },
            argumentIsDefined: function (argValue, argName) {
                if (isUndefined(argValue)) {
                    throw new Error(stringFormat("Argument exception : ? is undefined", argName));
                }
            }
        },

        isNumeric: isNumeric,
        isNull: isNull,
        isUndefined: isUndefined,
        isUndefinedOrNull: isUndefinedOrNull,
        isEmpty: isEmpty,
        isObject: isObject,
        isArray: isArray,
        isInt: isInt,
        isBoolean: isBoolean,
        isString: isString,
        isFunction: isFunction,
        encodeUri: encodeUri,
        objectKeysLength: objectKeysLength,
        objectFirstKey: objectFirstKey,
        stringIsEmpty: stringIsEmpty,
        stringFormat: stringFormat,
        stringTrim: stringTrim,
        stringTrimStart: stringTrimStart,
        stringTrimEnd: stringTrimEnd,
        stringStartsWith: stringStartsWith,
        stringEndsWith: stringEndsWith
    };

    return system;
});
define('everest/url',[],function() {
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
            cache: false,
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

    function formatUrl(url, strictSSL) {
        if(!strictSSL) {
            return url;
        }
        var url = new URL(url);
        url.protocol = constants.protocols.HTTPS;
        return url.toString();
    }
    
    function createAjaxOptions(httpServiceConfiguration) {
        return {
            contentType: formatContentType(
                httpServiceConfiguration.contentType,
                httpServiceConfiguration.charset),
            accepts: httpServiceConfiguration.accept
        }
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
     * @param configuration
     * @constructor
     */
    function HttpClient(configuration) {
        this._configuration = $.extend({}, defaultConfiguration, configuration);
    }

    HttpClient.prototype.get = function(url, query, headers) {
        return HttpClient.get(
            formatUrl(url, this._configuration.strictSSL),
            query,
            createHeadersFromConfiguration(this._configuration, headers));
    };

    HttpClient.prototype.post = function(url, body, headers) {
        return HttpClient.post(
            formatUrl(url, this._configuration.strictSSL),
            body,
            createHeadersFromConfiguration(this._configuration, headers));
    };

    HttpClient.prototype.put = function(url, body, headers) {
        return HttpClient.put(
            formatUrl(url, this._configuration.strictSSL),
            body,
            createHeadersFromConfiguration(this._configuration, headers));
    };

    HttpClient.prototype.del = function(url, query, headers) {
      return HttpClient.del(
          formatUrl(url, this._configuration.strictSSL),
          query,
          createHeadersFromConfiguration(this._configuration, headers));
    };

    /**
     * Executes a GET HTTP request
     * @param url
     * @param query
     * @param headers
     * @returns {Promise} Returns a deferred promise
     */
    HttpClient.get = function (url, query, headers) {
        var promise = $.ajax(url, {
            data: query,
            headers: formatHeaders(headers)
        });

        promise.always(function () {
            console.log('[GET] ' + url, { url: url, query: query, headers: headers, args: arguments });
        });

        return promise;
    };

    /**
     * Executes a POST HTTP request
     * @param url
     * @param body
     * @param headers
     * @returns {Promise} Returns a deferred promise
     */
    HttpClient.post= function (url, body, headers) {
        var promise = $.ajax({
            url: url,
            data: formatData(body),
            type: httpVerbs.POST,
            contentType: httpContentTypes.JSON,
            dataType: 'json',
            headers: formatHeaders(headers)
        }).always(function () {
            console.log('[POST] ' + url, { url: url, data: body, headers: headers, args: arguments });
        });

        return promise;
    };

    /**
     * Executes a PUT HTTP request
     * @param url
     * @param body
     * @param headers
     * @returns {Promise} Returns a deferred promise
     */
    HttpClient.put = function (url, body, headers) {
        var promise = $.ajax({
            url: url,
            data: formatData(body),
            type: httpVerbs.PUT,
            contentType: httpContentTypes.JSON,
            dataType: 'json',
            headers: formatHeaders(headers)
        });
        promise.always(function () {
            console.log('[PUT] ' + url, { url: url, data: body, headers: headers, args: arguments });
        });
        return promise;
    };

    /**
     * Executes a DELETE HTTP request
     * @param url
     * @param query
     * @param headers
     * @returns {Promise} Returns a deferred promise
     */
    HttpClient.del = function (url, query, headers) {
        var promise = $.ajax({
            url: url,
            data: query,
            type: httpVerbs.DELETE,
            contentType: httpContentTypes.JSON,
            dataType: 'json',
            headers: formatHeaders(headers)
        });
        promise.always(function () {
            console.log('[DELETE] ' + url, { url: url, query: query, headers: headers, args: arguments });
        });
        return promise;
    };

    return HttpClient;
});
define('everest/restapiclient',[
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
        baseUrl: "",
        dataFormat: dataFormats.JSON,
        dataEncoding: constants.http.charsets.UTF8,
        useCache: false,
        strictSSL: false
    };

    function createHttpServiceConfiguration(restServiceConfiguration) {
        if(!restServiceConfiguration) {
            return {};
        }
        var httpServiceConfiguration = {};
        if(restServiceConfiguration.dataFormat) {
            httpServiceConfiguration["accept"] =
                httpServiceConfiguration["contentType"]
                    = dataFormatToHttpContentType(restServiceConfiguration.dataFormat);
        }
        if(restServiceConfiguration.dataEncoding) {
            httpServiceConfiguration["acceptCharset"] =
                httpServiceConfiguration["contentTypeCharset"] =
                    dataEncodingToHttpCharset(restServiceConfiguration.dataEncoding);
        }
        if(restServiceConfiguration.useCache === true) {
            httpServiceConfiguration["cache"] = true;
        }
        if(restServiceConfiguration.strictSSL === true) {
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

    function createResourceUrl(baseUrl, path) {
        if(system.isEmpty(baseUrl) || system.isEmpty(path)){
            return baseUrl;
        }
        return system.stringFormat("?/?",
            system.stringTrimEnd(baseUrl, "/"),
            system.stringTrimStart(path, "/")
        );
    }

    function RestApiClient(configuration) {
        this._initialize(configuration);
    }

    RestApiClient.prototype.read = function(path, query) {
        return this._httpService.get(
            createResourceUrl(this._configuration.baseUrl, path),
            query);
    };

    RestApiClient.prototype.create = function(path, data) {
        return this._httpService.post(
            createResourceUrl(this._configuration.baseUrl, path),
            data);
    };

    RestApiClient.prototype.update = function(path, data) {
        return this._httpService.put(
            createResourceUrl(this._configuration.baseUrl, path),
            data);
    };

    RestApiClient.prototype.remove = function(path, query) {
        return this._httpService.del(
            createResourceUrl(this._configuration.baseUrl, path),
            query);
    };

    RestApiClient.prototype.setConfiguration = function(configuration) {
        this._configuration = $.extend({}, defaultConfiguration, configuration);
    }
    RestApiClient.prototype.getConfiguration = function() {
        return this._configuration;
    }

    RestApiClient.prototype._initialize = function(configuration) {
        this.setConfiguration(configuration);
        this._httpService = new HttpClient(createHttpServiceConfiguration(this._configuration));
    }

    return RestApiClient;
});
/*global define */

/**
 * The main module that defines the public interface for EverestJs,
 * a REST Api client for the browser.
 */
define('everest',['require','jquery','everest/constants','everest/system','everest/url','everest/httpclient','everest/restapiclient'],function (require) {
    

    var $ = require("jquery"),
        constants = require("everest/constants"),
        system = require("everest/system"),
        URL = require("everest/url"),
        HttpClient = require("everest/httpclient"),
        RestApiClient = require("everest/restapiclient");

    // Public API
    return {
        constants: constants,
        system: system,
        URL: URL,
        HttpClient: HttpClient,
        RestApiClient: RestApiClient
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