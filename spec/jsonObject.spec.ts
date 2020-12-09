import {assert as assert} from 'chai';
import { ErrorMessage } from '../src/entities/errorMessage';
import { parseJsonObject } from '../src/parser';

describe('Json Object', function () 
{
    [
        { json: '{}' },
        { json: '{"k1": null}' },
        { json: '{"k1": true}' },
        { json: '{"k1": 2020.12}' },
        { json: '{"k1": "hello"}' },
        { json: '{"k1": "hello, \\"world\\""}' },
        { json: '{"k1": "hello, {world}"}' },
        { json: '{"k1": []}' },
        { json: '{"k1": [true, 10, "str1", null]}' },
        { json: '{"k1": null, "k2": false, "k3": 42, "k4": "str", "k5": [true, 10, "str1", null]}' }
    ]
    .forEach(test => 
    {
        it(`Basic json ${test.json} is valid.`, async () =>
        {
            let result = parseJsonObject(test.json);
            assert.deepEqual(result, JSON.parse(test.json));
        })
    });

    [
        { json: '{}', expected: {} },
        { json: '{k1: null}', expected: {"k1": null} },
        { json: '{k1: true}', expected: {"k1": true} },
        { json: '{k1: 2020.12}', expected: {"k1": 2020.12} },
        { json: '{k1: "hello"}', expected: {"k1": "hello"} },
        { json: '{k1: "hello, \\"world\\""}', expected: {"k1": "hello, \"world\""} },
        { json: '{k1: "hello, {world}"}', expected: {"k1": "hello, {world}"} },
        { json: '{k1: []}', expected: {"k1": []} },
        { json: '{k1: [true, 10, "str1", null]}', expected: {"k1": [true, 10, "str1", null]} },
        { json: '{k1: null, "k2": false, k3: 42, "k4": "str", k5: [true, 10, "str1", null]}', expected: {"k1": null, "k2": false, "k3": 42, "k4": "str", "k5": [true, 10, "str1", null]} }
    ]
    .forEach(test => 
    {
        it(`Basic json ${test.json} without quotes is valid.`, async () =>
        {
            let result = parseJsonObject(test.json);
            assert.deepEqual(result, test.expected);
        })
    });

    [
        { json: '{"k1": [ {"k2": [{"k3": ["k4"]}]}] }' },
        { json: '{"k1": {"k2": {"k3": {"k4": "v4"}}} }' },
        { json: '{"k1": [ \
                            { "k2": [ {"k3": 1, "k4": true, "k5": true}]}, \
                            [ \
                                {"k4": [ \
                                    4, \
                                    {"k6": false, "k7": [true, false]}, \
                                    true, \
                                    null]}, \
                                9, \
                                false, \
                                null], \
                            8, \
                            true, \
                            null \
                        ], \
                  "k10": [1, \
                          [true, false], \
                          3] \
                 }' },
    ]
    .forEach(test => 
    {
        it(`Nested json ${test.json} is valid.`, async () =>
        {
            let result = parseJsonObject(test.json);
            assert.deepEqual(result, JSON.parse(test.json));
        })
    });

    [
        { json: '{', expected: {error: "MismatchedTokenException", message: ErrorMessage.JSON_MISSING_CLOSING_CURLY_PARENTHESIS}},
        { json: '{a"', expected: {error: "MismatchedTokenException", message: ErrorMessage.JSON_MISSING_PROPERTY_VALUE}},
        { json: '{"a"}', expected: {error: "MismatchedTokenException", message: ErrorMessage.JSON_MISSING_PROPERTY_VALUE}},
        { json: '{"a":}', expected: {error: "NoViableAltException", message: ErrorMessage.JSON_INVALID_VALUE}},
        { json: '{"a":[}', expected: {error: "MismatchedTokenException", message: ErrorMessage.JSON_MISSING_CLOSING_BRACKET}},
        { json: '{"a":[a}', expected: {error: "MismatchedTokenException", message: ErrorMessage.JSON_MISSING_CLOSING_BRACKET}},
        { json: '{"a":"b}', expected: {error: "NoViableAltException", message: ErrorMessage.JSON_INVALID_VALUE}},
        { json: '{"a":[1,}', expected: {error: "NoViableAltException", message: ErrorMessage.JSON_INVALID_VALUE}},
        { json: '{"a":b}', expected: {error: "NoViableAltException", message: ErrorMessage.JSON_INVALID_VALUE}},
        { json: '{"a":{}', expected: {error: "MismatchedTokenException", message: ErrorMessage.JSON_MISSING_CLOSING_CURLY_PARENTHESIS}},
    ]
    .forEach(test => 
    {
        it(`${test.json} is invalid because '${test.expected.message}'`, async () =>
        {
            let error = undefined;
            try
            {
                parseJsonObject(test.json);
            }
            catch(e)
            {
                error = e;
            }

            assert.isDefined(error);
            assert.equal(error.name, test.expected.error);
            assert.equal(error.message, test.expected.message);
        })
    });
});