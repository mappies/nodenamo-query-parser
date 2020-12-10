import {assert as assert} from 'chai';
import { ErrorMessage } from '../src/entities/errorMessage';
import { parse } from '../src/parser';

describe('Insert Statement', function () 
{
    [
        { statement: 'insert {id:1,name:"some one",description:"a person"} into users', 
          expected: {type: 'insert', object: {id:1,name:"some one",description:"a person"}, into: 'users', where: undefined}},
        { statement: 'insert {id:2,title:"some thing",price:21,status:true} into books where attribute_not_exists(id)', 
          expected: {type: 'insert', object: {id:2,title:"some thing",price:21,status:true}, into: 'books', where: {conditionExpression: 'attribute_not_exists(#id)', expressionAttributeNames: {'#id': 'id'}, expressionAttributeValues: {}}}}
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
        { statement: 'insert ', expected: {error: "MismatchedTokenException", message: ErrorMessage.JSON_INVALID_OBJECT}},
        { statement: 'insert 42', expected: {error: "MismatchedTokenException", message: ErrorMessage.JSON_INVALID_OBJECT}},
        { statement: 'insert a123', expected: {error: "MismatchedTokenException", message: ErrorMessage.JSON_INVALID_OBJECT}},
        { statement: 'insert "a123"', expected: {error: "MismatchedTokenException", message: ErrorMessage.JSON_INVALID_OBJECT}},
        { statement: 'insert {id:1}', expected: {error: "MismatchedTokenException", message: ErrorMessage.MISSING_ENTITY_NAME}},
        { statement: 'insert {id:1}, {id:1} into table', expected: {error: "MismatchedTokenException", message: ErrorMessage.MISSING_ENTITY_NAME}},
        { statement: 'insert {id:1} into', expected: {error: "MismatchedTokenException", message: ErrorMessage.MISSING_ENTITY_NAME.replace('?', 'table')}},
        { statement: 'insert {id:1} into table where', expected: {error: "NoViableAltException", message: ErrorMessage.UNEXPECTED_END_OF_STATEMENT}}
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