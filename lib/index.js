"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var minimatch = require("minimatch");
var _ = require("lodash");
var util_1 = require("./util");
function transformSchema(schema, rules) {
    var newRules = prepareRules(rules, schema);
    return new graphql_1.GraphQLSchema({
        query: prepareQueryType(schema, newRules),
        mutation: prepareMutationType(schema, newRules),
    });
}
exports.transformSchema = transformSchema;
function prepareQueryType(schema, rules) {
    var type = schema.getQueryType();
    var fields = __assign({}, type.getFields());
    Object.keys(fields).forEach(function (fieldName) { return transformField(fields, fieldName, rules[fieldName]); });
    var newQueryType = new graphql_1.GraphQLObjectType({
        name: type.name,
        description: type.description,
        isTypeOf: type.isTypeOf,
        fields: util_1.fieldMapToFieldConfigMap(fields),
        interfaces: type.getInterfaces(),
    });
    return newQueryType;
}
function prepareMutationType(schema, rules) {
    var type = schema.getMutationType();
    if (!type) {
        return;
    }
    var fields = __assign({}, type.getFields());
    Object.keys(fields).forEach(function (fieldName) { return transformField(fields, fieldName, rules[fieldName]); });
    if (Object.keys(fields).length === 0) {
        return;
    }
    var newMutationType = new graphql_1.GraphQLObjectType({
        name: type.name,
        description: type.description,
        isTypeOf: type.isTypeOf,
        fields: util_1.fieldMapToFieldConfigMap(fields),
        interfaces: type.getInterfaces(),
    });
    return newMutationType;
}
function transformField(fields, fieldName, rule) {
    if (rule === false) {
        delete fields[fieldName];
    }
    else if (typeof rule === 'function') {
        var oldResolve_1 = fields[fieldName].resolve;
        fields[fieldName].resolve = function (root, args, context, info) {
            var resolve = function (_args) { return oldResolve_1(root, _args, context, info); };
            return rule({ args: args, resolve: resolve });
        };
    }
}
function prepareRules(rules, schema) {
    var queryFields = schema.getQueryType().getFields();
    var mutationFields = schema.getMutationType() ? schema.getMutationType().getFields() : {};
    var allFields = __assign({}, queryFields, mutationFields);
    var allFieldNames = Object.keys(allFields);
    // warning for inexisting fields
    var inexistingFieldNames = Object.keys(rules)
        .filter(function (r) { return !r.includes('*'); })
        .filter(function (fieldName) { return !allFieldNames.includes(fieldName); });
    for (var _i = 0, inexistingFieldNames_1 = inexistingFieldNames; _i < inexistingFieldNames_1.length; _i++) {
        var fieldName = inexistingFieldNames_1[_i];
        console.warn("Warning: No such query/mutation in schema: \"" + fieldName + "\"");
    }
    // keep everything by default
    var newRules = allFieldNames.reduce(function (obj, f) {
        return (__assign({}, obj, (_a = {}, _a[f] = true, _a)));
        var _a;
    }, {});
    // apply `false` rules
    var falseRuleKeys = Object.keys(rules).filter(function (k) { return rules[k] === false; });
    var falseFieldNames = allFieldNames.filter(function (fieldName) {
        return falseRuleKeys.some(function (pattern) { return minimatch(fieldName, pattern); });
    });
    for (var _a = 0, falseFieldNames_1 = falseFieldNames; _a < falseFieldNames_1.length; _a++) {
        var fieldName = falseFieldNames_1[_a];
        newRules[fieldName] = false;
    }
    // overwrite with non-`false` rules
    var nonFalseRuleKeys = Object.keys(rules).filter(function (k) { return rules[k] !== false; });
    var nonFalseFieldNames = allFieldNames.filter(function (fieldName) {
        return nonFalseRuleKeys.some(function (pattern) { return minimatch(fieldName, pattern); });
    });
    var _loop_1 = function (fieldName) {
        var matchedRules = _.chain([rules])
            .pickBy(function (val, key) { return val !== undefined && minimatch(fieldName, key); })
            .values()
            .value();
        if (matchedRules.length > 0) {
            newRules[fieldName] = matchedRules[0];
        }
    };
    for (var _b = 0, nonFalseFieldNames_1 = nonFalseFieldNames; _b < nonFalseFieldNames_1.length; _b++) {
        var fieldName = nonFalseFieldNames_1[_b];
        _loop_1(fieldName);
    }
    return newRules;
}
