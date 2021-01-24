import {assert as assert} from 'chai';
import {suggest} from '../src/parser';

describe('Suggest', function () 
{
    [
        { statement: '', expectedSuggestions: ["create table", "delete", "delete table", "explain", "find", "get", "import", "insert", "list", "on", "show tables", "unload table", "update"]},
        { statement: 'find *', expectedSuggestions: ['from']},
        { statement: 'find * from table', expectedSuggestions: ['filter', 'limit', 'order', 'resume', 'strongly consistent', 'using', 'where']},
        { statement: 'find * from table filter', expectedSuggestions: ['(', 'attribute_exists', 'attribute_not_exists', 'attribute_type', 'begins_with', 'identifier', 'not', 'size']},
        { statement: 'find * from table filter a', expectedSuggestions: ['<', '<=', '<>', '=', '>', '>=', 'between', 'in']},
        { statement: 'find * from table filter a = 1 limit', expectedSuggestions: ['number']},
        { statement: 'find * from table filter a = 1 limit 2', expectedSuggestions: ['strongly consistent']},
        { statement: 'find * from table filter a = 1 limit 2 strongly consistent', expectedSuggestions: []}
    ]
    .forEach(test => 
    {
        it(`'${test.statement}' is suggestible.`, async () =>
        {
            let result = suggest(test.statement);
            assert.deepEqual(result, test.expectedSuggestions);
        })
    });
    [
        { statement: 'x' },
        { statement: 'find "a"' },
        { statement: 'find * into' },
        { statement: 'find * from x where 12' }
    ]
    .forEach(test => 
    {
        it(`'${test.statement}' is not suggestible.`, async () =>
        {
            let result = suggest(test.statement);
            assert.isEmpty(result);
        })
    });
});