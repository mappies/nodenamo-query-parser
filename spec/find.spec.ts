import {assert as assert} from 'chai';
import { ErrorMessage } from '../src/entities/errorMessage';
import { parse } from '../src/parser';

describe('Find Statement', function () 
{ 
    [
        { statement: 'find * from user', 
          expected: {type: 'find', projections: undefined, from: 'user', using: undefined, where: undefined, filter: undefined, resume: undefined, order: undefined, limit: undefined, stronglyConsistent: undefined}},
        { statement: 'find name from user', 
          expected: {type: 'find', projections: ['name'], from: 'user', using: undefined, where: undefined, filter: undefined, resume: undefined, order: undefined, limit: undefined, stronglyConsistent: undefined}},
        { statement: 'find name,email from user', 
          expected: {type: 'find', projections: ['name','email'], from: 'user', using: undefined, where: undefined, filter: undefined, resume: undefined, order: undefined, limit: undefined, stronglyConsistent: undefined}},
        { statement: 'find * from user using user-index', 
          expected: {type: 'find', projections: undefined, from: 'user', using: 'user-index', where: undefined, filter: undefined, resume: undefined, order: undefined, limit: undefined, stronglyConsistent: undefined}},
        { statement: 'find * from user where name = "some one"', 
          expected: {type: 'find', projections: undefined, from: 'user', using: undefined, where: { keyConditions: "#name = :name", expressionAttributeNames: {'#name': 'name'}, expressionAttributeValues: {':name': "some one"}}, filter: undefined, resume: undefined, order: undefined, limit: undefined, stronglyConsistent: undefined}},
        { statement: 'find * from user filter name = "some one"', 
          expected: {type: 'find', projections: undefined, from: 'user', using: undefined, where: undefined, filter: { filterExpression: "#name = :name", expressionAttributeNames: {'#name': 'name'}, expressionAttributeValues: {':name': "some one"}}, resume: undefined, order: undefined, limit: undefined, stronglyConsistent: undefined}},
        { statement: 'find * from user resume "nextPageToken"', 
          expected: {type: 'find', projections: undefined, from: 'user', using: undefined, where: undefined, filter: undefined, resume: 'nextPageToken', order: undefined, limit: undefined, stronglyConsistent: undefined}},
        { statement: 'find * from user order asc', 
          expected: {type: 'find', projections: undefined, from: 'user', using: undefined, where: undefined, filter: undefined, resume: undefined, order: true, limit: undefined, stronglyConsistent: undefined}},
        { statement: 'find * from user order desc', 
          expected: {type: 'find', projections: undefined, from: 'user', using: undefined, where: undefined, filter: undefined, resume: undefined, order: false, limit: undefined, stronglyConsistent: undefined}},
        { statement: 'find * from user limit 10', 
          expected: {type: 'find', projections: undefined, from: 'user', using: undefined, where: undefined, filter: undefined, resume: undefined, order: undefined, limit: 10, stronglyConsistent: undefined}},
        { statement: 'find * from user strongly consistent', 
          expected: {type: 'find', projections: undefined, from: 'user', using: undefined, where: undefined, filter: undefined, resume: undefined, order: undefined, limit: undefined, stronglyConsistent: true}},
        { statement: 'find id, name, email from user using an-index where name = "some one" filter email = "someone@example.com" resume "token" order desc limit 2 strongly consistent', 
          expected: {type: 'find', projections: ['id', 'name', 'email'], from: 'user', using: 'an-index', where: { keyConditions: "#name = :name", expressionAttributeNames: {'#name': 'name'}, expressionAttributeValues: {':name': 'some one'}}, filter: { filterExpression: "#email = :email", expressionAttributeNames: {'#email': 'email'}, expressionAttributeValues: {':email': "someone@example.com"}}, resume: 'token', order: false, limit: 2, stronglyConsistent: true}},
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
        { statement: 'Find ', expected: {error: "NoViableAltException", message: ErrorMessage.FIND_MISSING_PROJECTIONS}},
        { statement: 'Find 42', expected: {error: "NoViableAltException", message: ErrorMessage.FIND_MISSING_PROJECTIONS}},
        { statement: 'Find "a"', expected: {error: "NoViableAltException", message: ErrorMessage.FIND_MISSING_PROJECTIONS}},
        { statement: 'Find a', expected: {error: "MismatchedTokenException", message: ErrorMessage.FIND_MISSING_FROM}},
        { statement: 'Find a From', expected: {error: "MismatchedTokenException", message: ErrorMessage.FIND_MISSING_TABLE}},
        { statement: 'Find a, From table', expected: {error: "MismatchedTokenException", message: ErrorMessage.FIND_MISSING_PROJECTION}},
        { statement: 'Find a123 From table table', expected: {error: "NotAllInputParsedException", message: ErrorMessage.UNEXPECTED_TOKEN.replace('?', 'table')}},
        { statement: 'Find a123 From table using', expected: {error: "MismatchedTokenException", message: ErrorMessage.FIND_MISSING_USING}},
        { statement: 'Find a123 From table limit', expected: {error: "MismatchedTokenException", message: ErrorMessage.FIND_MISSING_LIMIT}},
        { statement: 'Find a123 From table order', expected: {error: "NoViableAltException", message: ErrorMessage.FIND_MISSING_ORDER}},
        { statement: 'Find a123 From table order up', expected: {error: "NoViableAltException", message: ErrorMessage.FIND_MISSING_ORDER}},
        { statement: 'Find a123 From table resume', expected: {error: "MismatchedTokenException", message: ErrorMessage.FIND_MISSING_RESUME}},
        { statement: 'Find a123 From table where', expected: {error: "NoViableAltException", message: ErrorMessage.UNEXPECTED_END_OF_STATEMENT}},
        { statement: 'Find a123 From table filter', expected: {error: "NoViableAltException", message: ErrorMessage.UNEXPECTED_END_OF_STATEMENT}},
        { statement: 'Find a123 from user strongly', expected: {error: "NotAllInputParsedException", message: ErrorMessage.UNEXPECTED_TOKEN.replace('?', 'strongly')}},
        { statement: 'Find abc FROM table_12 StronglyConsistent', expected: {error: "NotAllInputParsedException", message: ErrorMessage.UNEXPECTED_TOKEN.replace('?', 'StronglyConsistent')}},
        { statement: 'Find abc FROM table_12 Strongly Consistent Where', expected: {error: "NotAllInputParsedException", message: ErrorMessage.UNEXPECTED_TOKEN.replace('?', 'Where')}},
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