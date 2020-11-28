import {assert as assert} from 'chai';
import { ErrorMessage } from '../src/entities/errorMessage';
import { parse } from '../src/parser';

describe('Get Statement', function () 
{
    [
        { statement: 'get "128ecf5c-43c1-4e1c-9d46-5887a72032e9" from user strongly consistent', expected: {type: 'get', id: '128ecf5c-43c1-4e1c-9d46-5887a72032e9', from: 'user', stronglyConsistent: true}},
        { statement: 'Get "a123" From table1', expected: {type: 'get', id: 'a123', from: 'table1', stronglyConsistent: undefined}},
        { statement: 'GET 42 FROM table_12 STRONGLY CONSISTENT', expected: {type: 'get', id: 42, from: 'table_12', stronglyConsistent: true}},
        { statement: '    GET    42    FROM     table_12     Strongly     Consistent      ', expected: {type: 'get', id: 42, from: 'table_12', stronglyConsistent: true}},
    ]
    .forEach(test => 
    {
        it(`'${test.statement}' is valid.`, async () =>
        {
            let result = parse(test.statement);
            assert.deepEqual(result, test.expected);
        })
    });

    [
        { statement: 'Get ', expected: {error: "NoViableAltException", message: ErrorMessage.MISSING_OBJECT_ID}},
        { statement: 'Get 42', expected: {error: "MismatchedTokenException", message: ErrorMessage.GET_MISSING_FROM}},
        { statement: 'Get a123', expected: {error: "NoViableAltException", message: ErrorMessage.MISSING_OBJECT_ID}},
        { statement: 'Get "a123"', expected: {error: "MismatchedTokenException", message: ErrorMessage.GET_MISSING_FROM}},
        { statement: 'Get "a123" From', expected: {error: "MismatchedTokenException", message: ErrorMessage.GET_MISSING_TABLE}},
        { statement: 'Get "a123", "a123" From table', expected: {error: "MismatchedTokenException", message: ErrorMessage.GET_MISSING_FROM}},
        { statement: 'Get "a123" From table table', expected: {error: "NotAllInputParsedException", message: ErrorMessage.UNEXPECTED_TOKEN.replace('?', 'table')}},
        { statement: 'get "a123" from user strongly', expected: {error: "NotAllInputParsedException", message: ErrorMessage.UNEXPECTED_TOKEN.replace('?', 'strongly')}},
        { statement: 'GET 42 FROM table_12 StronglyConsistent', expected: {error: "NotAllInputParsedException", message: ErrorMessage.UNEXPECTED_TOKEN.replace('?', 'StronglyConsistent')}},
        { statement: 'GET 42 FROM table_12 Strongly Consistent Where', expected: {error: "NotAllInputParsedException", message: ErrorMessage.UNEXPECTED_TOKEN.replace('?', 'Where')}},
        { statement: 'G ET 42 FROM table_12 Strongly Consistent Where', expected: {error: "NoViableAltException", message: ErrorMessage.UNRECOGNIZED_COMMAND.replace('?', 'G')}}
    ]
    .forEach(test => 
    {
        it(`'${test.statement}' is invalid because '${test.expected.message}'`, async () =>
        {
            let error = undefined;
            try
            {
                parse(test.statement);
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