import {assert as assert} from 'chai';
import { ErrorMessage } from '../src/entities/errorMessage';
import { parse } from '../src/parser';

describe('List Statement', function () 
{
    [
        { statement: 'list * from user', 
          expected: {type: 'list', projections: undefined, from: 'user', using: undefined, by: undefined, filter: undefined, resume: undefined, order: undefined, limit: undefined, stronglyConsistent: undefined}},
        { statement: 'list name from user', 
          expected: {type: 'list', projections: ['name'], from: 'user', using: undefined, by: undefined, filter: undefined, resume: undefined, order: undefined, limit: undefined, stronglyConsistent: undefined}},
        { statement: 'list name,email from user', 
          expected: {type: 'list', projections: ['name','email'], from: 'user', using: undefined, by: undefined, filter: undefined, resume: undefined, order: undefined, limit: undefined, stronglyConsistent: undefined}},
        { statement: 'list * from user using user-index', 
          expected: {type: 'list', projections: undefined, from: 'user', using: 'user-index', by: undefined, filter: undefined, resume: undefined, order: undefined, limit: undefined, stronglyConsistent: undefined}},
        { statement: 'list * from user by "name"', 
          expected: {type: 'list', projections: undefined, from: 'user', using: undefined, by: {hash: "name", range: undefined}, filter: undefined, resume: undefined, order: undefined, limit: undefined, stronglyConsistent: undefined}},
        { statement: 'list * from user by "name","last_login"', 
          expected: {type: 'list', projections: undefined, from: 'user', using: undefined, by: {hash: "name", range: "last_login"}, filter: undefined, resume: undefined, order: undefined, limit: undefined, stronglyConsistent: undefined}},
        { statement: 'list * from user filter name = "some one"', 
          expected: {type: 'list', projections: undefined, from: 'user', using: undefined, by: undefined, filter: { filterExpression: "#name = :name", expressionAttributeNames: {'#name': 'name'}, expressionAttributeValues: {':name': "some one"}}, resume: undefined, order: undefined, limit: undefined, stronglyConsistent: undefined}},
        { statement: 'list * from user resume "nextPageToken"', 
          expected: {type: 'list', projections: undefined, from: 'user', using: undefined, by: undefined, filter: undefined, resume: 'nextPageToken', order: undefined, limit: undefined, stronglyConsistent: undefined}},
        { statement: 'list * from user order asc', 
          expected: {type: 'list', projections: undefined, from: 'user', using: undefined, by: undefined, filter: undefined, resume: undefined, order: true, limit: undefined, stronglyConsistent: undefined}},
        { statement: 'list * from user order desc', 
          expected: {type: 'list', projections: undefined, from: 'user', using: undefined, by: undefined, filter: undefined, resume: undefined, order: false, limit: undefined, stronglyConsistent: undefined}},
        { statement: 'list * from user limit 10', 
          expected: {type: 'list', projections: undefined, from: 'user', using: undefined, by: undefined, filter: undefined, resume: undefined, order: undefined, limit: 10, stronglyConsistent: undefined}},
        { statement: 'list * from user strongly consistent', 
          expected: {type: 'list', projections: undefined, from: 'user', using: undefined, by: undefined, filter: undefined, resume: undefined, order: undefined, limit: undefined, stronglyConsistent: true}},
        { statement: 'list id, name, email from user using an-index by "name" , "email" filter email = "someone@example.com" resume "token" order desc limit 2 strongly consistent', 
          expected: {type: 'list', projections: ['id', 'name', 'email'], from: 'user', using: 'an-index', by: {hash: 'name', range: 'email'}, filter: { filterExpression: "#email = :email", expressionAttributeNames: {'#email': 'email'}, expressionAttributeValues: {':email': "someone@example.com"}}, resume: 'token', order: false, limit: 2, stronglyConsistent: true}},
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
        { statement: 'list ', expected: {error: "NoViableAltException", message: ErrorMessage.FIND_MISSING_PROJECTIONS}},
        { statement: 'list 42', expected: {error: "NoViableAltException", message: ErrorMessage.FIND_MISSING_PROJECTIONS}},
        { statement: 'list "a"', expected: {error: "NoViableAltException", message: ErrorMessage.FIND_MISSING_PROJECTIONS}},
        { statement: 'list a', expected: {error: "MismatchedTokenException", message: ErrorMessage.FIND_MISSING_FROM}},
        { statement: 'list a From', expected: {error: "MismatchedTokenException", message: ErrorMessage.FIND_MISSING_TABLE}},
        { statement: 'list a, From table', expected: {error: "MismatchedTokenException", message: ErrorMessage.FIND_MISSING_PROJECTION}},
        { statement: 'list a123 From table table', expected: {error: "NotAllInputParsedException", message: ErrorMessage.UNEXPECTED_TOKEN.replace('?', 'table')}},
        { statement: 'list a123 From table using', expected: {error: "MismatchedTokenException", message: ErrorMessage.FIND_MISSING_USING}},
        { statement: 'list a123 From table limit', expected: {error: "MismatchedTokenException", message: ErrorMessage.FIND_MISSING_LIMIT}},
        { statement: 'list a123 From table order', expected: {error: "NoViableAltException", message: ErrorMessage.FIND_MISSING_ORDER}},
        { statement: 'list a123 From table order up', expected: {error: "NoViableAltException", message: ErrorMessage.FIND_MISSING_ORDER}},
        { statement: 'list a123 From table resume', expected: {error: "MismatchedTokenException", message: ErrorMessage.FIND_MISSING_RESUME}},
        { statement: 'list a123 From table by', expected: {error: "MismatchedTokenException", message: ErrorMessage.LIST_MISSING_BY_HASH}},
        { statement: 'list a123 From table by hash', expected: {error: "MismatchedTokenException", message: ErrorMessage.LIST_MISSING_BY_HASH}},
        { statement: 'list a123 From table by "hash",', expected: {error: "MismatchedTokenException", message: ErrorMessage.LIST_MISSING_BY_RANGE}},
        { statement: 'list a123 From table by "hash",range', expected: {error: "MismatchedTokenException", message: ErrorMessage.LIST_MISSING_BY_RANGE}},
        { statement: 'list a123 From table filter', expected: {error: "NoViableAltException", message: ErrorMessage.UNEXPECTED_END_OF_STATEMENT}},
        { statement: 'list a123 from user strongly', expected: {error: "NotAllInputParsedException", message: ErrorMessage.UNEXPECTED_TOKEN.replace('?', 'strongly')}},
        { statement: 'list abc FROM table_12 StronglyConsistent', expected: {error: "NotAllInputParsedException", message: ErrorMessage.UNEXPECTED_TOKEN.replace('?', 'StronglyConsistent')}},
        { statement: 'list abc FROM table_12 Strongly Consistent Where', expected: {error: "NotAllInputParsedException", message: ErrorMessage.UNEXPECTED_TOKEN.replace('?', 'Where')}},
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