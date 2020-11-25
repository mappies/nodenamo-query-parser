import {assert as assert} from 'chai';
import { parse } from '../src/parser';

describe('Get Statement', function () 
{
    [
        { statement: 'get "128ecf5c-43c1-4e1c-9d46-5887a72032e9" from user stronglyconsistent', expected: {type: 'get', get: '128ecf5c-43c1-4e1c-9d46-5887a72032e9', from: 'user', stronglyConsistent: true}},
        { statement: 'Get "a123" From table1', expected: {type: 'get', get: 'a123', from: 'table1', stronglyConsistent: undefined}},
        { statement: 'GET 42 FROM table_12 StronglyConsistent', expected: {type: 'get', get: 42, from: 'table_12', stronglyConsistent: true}},
        { statement: '    GET    42    FROM     table_12     StronglyConsistent      ', expected: {type: 'get', get: 42, from: 'table_12', stronglyConsistent: true}},
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
        { statement: 'Get ', expected: "NoViableAltException"},
        { statement: 'Get 42', expected: "MismatchedTokenException"},
        { statement: 'Get a123', expected: "NoViableAltException"},
        { statement: 'Get "a123"', expected: "MismatchedTokenException"},
        { statement: 'Get "a123" From', expected: "MismatchedTokenException"},
        { statement: 'Get "a123", "a123" From table', expected: "MismatchedTokenException"},
        { statement: 'Get "a123" From table table', expected: "NotAllInputParsedException"},
        { statement: 'get "a123" from user strongly', expected: "NotAllInputParsedException"},
        { statement: 'GET 42 FROM table_12 Strongly consistent', expected: "NotAllInputParsedException"},
        { statement: 'GET 42 FROM table_12 StronglyConsistent Where', expected: "NotAllInputParsedException"},
        { statement: 'G ET 42 FROM table_12 StronglyConsistent Where', expected: "NoViableAltException"}
    ]
    .forEach(test => 
    {
        it(`'${test.statement}' is invalid.`, async () =>
        {
            assert.throws(()=>parse(test.statement), test.expected);
        })
    });
});