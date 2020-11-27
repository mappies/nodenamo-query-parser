import {assert as assert} from 'chai';
import { ErrorMessage } from '../src/entities/errorMessage';
import { parseKeyCondition } from '../src/parser';

describe('Expression', function () 
{
    [
        { statement: 'title = "A book"', 
          expected: { expression: "#title = :title", 
                      expressionAttributeNames: {'#title': 'title'},
                      expressionAttributeValues: {':title': "A book"}}},

        { statement: 'age = 100', 
          expected: { expression: "#age = :age", 
                      expressionAttributeNames: {'#age': 'age'},
                      expressionAttributeValues: {':age': 100}}},     
                         
        { statement: 'age = 100 and name = "some one"', 
          expected: { expression: "#age = :age and #name = :name", 
                      expressionAttributeNames: {'#age': 'age', '#name': 'name'},
                      expressionAttributeValues: {':age': 100, ':name': 'some one'}}},
                         
        { statement: 'age < 100 and firstname <> "some" or lastname > "one"', 
        expected: { expression: "#age < :age and #firstname <> :firstname or #lastname > :lastname", 
                    expressionAttributeNames: {'#age': 'age', '#firstname': 'firstname', '#lastname': 'lastname'},
                    expressionAttributeValues: {':age': 100, ':firstname': 'some', ':lastname': 'one'}}},

        { statement: 'age < 100 and ((firstname <> "some") or lastname > "one")', 
        expected: { expression: "#age < :age and ((#firstname <> :firstname) or #lastname > :lastname)", 
                    expressionAttributeNames: {'#age': 'age', '#firstname': 'firstname', '#lastname': 'lastname'},
                    expressionAttributeValues: {':age': 100, ':firstname': 'some', ':lastname': 'one'}}},
    ]
    .forEach(test => 
    {
        it(`'${test.statement}' is valid.`, async () =>
        {
            let result = parseKeyCondition(test.statement);
            assert.deepEqual(result, test.expected);
        })
    });
});