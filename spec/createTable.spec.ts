import {assert as assert} from 'chai';
import { ErrorMessage } from '../src/entities/errorMessage';
import { parse } from '../src/parser';

describe('Create Table Statement', function () 
{
    [
        { statement: 'CREATE TABLE for user', expected: {type: 'create_table', for: 'user', withCapacityOf: undefined}},
        { statement: 'CREATE TABLE for stores WITH CAPACITY OF 123 456', expected: {type: 'create_table', for: 'stores', withCapacityOf: {readCapacity: 123, writeCapacity: 456}}},
        { statement: '  create     table    for    books  with    capacity  of 1  9876   ', expected: {type: 'create_table', for: 'books', withCapacityOf: {readCapacity: 1, writeCapacity: 9876}}},
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
        { statement: 'CREATE', expected: {error: "NoViableAltException", message: ErrorMessage.UNRECOGNIZED_COMMAND.replace('?', 'CREATE')}},
        { statement: 'CREATE TABLE', expected: {error: "MismatchedTokenException", message: ErrorMessage.CREATE_TABLE_MISSING_FOR}},
        { statement: 'CREATE TABLE "12"', expected: {error: "MismatchedTokenException", message: ErrorMessage.CREATE_TABLE_MISSING_FOR}},
        { statement: 'CREATE TABLE 12', expected: {error: "MismatchedTokenException", message: ErrorMessage.CREATE_TABLE_MISSING_FOR}},
        { statement: 'CREATE TABLE users', expected: {error: "MismatchedTokenException", message: ErrorMessage.CREATE_TABLE_MISSING_FOR}},
        { statement: 'CREATE TABLE for "users"', expected: {error: "MismatchedTokenException", message: ErrorMessage.MISSING_ENTITY_NAME}},
        { statement: 'CREATE TABLE for 12', expected: {error: "MismatchedTokenException", message: ErrorMessage.MISSING_ENTITY_NAME}},
        { statement: 'CREATE TABLE for books with', expected: {error: "NotAllInputParsedException", message: ErrorMessage.UNEXPECTED_TOKEN.replace('?', 'with')}},
        { statement: 'CREATE TABLE for books with capacity', expected: {error: "NotAllInputParsedException", message: ErrorMessage.UNEXPECTED_TOKEN.replace('?', 'with')}},
        { statement: 'CREATE TABLE for books with capacity of', expected: {error: "MismatchedTokenException", message: ErrorMessage.CREATE_TABLE_MISSING_READ_CAPACITY}},
        { statement: 'CREATE TABLE for books with capacity of a b', expected: {error: "MismatchedTokenException", message: ErrorMessage.CREATE_TABLE_MISSING_READ_CAPACITY}},
        { statement: 'CREATE TABLE for books with capacity of "1" "2"', expected: {error: "MismatchedTokenException", message: ErrorMessage.CREATE_TABLE_MISSING_READ_CAPACITY}},
        { statement: 'CREATE TABLE for books with capacity of 1,2', expected: {error: "MismatchedTokenException", message: ErrorMessage.CREATE_TABLE_MISSING_READ_CAPACITY}},
        { statement: 'CREATE TABLE for books with capacity of 1', expected: {error: "MismatchedTokenException", message: ErrorMessage.CREATE_TABLE_MISSING_WRITE_CAPACITY}}
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