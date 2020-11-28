import {assert as assert} from 'chai';
import { ErrorMessage } from '../src/entities/errorMessage';
import { parse } from '../src/parser';

describe('Delete Statement', function () 
{
    [
        { statement: 'delete "128ecf5c-43c1-4e1c-9d46-5887a72032e9" from user', 
          expected: {type: 'delete', id: '128ecf5c-43c1-4e1c-9d46-5887a72032e9', from: 'user', where: undefined}},

        { statement: 'DELETE 42 FROM table_12', 
          expected: {type: 'delete', id: 42, from: 'table_12', where: undefined}},

        { statement: '    delete    "a123"    FROM     table_12         ', 
          expected: {type: 'delete', id: "a123", from: 'table_12', where: undefined}},

        { statement: 'DELETE 42 FROM books WHERE title = "A book"', 
          expected: {type: 'delete', id: 42, from: 'books', 
                     where: { expression: "#title = :title", 
                              expressionAttributeNames: {'#title': 'title'},
                              expressionAttributeValues: {':title': "A book"}}}}
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
        { statement: 'Delete ', expected: {error: "NoViableAltException", message: ErrorMessage.MISSING_OBJECT_ID}},
        { statement: 'Delete 42', expected: {error: "MismatchedTokenException", message: ErrorMessage.DELETE_MISSING_FROM}},
        { statement: 'Delete a123', expected: {error: "NoViableAltException", message: ErrorMessage.MISSING_OBJECT_ID}},
        { statement: 'Delete "a123"', expected: {error: "MismatchedTokenException", message: ErrorMessage.DELETE_MISSING_FROM}},
        { statement: 'Delete "a123" From', expected: {error: "MismatchedTokenException", message: ErrorMessage.MISSING_ENTITY_NAME}},
        { statement: 'Delete "a123", "a123" From table', expected: {error: "MismatchedTokenException", message: ErrorMessage.DELETE_MISSING_FROM}},
        { statement: 'Delete "a123" From table table', expected: {error: "NotAllInputParsedException", message: ErrorMessage.UNEXPECTED_TOKEN.replace('?', 'table')}}
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