import {assert as assert} from 'chai';
import { ErrorMessage } from '../src/entities/errorMessage';
import { parse } from '../src/parser';

describe('Update Statement', function () 
{
    [
        { statement: 'update {id:1,name:"some one",description:"a person"} from users', 
          expected: {type: 'update', object: {id:1,name:"some one",description:"a person"}, from: 'users', where: undefined, versionCheck: undefined}},
        { statement: 'update {id:1,name:"some one",description:"a person"} from users with version check', 
          expected: {type: 'update', object: {id:1,name:"some one",description:"a person"}, from: 'users', where: undefined, versionCheck: true}},
        { statement: 'update {id:2,title:"some thing",price:21,status:true} from books where attribute_not_exists(id)', 
          expected: {type: 'update', object: {id:2,title:"some thing",price:21,status:true}, from: 'books', where: {conditionExpression: 'attribute_not_exists(#id)', expressionAttributeNames: {'#id': 'id'}, expressionAttributeValues: {}}, versionCheck: undefined}},
        { statement: 'update {id:2,title:"some thing",price:21,status:true} from books where attribute_not_exists(id) with version check', 
          expected: {type: 'update', object: {id:2,title:"some thing",price:21,status:true}, from: 'books', where: {conditionExpression: 'attribute_not_exists(#id)', expressionAttributeNames: {'#id': 'id'}, expressionAttributeValues: {}}, versionCheck: true}}
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
        { statement: 'update ', expected: {error: "MismatchedTokenException", message: ErrorMessage.JSON_INVALID_OBJECT}},
        { statement: 'update 42', expected: {error: "MismatchedTokenException", message: ErrorMessage.JSON_INVALID_OBJECT}},
        { statement: 'update a123', expected: {error: "MismatchedTokenException", message: ErrorMessage.JSON_INVALID_OBJECT}},
        { statement: 'update "a123"', expected: {error: "MismatchedTokenException", message: ErrorMessage.JSON_INVALID_OBJECT}},
        { statement: 'update {id:1}', expected: {error: "MismatchedTokenException", message: ErrorMessage.MISSING_ENTITY_NAME}},
        { statement: 'update {id:1}, {id:1} from table', expected: {error: "MismatchedTokenException", message: ErrorMessage.MISSING_ENTITY_NAME}},
        { statement: 'update {id:1} from', expected: {error: "MismatchedTokenException", message: ErrorMessage.MISSING_ENTITY_NAME.replace('?', 'table')}},
        { statement: 'update {id:1} from table where', expected: {error: "NoViableAltException", message: ErrorMessage.UNEXPECTED_END_OF_STATEMENT}},
        { statement: 'update {id:1} from table with version', expected: {error: "NotAllInputParsedException", message: ErrorMessage.UNEXPECTED_TOKEN.replace('?', 'with')}},
        { statement: 'update {id:1} from table with version check where', expected: {error: "NotAllInputParsedException", message: ErrorMessage.UNEXPECTED_TOKEN.replace('?', 'where')}}
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