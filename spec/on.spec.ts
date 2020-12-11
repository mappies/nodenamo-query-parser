import {assert as assert} from 'chai';
import { ErrorMessage } from '../src/entities/errorMessage';
import { parse } from '../src/parser';
import { resetCollisionIndex } from '../src/parsers/statementSemanticVisitor';

describe('On Statement', function () 
{
    describe('SET', () =>
    {    
        [
            { statement: 'on 1 from users set name="some one"', 
              expected: {type: 'on', id: 1, from: 'users', 
                        set: {setExpressions: ["#name___1 = :name___1"], expressionAttributeNames: {'#name___1': 'name'}, expressionAttributeValues: {':name___1': 'some one'}},
                        add: undefined,
                        remove: undefined,
                        delete: undefined,
                        where: undefined,
                        versionCheck: undefined}},
            { statement: 'on "1" from users set name = "some one", age = 25', 
              expected: {type: 'on', id: "1", from: 'users', 
                        set: {setExpressions: ["#name___1 = :name___1", "#age___2 = :age___2"], expressionAttributeNames: {'#name___1': 'name', '#age___2': 'age'}, expressionAttributeValues: {':name___1': 'some one', ':age___2': 25}},
                        add: undefined,
                        remove: undefined,
                        delete: undefined,
                        where: undefined,
                        versionCheck: undefined}},
            { statement: 'on "1" from users set name = "some one" set age = 25', 
              expected: {type: 'on', id: "1", from: 'users', 
                        set: {setExpressions: ["#name___1 = :name___1", "#age___2 = :age___2"], expressionAttributeNames: {'#name___1': 'name', '#age___2': 'age'}, expressionAttributeValues: {':name___1': 'some one', ':age___2': 25}},
                        add: undefined,
                        remove: undefined,
                        delete: undefined,
                        where: undefined,
                        versionCheck: undefined}},
            { statement: 'on "1" from users set name = "some one", age = 25, enabled = true', 
              expected: {type: 'on', id: "1", from: 'users', 
                        set: {setExpressions: ["#name___1 = :name___1", "#age___2 = :age___2", "#enabled___3 = :enabled___3"], expressionAttributeNames: {'#name___1': 'name', '#age___2': 'age', '#enabled___3': 'enabled'}, expressionAttributeValues: {':name___1': 'some one', ':age___2': 25, ':enabled___3': true}},
                        add: undefined,
                        remove: undefined,
                        delete: undefined,
                        where: undefined,
                        versionCheck: undefined}},
            { statement: 'on "1" from users set name = "some one" set age = 25, enabled = true', 
              expected: {type: 'on', id: "1", from: 'users', 
                        set: {setExpressions: ["#name___1 = :name___1", "#age___2 = :age___2", "#enabled___3 = :enabled___3"], expressionAttributeNames: {'#name___1': 'name', '#age___2': 'age', '#enabled___3': 'enabled'}, expressionAttributeValues: {':name___1': 'some one', ':age___2': 25, ':enabled___3': true}},
                        add: undefined,
                        remove: undefined,
                        delete: undefined,
                        where: undefined,
                        versionCheck: undefined}},
            { statement: 'on "1" from users set name = "some one" set age = 25 set enabled = true', 
              expected: {type: 'on', id: "1", from: 'users', 
                        set: {setExpressions: ["#name___1 = :name___1", "#age___2 = :age___2", "#enabled___3 = :enabled___3"], expressionAttributeNames: {'#name___1': 'name', '#age___2': 'age', '#enabled___3': 'enabled'}, expressionAttributeValues: {':name___1': 'some one', ':age___2': 25, ':enabled___3': true}},
                        add: undefined,
                        remove: undefined,
                        delete: undefined,
                        where: undefined,
                        versionCheck: undefined}},
            { statement: 'on 1 from users set name="some one" where begins_with(name, "some") with version check', 
              expected: {type: 'on', id: 1, from: 'users', 
                        set: {setExpressions: ["#name___1 = :name___1"], expressionAttributeNames: {'#name___1': 'name'}, expressionAttributeValues: {':name___1': 'some one'}},
                        add: undefined,
                        remove: undefined,
                        delete: undefined,
                        where: {conditionExpression: "begins_with(#name,:name)", expressionAttributeNames: {"#name": "name"}, expressionAttributeValues: {":name": "some"}},
                        versionCheck: true}},
        ]
        .forEach(test => 
        {
            it(`'${test.statement}' is valid.`, async () =>
            {
                resetCollisionIndex()

                let result = parse(test.statement);
                assert.deepEqual(result, test.expected);
            })
        });

        [
            { statement: 'on 1 from table set', expected: {error: "MismatchedTokenException", message: ErrorMessage.MISSING_PROPERTY_NAME}},
            { statement: 'on 1 from table set a', expected: {error: "MismatchedTokenException", message: ErrorMessage.ON_SET_MISSING_EQUAL}},
            { statement: 'on 1 from table set a < 1', expected: {error: "MismatchedTokenException", message: ErrorMessage.ON_SET_MISSING_EQUAL}},
            { statement: 'on 1 from table set a =', expected: {error: "NoViableAltException", message: ErrorMessage.UNEXPECTED_END_OF_STATEMENT}},
            { statement: 'on 1 from table set a = b', expected: {error: "NoViableAltException", message: ErrorMessage.UNRECOGNIZED_COMMAND.replace('?', 'b')}},
            { statement: 'on 1 from table set a = 1,', expected: {error: "MismatchedTokenException", message: ErrorMessage.MISSING_PROPERTY_NAME}},
            { statement: 'on 1 from table set a = 1, a', expected: {error: "MismatchedTokenException", message: ErrorMessage.ON_SET_MISSING_EQUAL}},
            { statement: 'on 1 from table set a = 1, a =', expected: {error: "NoViableAltException", message: ErrorMessage.UNEXPECTED_END_OF_STATEMENT}}
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

    describe('ADD', () =>
    {    
        [
            { statement: 'on 1 from users add age 12', 
              expected: {type: 'on', id: 1, from: 'users', 
                        set: undefined,
                        add: {addExpressions: ["#age___1 :age___1"], expressionAttributeNames: {'#age___1': 'age'}, expressionAttributeValues: {':age___1': 12}},
                        remove: undefined,
                        delete: undefined,
                        where: undefined,
                        versionCheck: undefined}},
            { statement: 'on "1" from users add count 1, age 2', 
              expected: {type: 'on', id: "1", from: 'users', 
                        set: undefined,
                        add: {addExpressions: ["#count___1 :count___1", "#age___2 :age___2"], expressionAttributeNames: {'#count___1': 'count', '#age___2': 'age'}, expressionAttributeValues: {':count___1': 1, ':age___2': 2}},
                        remove: undefined,
                        delete: undefined,
                        where: undefined,
                        versionCheck: undefined}},
            { statement: 'on "1" from users add count 100 add age 25', 
              expected: {type: 'on', id: "1", from: 'users', 
                        set: undefined,
                        add: {addExpressions: ["#count___1 :count___1", "#age___2 :age___2"], expressionAttributeNames: {'#count___1': 'count', '#age___2': 'age'}, expressionAttributeValues: {':count___1': 100, ':age___2': 25}},
                        remove: undefined,
                        delete: undefined,
                        where: undefined,
                        versionCheck: undefined}},
            { statement: 'on "1" from users add count 100 add age 25 add viewed 1', 
              expected: {type: 'on', id: "1", from: 'users', 
                        set: undefined,
                        add: {addExpressions: ["#count___1 :count___1", "#age___2 :age___2", "#viewed___3 :viewed___3"], expressionAttributeNames: {'#count___1': 'count', '#age___2': 'age', '#viewed___3': 'viewed'}, expressionAttributeValues: {':count___1': 100, ':age___2': 25, ':viewed___3': 1}},
                        remove: undefined,
                        delete: undefined,
                        where: undefined,
                        versionCheck: undefined}},
            { statement: 'on "1" from users add count 100, age 25, viewed 1', 
              expected: {type: 'on', id: "1", from: 'users', 
                        set: undefined,
                        add: {addExpressions: ["#count___1 :count___1", "#age___2 :age___2", "#viewed___3 :viewed___3"], expressionAttributeNames: {'#count___1': 'count', '#age___2': 'age', '#viewed___3': 'viewed'}, expressionAttributeValues: {':count___1': 100, ':age___2': 25, ':viewed___3': 1}},
                        remove: undefined,
                        delete: undefined,
                        where: undefined,
                        versionCheck: undefined}},
            { statement: 'on "1" from users add count 100 add age 25, viewed 1', 
              expected: {type: 'on', id: "1", from: 'users', 
                        set: undefined,
                        add: {addExpressions: ["#count___1 :count___1", "#age___2 :age___2", "#viewed___3 :viewed___3"], expressionAttributeNames: {'#count___1': 'count', '#age___2': 'age', '#viewed___3': 'viewed'}, expressionAttributeValues: {':count___1': 100, ':age___2': 25, ':viewed___3': 1}},
                        remove: undefined,
                        delete: undefined,
                        where: undefined,
                        versionCheck: undefined}},
            { statement: 'on 1 from users add count 100, age 25 add viewed 1 where begins_with(name, "some") with version check', 
              expected: {type: 'on', id: 1, from: 'users', 
                        set: undefined,
                        add: {addExpressions: ["#count___1 :count___1", "#age___2 :age___2", "#viewed___3 :viewed___3"], expressionAttributeNames: {'#count___1': 'count', '#age___2': 'age', '#viewed___3': 'viewed'}, expressionAttributeValues: {':count___1': 100, ':age___2': 25, ':viewed___3': 1}},
                        remove: undefined,
                        delete: undefined,
                        where: {conditionExpression: "begins_with(#name,:name)", expressionAttributeNames: {"#name": "name"}, expressionAttributeValues: {":name": "some"}},
                        versionCheck: true}},
        ]
        .forEach(test => 
        {
            it(`'${test.statement}' is valid.`, async () =>
            {
                resetCollisionIndex()

                let result = parse(test.statement);
                assert.deepEqual(result, test.expected);
            })
        });

        [
            { statement: 'on 1 from table add', expected: {error: "MismatchedTokenException", message: ErrorMessage.MISSING_PROPERTY_NAME}},
            { statement: 'on 1 from table add a', expected: {error: "MismatchedTokenException", message: ErrorMessage.ON_ADD_MISSING_NUMBER}},
            { statement: 'on 1 from table add a < 1', expected: {error: "MismatchedTokenException", message: ErrorMessage.ON_ADD_MISSING_NUMBER}},
            { statement: 'on 1 from table add a =', expected: {error: "MismatchedTokenException", message: ErrorMessage.ON_ADD_MISSING_NUMBER}},
            { statement: 'on 1 from table add a b', expected: {error: "MismatchedTokenException", message: ErrorMessage.ON_ADD_MISSING_NUMBER}},
            { statement: 'on 1 from table add a true,', expected: {error: "MismatchedTokenException", message: ErrorMessage.ON_ADD_MISSING_NUMBER}},
            { statement: 'on 1 from table add a 1, b', expected: {error: "MismatchedTokenException", message: ErrorMessage.ON_ADD_MISSING_NUMBER}},
            { statement: 'on 1 from table add a 1, b =', expected: {error: "MismatchedTokenException", message: ErrorMessage.ON_ADD_MISSING_NUMBER}}
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

    [
        { statement: 'on ', expected: {error: "NoViableAltException", message: ErrorMessage.MISSING_OBJECT_ID}},
        { statement: 'on true', expected: {error: "NoViableAltException", message: ErrorMessage.MISSING_OBJECT_ID}},
        { statement: 'on 1', expected: {error: "MismatchedTokenException", message: ErrorMessage.ON_MISSING_FROM}},
        { statement: 'on 1 from', expected: {error: "MismatchedTokenException", message: ErrorMessage.MISSING_ENTITY_NAME}},
        { statement: 'on 1 from table', expected: {error: "NoViableAltException", message: ErrorMessage.OR_MISSING_EXPRESSION}}
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