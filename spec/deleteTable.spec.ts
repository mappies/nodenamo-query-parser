import {assert as assert} from 'chai';
import { ErrorMessage } from '../src/entities/errorMessage';
import { parse } from '../src/parser';

describe('Delete Table Statement', function () 
{
    [
        { statement: 'DELETE TABLE for user', expected: {type: 'delete_table', for: 'user'}},
        { statement: '  delete     table    for    books', expected: {type: 'delete_table', for: 'books'}},
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
        { statement: 'DELETE', expected: {error: "NoViableAltException", message: ErrorMessage.UNRECOGNIZED_COMMAND.replace('?', 'DELETE')}},
        { statement: 'DELETE TABLE', expected: {error: "MismatchedTokenException", message: ErrorMessage.DELETE_TABLE_MISSING_FOR}},
        { statement: 'DELETE TABLE "12"', expected: {error: "MismatchedTokenException", message: ErrorMessage.DELETE_TABLE_MISSING_FOR}},
        { statement: 'DELETE TABLE 12', expected: {error: "MismatchedTokenException", message: ErrorMessage.DELETE_TABLE_MISSING_FOR}},
        { statement: 'DELETE TABLE users', expected: {error: "MismatchedTokenException", message: ErrorMessage.DELETE_TABLE_MISSING_FOR}},
        { statement: 'DELETE TABLE for "users"', expected: {error: "MismatchedTokenException", message: ErrorMessage.DELETE_TABLE_MISSING_ENTITY_NAME}},
        { statement: 'DELETE TABLE for 12', expected: {error: "MismatchedTokenException", message: ErrorMessage.DELETE_TABLE_MISSING_ENTITY_NAME}},
        { statement: 'DELETE TABLE for books where', expected: {error: "NotAllInputParsedException", message: ErrorMessage.UNEXPECTED_TOKEN.replace('?', 'where')}},
        { statement: 'DELETE TABLE for books with capacity of 1 2', expected: {error: "NotAllInputParsedException", message: ErrorMessage.UNEXPECTED_TOKEN.replace('?', 'with capacity of')}},
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