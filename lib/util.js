"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
/*
* Based on graphql-tools
*/
function fieldMapToFieldConfigMapForsubscribe(fields) {
    return _.mapValues(fields, function (field) { return fieldToFieldConfigForsubscribe(field); });
}
exports.fieldMapToFieldConfigMapForsubscribe = fieldMapToFieldConfigMapForsubscribe;
function fieldToFieldConfigForsubscribe(field) {
    return {
        type: field.type,
        args: argsToFieldConfigArgumentMap(field.args),
        subscribe: field.subscribe,
        description: field.description,
        deprecationReason: field.deprecationReason,
    };
}
function fieldMapToFieldConfigMap(fields) {
    return _.mapValues(fields, function (field) { return fieldToFieldConfig(field); });
}
exports.fieldMapToFieldConfigMap = fieldMapToFieldConfigMap;
function fieldToFieldConfig(field) {
    return {
        type: field.type,
        args: argsToFieldConfigArgumentMap(field.args),
        resolve: field.resolve,
        description: field.description,
        deprecationReason: field.deprecationReason,
    };
}
function argsToFieldConfigArgumentMap(args) {
    return _.fromPairs(args.map(function (arg) { return argumentToArgumentConfig(arg); }));
}
function argumentToArgumentConfig(argument) {
    return [
        argument.name,
        {
            type: argument.type,
            defaultValue: argument.defaultValue,
            description: argument.description,
        },
    ];
}
