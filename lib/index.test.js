"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var graphql_1 = require("graphql");
var graphql_tools_1 = require("graphql-tools");
var _1 = require("./");
ava_1.default('empty rules yield identity', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var typeDefs, resolvers, schema, transformedSchema, queryFields, mutationFields, queryResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                typeDefs = "\n    type Query {\n      hello: String!\n    }\n\n    type Mutation {\n      alexaHello(name: String!): String!\n    }\n  ";
                resolvers = {
                    Query: {
                        hello: function () { return 'Hello world'; },
                    },
                    Mutation: {
                        alexaHello: function (_, _a) {
                            var name = _a.name;
                            return "Alexa: Hello world, " + name;
                        },
                    },
                };
                schema = graphql_tools_1.makeExecutableSchema({ typeDefs: typeDefs, resolvers: resolvers });
                transformedSchema = _1.transformSchema(schema, {});
                queryFields = transformedSchema.getQueryType().getFields();
                t.not(queryFields['hello'], undefined);
                mutationFields = transformedSchema.getMutationType().getFields();
                t.not(mutationFields['alexaHello'], undefined);
                return [4 /*yield*/, graphql_1.graphql(transformedSchema, "{ hello }")];
            case 1:
                queryResult = _a.sent();
                t.ifError(queryResult.errors);
                t.is(queryResult.data.hello, 'Hello world');
                return [2 /*return*/];
        }
    });
}); });
ava_1.default('exclude a query field', function (t) {
    var typeDefs = "\n    type Query {\n      hello: String!\n      world: String!\n    }\n  ";
    var resolvers = {
        Query: {
            hello: function () { return 'Hello'; },
            world: function () { return 'world'; },
        },
    };
    var schema = graphql_tools_1.makeExecutableSchema({ typeDefs: typeDefs, resolvers: resolvers });
    var rules = {
        hello: false,
    };
    var transformedSchema = _1.transformSchema(schema, rules);
    var queryFields = transformedSchema.getQueryType().getFields();
    t.is(queryFields['hello'], undefined);
    t.not(queryFields['world'], undefined);
});
ava_1.default('exclude everything shouldn\'t work', function (t) {
    var typeDefs = "\n    type Query {\n      hello: String!\n      world: String!\n    }\n\n    type Mutation {\n      alexaHello(name: String!): String!\n    }\n  ";
    var resolvers = {
        Query: {
            hello: function () { return 'Hello'; },
            world: function () { return 'world'; },
        },
        Mutation: {
            alexaHello: function (_, _a) {
                var name = _a.name;
                return "Alexa: Hello world, " + name;
            },
        },
    };
    var schema = graphql_tools_1.makeExecutableSchema({ typeDefs: typeDefs, resolvers: resolvers });
    var rules = {
        '*': false,
    };
    t.throws(function () {
        _1.transformSchema(schema, rules);
    });
});
ava_1.default('exclude everything expect one query', function (t) {
    var typeDefs = "\n    type Query {\n      hello: String!\n      world: String!\n    }\n\n    type Mutation {\n      alexaHello(name: String!): String!\n    }\n  ";
    var resolvers = {
        Query: {
            hello: function () { return 'Hello'; },
            world: function () { return 'world'; },
        },
        Mutation: {
            alexaHello: function (_, _a) {
                var name = _a.name;
                return "Alexa: Hello world, " + name;
            },
        },
    };
    var schema = graphql_tools_1.makeExecutableSchema({ typeDefs: typeDefs, resolvers: resolvers });
    var rules = {
        '*': false,
        'hello': true,
    };
    var transformedSchema = _1.transformSchema(schema, rules);
    var queryFields = transformedSchema.getQueryType().getFields();
    t.not(queryFields['hello'], undefined);
    t.is(queryFields['world'], undefined);
    t.is(queryFields['alexaHello'], undefined);
});
ava_1.default('overwrite args', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var typeDefs, resolvers, schema, transformedSchema, queryResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                typeDefs = "\n    type Query {\n      hello: String!\n    }\n\n    type Mutation {\n      alexaHello(name: String!): String!\n    }\n  ";
                resolvers = {
                    Query: {
                        hello: function () { return 'Hello world'; },
                    },
                    Mutation: {
                        alexaHello: function (_, _a) {
                            var name = _a.name;
                            return "Alexa: Hello world, " + name;
                        },
                    },
                };
                schema = graphql_tools_1.makeExecutableSchema({ typeDefs: typeDefs, resolvers: resolvers });
                transformedSchema = _1.transformSchema(schema, {
                    alexaHello: function (_a) {
                        var args = _a.args, resolve = _a.resolve;
                        return resolve({ name: 'John' });
                    },
                });
                return [4 /*yield*/, graphql_1.graphql(transformedSchema, "mutation { alexaHello(name: \"Bob\") }")];
            case 1:
                queryResult = _a.sent();
                t.ifError(queryResult.errors);
                t.is(queryResult.data.alexaHello, 'Alexa: Hello world, John');
                return [2 /*return*/];
        }
    });
}); });
ava_1.default('overwrite data', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var typeDefs, resolvers, schema, transformedSchema, queryResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                typeDefs = "\n    type Query {\n      hello: String!\n    }\n\n    type Mutation {\n      alexaHello(name: String!): String!\n    }\n  ";
                resolvers = {
                    Query: {
                        hello: function () { return 'Hello world'; },
                    },
                    Mutation: {
                        alexaHello: function (_, _a) {
                            var name = _a.name;
                            return "Alexa: Hello world, " + name;
                        },
                    },
                };
                schema = graphql_tools_1.makeExecutableSchema({ typeDefs: typeDefs, resolvers: resolvers });
                transformedSchema = _1.transformSchema(schema, {
                    alexaHello: function (_a) {
                        var args = _a.args, resolve = _a.resolve;
                        return resolve(args).replace('Bob', 'Alice');
                    },
                });
                return [4 /*yield*/, graphql_1.graphql(transformedSchema, "mutation { alexaHello(name: \"Bob\") }")];
            case 1:
                queryResult = _a.sent();
                t.ifError(queryResult.errors);
                t.is(queryResult.data.alexaHello, 'Alexa: Hello world, Alice');
                return [2 /*return*/];
        }
    });
}); });
