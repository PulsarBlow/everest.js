/*global define */
define(["jquery", "everest/constants"], function ($, constants) {
    "use strict";

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
    
    // @ifdef DEBUG===true
    environment = constants.everest.environments.DEBUG;
    // @endif

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