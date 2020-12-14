import {assert as assert} from 'chai';
import { ErrorMessage } from '../src/entities/errorMessage';
import { parse } from '../src/parser';

describe('Unload Table Statement', function () 
{
    [
        { statement: 'UNLOAD TABLE user', expected: {type: 'unload_table', name: 'user'}}
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
        { statement: 'UNLOAD', expected: {error: "NoViableAltException", message: ErrorMessage.UNRECOGNIZED_COMMAND.replace('?', 'UNLOAD')}},
        { statement: 'UNLOAD TABLE', expected: {error: "MismatchedTokenException", message: ErrorMessage.MISSING_ENTITY_NAME}},
        { statement: 'UNLOAD TABLE FOR user', expected: {error: "MismatchedTokenException", message: ErrorMessage.MISSING_ENTITY_NAME}}
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