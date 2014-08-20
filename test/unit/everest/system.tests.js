define(["everest/constants", "everest/system"], function (constants, system) {
    describe("everest.system", function () {
        it("system exists", function () {
            expect(system).toBeDefined();
        });

        describe("everest.system type checkers and validators", function () {
            it("isNumeric should behave properly", function () {
                expect(system.isNumeric).toBeDefined();
                expect(system.isNumeric()).toBe(false);
                expect(system.isNumeric(undefined)).toBe(false);
                expect(system.isNumeric(false)).toBe(false);
                expect(system.isNumeric(true)).toBe(false);
                expect(system.isNumeric("")).toBe(false);
                expect(system.isNumeric(" ")).toBe(false);
                expect(system.isNumeric({})).toBe(false);
                expect(system.isNumeric("1")).toBe(false);
                expect(system.isNumeric("12.5")).toBe(false);
                expect(system.isNumeric(1)).toBe(true);
                expect(system.isNumeric(1.5)).toBe(true);
                expect(system.isNumeric(0)).toBe(true);
            });

            it("isNull should behave properly", function () {
                expect(system.isNull).toBeDefined();
                expect(system.isNull()).toBe(false);
                expect(system.isNull(undefined)).toBe(false);
                expect(system.isNull("")).toBe(false);
                expect(system.isNull(" ")).toBe(false);
                expect(system.isNull({})).toBe(false);
                expect(system.isNull(1)).toBe(false);
                expect(system.isNull(0)).toBe(false);
                expect(system.isNull(false)).toBe(false);
                expect(system.isNull(true)).toBe(false);
                expect(system.isNull(null)).toBe(true);
            });

            it("isUndefined should behave properly", function () {
                expect(system.isUndefined).toBeDefined();
                expect(system.isUndefined(null)).toBe(false);
                expect(system.isUndefined("")).toBe(false);
                expect(system.isUndefined(" ")).toBe(false);
                expect(system.isUndefined(1)).toBe(false);
                expect(system.isUndefined(0)).toBe(false);
                expect(system.isUndefined({})).toBe(false);
                expect(system.isUndefined(false)).toBe(false);
                expect(system.isUndefined(true)).toBe(false);
                expect(system.isUndefined()).toBe(true);
                expect(system.isUndefined(undefined)).toBe(true);
            });

            it("isUndefinedOrNull should behave properly", function () {
                expect(system.isUndefinedOrNull).toBeDefined();
                expect(system.isUndefinedOrNull("")).toBe(false);
                expect(system.isUndefinedOrNull(" ")).toBe(false);
                expect(system.isUndefinedOrNull(1)).toBe(false);
                expect(system.isUndefinedOrNull(0)).toBe(false);
                expect(system.isUndefinedOrNull(false)).toBe(false);
                expect(system.isUndefinedOrNull(true)).toBe(false);
                expect(system.isUndefinedOrNull({})).toBe(false);
                expect(system.isUndefinedOrNull()).toBe(true);
                expect(system.isUndefinedOrNull(undefined)).toBe(true);
                expect(system.isUndefinedOrNull(null)).toBe(true);
            });

            it("isEmpty should behave properly", function () {
                expect(system.isEmpty).toBeDefined();
                expect(system.isEmpty(" ")).toBe(false);
                expect(system.isEmpty(1)).toBe(false);
                expect(system.isEmpty(0)).toBe(false);
                expect(system.isEmpty(false)).toBe(false);
                expect(system.isEmpty(true)).toBe(false);
                expect(system.isEmpty("")).toBe(true);
                expect(system.isEmpty()).toBe(true);
                expect(system.isEmpty(undefined)).toBe(true);
                expect(system.isEmpty(null)).toBe(true);
                expect(system.isEmpty({})).toBe(true);
            });

            it("isObject should behave properly", function () {
                expect(system.isObject).toBeDefined();
                expect(system.isObject()).toBe(false);
                expect(system.isObject(undefined)).toBe(false);
                expect(system.isObject(null)).toBe(false);
                expect(system.isObject("")).toBe(false);
                expect(system.isObject(" ")).toBe(false);
                expect(system.isObject(true)).toBe(false);
                expect(system.isObject(false)).toBe(false);
                expect(system.isObject(1)).toBe(false);
                expect(system.isObject([])).toBe(true);
                expect(system.isObject({})).toBe(true);
            });

            it("isArray should behave properly", function () {
                expect(system.isArray).toBeDefined();
                expect(system.isArray()).toBe(false);
                expect(system.isArray(undefined)).toBe(false);
                expect(system.isArray(null)).toBe(false);
                expect(system.isArray("")).toBe(false);
                expect(system.isArray(" ")).toBe(false);
                expect(system.isArray(false)).toBe(false);
                expect(system.isArray(true)).toBe(false);
                expect(system.isArray(1)).toBe(false);
                expect(system.isArray(1.1)).toBe(false);
                expect(system.isArray(function () {
                })).toBe(false);
                expect(system.isArray({})).toBe(false);
                expect(system.isArray([])).toBe(true);
            });

            it("isInt should behave properly", function () {
                expect(system.isInt).toBeDefined();
                expect(system.isInt()).toBe(false);
                expect(system.isInt(undefined)).toBe(false);
                expect(system.isInt(null)).toBe(false);
                expect(system.isInt("")).toBe(false);
                expect(system.isInt(" ")).toBe(false);
                expect(system.isInt(false)).toBe(false);
                expect(system.isInt(true)).toBe(false);
                expect(system.isInt(function () {
                })).toBe(false);
                expect(system.isInt({})).toBe(false);
                expect(system.isInt([])).toBe(false);
                expect(system.isInt(1.1)).toBe(false);
                expect(system.isInt("1")).toBe(false);
                expect(system.isInt(1)).toBe(true);
            });

            it("isBoolean should behave properly", function () {
                expect(system.isBoolean).toBeDefined();
                expect(system.isBoolean()).toBe(false);
                expect(system.isBoolean(undefined)).toBe(false);
                expect(system.isBoolean(null)).toBe(false);
                expect(system.isBoolean("")).toBe(false);
                expect(system.isBoolean(" ")).toBe(false);
                expect(system.isBoolean(function () {
                })).toBe(false);
                expect(system.isBoolean({})).toBe(false);
                expect(system.isBoolean([])).toBe(false);
                expect(system.isBoolean(1.1)).toBe(false);
                expect(system.isBoolean("1")).toBe(false);
                expect(system.isBoolean(1)).toBe(false);
                expect(system.isBoolean(false)).toBe(true);
                expect(system.isBoolean(true)).toBe(true);
                expect(system.isBoolean(new Boolean(1))).toBe(true);
            });

            it("isString should behave properly", function () {
                expect(system.isString).toBeDefined();
                expect(system.isString()).toBe(false);
                expect(system.isString(undefined)).toBe(false);
                expect(system.isString(null)).toBe(false);
                expect(system.isString(false)).toBe(false);
                expect(system.isString(true)).toBe(false);
                expect(system.isString(function () {
                })).toBe(false);
                expect(system.isString({})).toBe(false);
                expect(system.isString([])).toBe(false);
                expect(system.isString(1.1)).toBe(false);
                expect(system.isString(1)).toBe(false);

                expect(system.isString("")).toBe(true);
                expect(system.isString(" ")).toBe(true);
                expect(system.isString("1")).toBe(true);
            });

            it("isFunction should behave properly", function () {
                expect(system.isFunction).toBeDefined();
                expect(system.isFunction()).toBe(false);
                expect(system.isFunction(undefined)).toBe(false);
                expect(system.isFunction(null)).toBe(false);
                expect(system.isFunction(false)).toBe(false);
                expect(system.isFunction(true)).toBe(false);
                expect(system.isFunction({})).toBe(false);
                expect(system.isFunction([])).toBe(false);
                expect(system.isFunction(1.1)).toBe(false);
                expect(system.isFunction(1)).toBe(false);
                expect(system.isFunction("")).toBe(false);
                expect(system.isFunction(" ")).toBe(false);
                expect(system.isFunction("1")).toBe(false);

                expect(system.isFunction(function () {
                })).toBe(true);
                expect(system.isFunction(system.isFunction)).toBe(true);
            });

            it("objectKeysLength should behave properly", function () {
                expect(system.objectKeysLength).toBeDefined();
                expect(system.objectKeysLength()).toBe(0);
                expect(system.objectKeysLength(undefined)).toBe(0);
                expect(system.objectKeysLength(null)).toBe(0);
                expect(system.objectKeysLength(false)).toBe(0);
                expect(system.objectKeysLength(true)).toBe(0);
                expect(system.objectKeysLength([])).toBe(0);
                expect(system.objectKeysLength(1.1)).toBe(0);
                expect(system.objectKeysLength(1)).toBe(0);
                expect(system.objectKeysLength("")).toBe(0);
                expect(system.objectKeysLength(" ")).toBe(0);
                expect(system.objectKeysLength("1")).toBe(0);
                expect(system.objectKeysLength({})).toBe(0);
                expect(system.objectKeysLength({prop: "value"})).toBe(1);
            });

            it("objectFirstKey should behave properly", function () {
                expect(system.objectFirstKey).toBeDefined();
                expect(system.objectFirstKey()).toBeNull();
                expect(system.objectFirstKey(undefined)).toBeNull();
                expect(system.objectFirstKey(null)).toBeNull();
                expect(system.objectFirstKey(false)).toBeNull();
                expect(system.objectFirstKey(true)).toBeNull();
                expect(system.objectFirstKey([])).toBeNull();
                expect(system.objectFirstKey(1.1)).toBeNull();
                expect(system.objectFirstKey(1)).toBeNull();
                expect(system.objectFirstKey("")).toBeNull();
                expect(system.objectFirstKey(" ")).toBeNull();
                expect(system.objectFirstKey("1")).toBeNull();
                expect(system.objectFirstKey({})).toBeNull();
                expect(system.objectFirstKey({prop: "value"})).toBe("prop");
            });

            it("stringIsEmpty should behave properly", function () {
                expect(system.stringIsEmpty).toBeDefined();
                expect(system.stringIsEmpty()).toBe(false);
                expect(system.stringIsEmpty(undefined)).toBe(false);
                expect(system.stringIsEmpty(null)).toBe(false);
                expect(system.stringIsEmpty(false)).toBe(false);
                expect(system.stringIsEmpty(true)).toBe(false);
                expect(system.stringIsEmpty([])).toBe(false);
                expect(system.stringIsEmpty(1.1)).toBe(false);
                expect(system.stringIsEmpty(1)).toBe(false);
                expect(system.stringIsEmpty(" ")).toBe(false);
                expect(system.stringIsEmpty("1")).toBe(false);
                expect(system.stringIsEmpty({})).toBe(false);
                expect(system.stringIsEmpty({prop: "value"})).toBe(false);

                expect(system.stringIsEmpty("")).toBe(true);
            });

            it("stringFormat should behave properly", function () {
                expect(system.stringFormat).toBeDefined();
                expect(system.stringFormat("?\??", "A", "B", "c")).toBe("A\Bc");
                expect(system.stringFormat("???", "A", "B")).toBe("AB");
                expect(system.stringFormat("??", "A", "B", "C")).toBe("AB");
            });

            it("stringTrimStart should behave properly", function () {
                expect(system.stringTrimStart).toBeDefined();
                expect(system.stringTrimStart("$text", "$")).toBe("text");
                expect(system.stringTrimStart("$text$", "$")).toBe("text$");
                expect(system.stringTrimStart("^text", "^")).toBe("text");
                expect(system.stringTrimStart("+text", "+")).toBe("text");
                expect(system.stringTrimStart(".text", ".")).toBe("text");
                expect(system.stringTrimStart("?text", "?")).toBe("text");
                expect(system.stringTrimStart("*text", "*")).toBe("text");
                expect(system.stringTrimStart(" text", " ")).toBe("text");
                expect(system.stringTrimStart("/text", "/")).toBe("text");
                expect(system.stringTrimStart("/tmp_text", "/tmp_")).toBe("text");
            });

            it("stringTrimEnd should behave properly", function () {
                expect(system.stringTrimEnd).toBeDefined();
                expect(system.stringTrimEnd("text$", "$")).toBe("text");
                expect(system.stringTrimEnd("$text$", "$")).toBe("$text");
                expect(system.stringTrimEnd("text^", "^")).toBe("text");
                expect(system.stringTrimEnd("text+", "+")).toBe("text");
                expect(system.stringTrimEnd("text.", ".")).toBe("text");
                expect(system.stringTrimEnd("text?", "?")).toBe("text");
                expect(system.stringTrimEnd("text*", "*")).toBe("text");
                expect(system.stringTrimEnd("text ", " ")).toBe("text");
                expect(system.stringTrimEnd("text/", "/")).toBe("text");
                expect(system.stringTrimEnd("text/tmp_", "/tmp_")).toBe("text");
            });

            it("stringTrim should behave properly", function () {
                expect(system.stringTrim).toBeDefined();
                expect(system.stringTrim("$text", "$")).toBe("text");
                expect(system.stringTrim("text$", "$")).toBe("text");
                expect(system.stringTrim("$text$", "$")).toBe("text");
                expect(system.stringTrim("^text", "^")).toBe("text");
                expect(system.stringTrim("text^", "^")).toBe("text");
                expect(system.stringTrim("^text^", "^")).toBe("text");
                expect(system.stringTrim("+text", "+")).toBe("text");
                expect(system.stringTrim("text+", "+")).toBe("text");
                expect(system.stringTrim("+text+", "+")).toBe("text");
                expect(system.stringTrim(".text", ".")).toBe("text");
                expect(system.stringTrim("text.", ".")).toBe("text");
                expect(system.stringTrim(".text.", ".")).toBe("text");
                expect(system.stringTrim("?text", "?")).toBe("text");
                expect(system.stringTrim("text?", "?")).toBe("text");
                expect(system.stringTrim("?text?", "?")).toBe("text");
                expect(system.stringTrim("*text", "*")).toBe("text");
                expect(system.stringTrim("text*", "*")).toBe("text");
                expect(system.stringTrim("*text*", "*")).toBe("text");
                expect(system.stringTrim(" text", " ")).toBe("text");
                expect(system.stringTrim("text ", " ")).toBe("text");
                expect(system.stringTrim(" text ", " ")).toBe("text");
                expect(system.stringTrim("/text", "/")).toBe("text");
                expect(system.stringTrim("text/", "/")).toBe("text");
                expect(system.stringTrim("/text/", "/")).toBe("text");
                expect(system.stringTrim("/tmp_text", "/tmp_")).toBe("text");
                expect(system.stringTrim("text/tmp_", "/tmp_")).toBe("text");
                expect(system.stringTrim("/tmp_text/tmp_", "/tmp_")).toBe("text");
            });

            it("stringStartsWith should behave properly", function () {
                expect(system.stringStartsWith).toBeDefined();
                expect(system.stringStartsWith("text")).toBe(true);
                expect(system.stringStartsWith("text", undefined)).toBe(true);
                expect(system.stringStartsWith("text", null)).toBe(true);
                expect(system.stringStartsWith("text", "")).toBe(true);
                expect(system.stringStartsWith("text", " ")).toBe(false);
                expect(system.stringStartsWith("text", "te")).toBe(true);
                expect(system.stringStartsWith("text", "xt")).toBe(false);
            });

            it("stringEndsWith should behave properly", function () {
                expect(system.stringEndsWith).toBeDefined();
                expect(system.stringEndsWith("text")).toBe(true);
                expect(system.stringEndsWith("text", undefined)).toBe(true);
                expect(system.stringEndsWith("text", null)).toBe(true);
                expect(system.stringEndsWith("text", "")).toBe(true);
                expect(system.stringEndsWith("text", " ")).toBe(false);
                expect(system.stringEndsWith("text", "te")).toBe(false);
                expect(system.stringEndsWith("text", "xt")).toBe(true);
            });

            it("stringContains should behave properly", function() {
               expect(system.stringContains).toBeDefined();
                expect(system.stringContains()).toBe(false);
                expect(system.stringContains(null)).toBe(false);
                expect(system.stringContains(null, null)).toBe(false);
                expect(system.stringContains("value")).toBe(false);
                expect(system.stringContains("value", null)).toBe(false);
                expect(system.stringContains("value", undefined)).toBe(false);
                expect(system.stringContains("value", "")).toBe(false);
                expect(system.stringContains("value", 1)).toBe(false);
                expect(system.stringContains("value1", "1")).toBe(true);
                expect(system.stringContains("value1", 1)).toBe(true);
                expect(system.stringContains("1value1", 1)).toBe(true);
                expect(system.stringContains("1value", 1)).toBe(true);
                expect(system.stringContains("value 1 ", 1)).toBe(true);
            });
        });

        describe("everest.system.version", function () {
            it("system has a version", function () {
                expect(system.version).toBeTruthy();
            });
        });


        describe("everest.system.deferred", function () {
            var dfdDone = system.deferred(),
                dfdFail = system.deferred();


            it("promise should be resolved", function () {
                var dfd = system.deferred(),
                    promise = dfd.promise(),
                    resolvedValue;

                promise.done(function (value) {
                    resolvedValue = value;
                });

                expect(resolvedValue).toBeUndefined();
                dfd.resolve(123);
                expect(resolvedValue).toEqual(123);
            });

            it("promise should be rejected", function () {
                var dfd = system.deferred(),
                    promise = dfd.promise(),
                    resolvedValue;

                promise.fail(function (value) {
                    resolvedValue = value;
                });

                expect(resolvedValue).toBeUndefined();
                dfd.reject(123);
                expect(resolvedValue).toEqual(123);
            });
        });

        describe("everest.system.uuid", function () {
            var uuid = system.uuid;

            if ("uuid should exist", function () {
                expect(uuid).not.toBeNull();
                expect(uuid).not.toBeUndefined();
                expect(typeof uuid).equal("object");
            });

            it("newUuid() should generates a valid new uuid", function () {
                var id = uuid.newUuid()
                expect(id).toBeDefined();
                expect(id).not.toBeNull();
                expect(id).toBeTruthy();

            });

            it("isUuid() should validate uuid correctly", function () {
                expect(uuid.isUuid("00000000-0000-0000-0000-000000000000")).toBe(true);
                expect(uuid.isUuid(uuid.newUuid())).toBe(true);
            });

            it("empty is provided, constant and valid", function () {
                expect(uuid.empty).toBe("00000000-0000-0000-0000-000000000000");
            });
        });

        describe("everest.system.guard", function () {
            var guard = system.guard;

            it("guard should exist", function () {
                expect(guard).not.toBeNull();
                expect(guard).not.toBeUndefined();
                expect(typeof guard).toBe("object");
            });

            it("argumentNotNull should behave properly", function () {
                expect(function () {
                    guard.argumentNotNull(null, "argName")
                }).toThrow();
                expect(function () {
                    guard.argumentNotNull(undefined, "argName")
                }).toThrow();
                expect(function () {
                    guard.argumentNotNull("", "argName")
                }).not.toThrow();
                expect(function () {
                    guard.argumentNotNull(true, "argName")
                }).not.toThrow();
            });

            it("argumentNotNullOrEmpty should behave properly", function () {
                expect(function () {
                    guard.argumentNotNullOrEmpty(null, "argName")
                }).toThrow();
                expect(function () {
                    guard.argumentNotNullOrEmpty(undefined, "argName")
                }).toThrow();
                expect(function () {
                    guard.argumentNotNullOrEmpty("", "argName")
                }).toThrow();
                expect(function () {
                    guard.argumentNotNullOrEmpty(" ", "argName")
                }).not.toThrow();
                expect(function () {
                    guard.argumentNotNullOrEmpty(true, "argName")
                }).not.toThrow();
            });

            it("argumentIsNumber should behave properly", function () {
                expect(function () {
                    guard.argumentIsNumeric(null, "argName")
                }).toThrow();
                expect(function () {
                    guard.argumentIsNumeric(undefined, "argName")
                }).toThrow();
                expect(function () {
                    guard.argumentIsNumeric("", "argName")
                }).toThrow();
                expect(function () {
                    guard.argumentIsNumeric("XE12", "argName")
                }).toThrow();
                expect(function () {
                    guard.argumentIsNumeric("12", "argName")
                }).toThrow();
                expect(function () {
                    guard.argumentIsNumeric(12, "argName")
                }).not.toThrow();
                expect(function () {
                    guard.argumentIsNumeric(12.1, "argName")
                }).not.toThrow();
            });

            it("argumentIsNumericOrUndefined should behave properly", function () {
                expect(function () {
                    guard.argumentIsNumericOrUndefined(null, "argName")
                }).toThrow();
                expect(function () {
                    guard.argumentIsNumericOrUndefined("", "argName")
                }).toThrow();
                expect(function () {
                    guard.argumentIsNumericOrUndefined("XE12", "argName")
                }).toThrow();
                expect(function () {
                    guard.argumentIsNumericOrUndefined("12", "argName")
                }).toThrow();
                expect(function () {
                    guard.argumentIsNumericOrUndefined(undefined, "argName")
                }).not.toThrow();
                expect(function () {
                    guard.argumentIsNumericOrUndefined(12, "argName")
                }).not.toThrow();
                expect(function () {
                    guard.argumentIsNumericOrUndefined(12.1, "argName")
                }).not.toThrow();
            });

            it("argumentIsFunction should behave properly", function () {
                expect(function () {
                    guard.argumentIsFunction(null, "argName")
                }).toThrow();
                expect(function () {
                    guard.argumentIsFunction(undefined, "argName")
                }).toThrow();
                expect(function () {
                    guard.argumentIsFunction("", "argName")
                }).toThrow();
                expect(function () {
                    guard.argumentIsFunction(" ", "argName")
                }).toThrow();
                expect(function () {
                    guard.argumentIsFunction(123, "argName")
                }).toThrow();
                expect(function () {
                    guard.argumentIsFunction({}, "argName")
                }).toThrow();
                expect(function () {
                    guard.argumentIsFunction(true, "argName")
                }).toThrow();
                expect(function () {
                    guard.argumentIsFunction(false, "argName")
                }).toThrow();
                expect(function () {
                    guard.argumentIsFunction(function () {
                    }, "argName")
                }).not.toThrow();
            });

            if ("argumentIsDefined should behave properly", function () {
                expect(function () {
                    guard.argumentIsDefined();
                }).toThrow();
                expect(function () {
                    guard.argumentIsDefined(undefined);
                }).toThrow();
                expect(function () {
                    guard.argumentIsDefined(null);
                }).not.toThrow();
                expect(function () {
                    guard.argumentIsDefined("");
                }).not.toThrow();
                expect(function () {
                    guard.argumentIsDefined(" ");
                }).not.toThrow();
                expect(function () {
                    guard.argumentIsDefined(12);
                }).not.toThrow();
                expect(function () {
                    guard.argumentIsDefined(true);
                }).not.toThrow();
            });
        });

        describe("everest.system.isDebug", function() {
           it("should return true if in DEBUG mode", function() {
               if(system.environment === constants.everest.environments.DEBUG) {
                   expect(system.isDebug()).toBe(true);
               } else {
                   expect(system.isDebug()).toBe(false);
               }
           })
        });
    });
});
