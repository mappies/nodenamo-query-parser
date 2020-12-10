import {assert as assert} from 'chai';
import { ErrorMessage } from '../src/entities/errorMessage';
import { parse } from '../src/parser';

describe('Explain Statement', function () 
{
    [
        { statement: 'explain insert {id:1,name:"some one",description:"a person"} into users', 
          expected: {type: 'explain', statement: {type: 'insert', object: {id:1,name:"some one",description:"a person"}, into: 'users', where: undefined}}},
        { statement: 'explain Get "a123" From table1', 
          expected: {type: 'explain', statement: {type: 'get', id: 'a123', from: 'table1', stronglyConsistent: undefined}}},
        { statement: 'EXPLAIN  DELETE 42 FROM table_12', 
          expected: {type: 'explain', statement: {type: 'delete', id: 42, from: 'table_12', where: undefined}}},
        { statement: 'Explain CREATE TABLE for user', 
          expected: {type: 'explain', statement: {type: 'create_table', for: 'user', withCapacityOf: undefined}}}
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
        { statement: 'explain ', expected: {error: "NoViableAltException", message: ErrorMessage.UNEXPECTED_END_OF_STATEMENT}},
        { statement: 'explain insert something', expected: {error: "MismatchedTokenException", message: ErrorMessage.JSON_INVALID_OBJECT}}
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