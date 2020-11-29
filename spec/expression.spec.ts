import {assert as assert} from 'chai';
import { ErrorMessage } from '../src/entities/errorMessage';
import { parseExpression } from '../src/parser';

describe('Expression', function () 
{
    [
        { operand: '=' },
        { operand: '<>' },
        { operand: '>' },
        { operand: '>=' },
        { operand: '<' },
        { operand: '<=' }
    ]
    .forEach(test => 
    {
        it(`Operand '${test.operand}' is valid.`, async () =>
        {
            let result = parseExpression(`key ${test.operand} "value"`);
            assert.deepEqual(result, { expression: `#key ${test.operand} :key`, 
                                       expressionAttributeNames: {'#key': 'key'},
                                       expressionAttributeValues: {':key': "value"}});
        })
    });
    [
        { value: "True", expected: true },
        { value: "FALSE", expected: false },
        { value: 0, expected: 0 },
        { value: -1, expected: -1 },
        { value: 123, expected: 123 },
        { value: '"word"', expected: "word" },
        { value: '"escaped\\"word\\""', expected: "escaped\\\"word\\\"" }
    ]
    .forEach(test => 
    {
        it(`Value '${test.value}' is valid.`, async () =>
        {
            let result = parseExpression(`key = ${test.value}`);
            assert.deepEqual(result, { expression: `#key = :key`, 
                                       expressionAttributeNames: {'#key': 'key'},
                                       expressionAttributeValues: {':key': test.expected}});
        })
    });

    [
        { statement: 'title = "A book"', 
          expected: { expression: "#title = :title", 
                      expressionAttributeNames: {'#title': 'title'},
                      expressionAttributeValues: {':title': "A book"}}},

        { statement: 'not title = "A book"', 
        expected: { expression: "not #title = :title", 
                    expressionAttributeNames: {'#title': 'title'},
                    expressionAttributeValues: {':title': "A book"}}},

        { statement: 'not (title = "A book")', 
          expected: { expression: "not (#title = :title)", 
                      expressionAttributeNames: {'#title': 'title'},
                      expressionAttributeValues: {':title': "A book"}}},

        { statement: 'age between 25 and 30', 
          expected: { expression: "#age between :age_between_1 and :age_between_2", 
                      expressionAttributeNames: {'#age': 'age'},
                      expressionAttributeValues: {':age_between_1': 25, ':age_between_2': 30}}},

        { statement: 'age in (10)', 
          expected: { expression: "#age in (:age_in_1)", 
                      expressionAttributeNames: {'#age': 'age'},
                      expressionAttributeValues: {':age_in_1': 10}}},

        { statement: 'age in (10,"str",true)', 
          expected: { expression: "#age in (:age_in_1,:age_in_2,:age_in_3)", 
                      expressionAttributeNames: {'#age': 'age'},
                      expressionAttributeValues: {':age_in_1': 10, ':age_in_2': "str", ':age_in_3': true}}},

        { statement: '((((((((((title = "A book"))))))))))', 
          expected: { expression: "((((((((((#title = :title))))))))))", 
                      expressionAttributeNames: {'#title': 'title'},
                      expressionAttributeValues: {':title': "A book"}}}, 
        
        { statement: 'attribute_exists(id)', 
          expected: { expression: "attribute_exists(#id)", 
                      expressionAttributeNames: {'#id': 'id'},
                      expressionAttributeValues: {}}},           
        
        { statement: 'attribute_not_exists(deleted)', 
          expected: { expression: "attribute_not_exists(#deleted)", 
                      expressionAttributeNames: {'#deleted': 'deleted'},
                      expressionAttributeValues: {}}},

        { statement: 'attribute_type(id,"N")', 
          expected: { expression: "attribute_type(#id,:id)", 
                      expressionAttributeNames: {'#id': 'id'},
                      expressionAttributeValues: {':id': 'N'}}},

        { statement: 'begins_with(author,"substring")', 
          expected: { expression: "begins_with(#author,:author)", 
                      expressionAttributeNames: {'#author': 'author'},
                      expressionAttributeValues: {':author': 'substring'}}},

        { statement: 'contains(header,"<HEAD>")', 
          expected: { expression: "contains(#header,:header)", 
                      expressionAttributeNames: {'#header': 'header'},
                      expressionAttributeValues: {':header': '<HEAD>'}}},         
        
        { statement: 'size(description) < 12', 
          expected: { expression: "size(#description) < :description", 
                      expressionAttributeNames: {'#description': 'description'},
                      expressionAttributeValues: {':description': 12}}},           
        ]
        .forEach(test => 
        {
            it(`Basic query '${test.statement}' is valid.`, async () =>
            {
                let result = parseExpression(test.statement);
                assert.deepEqual(result, test.expected);
            })
        });
    [
        { statement: 'age = 100 and name = "some one"', 
          expected: { expression: "#age = :age and #name = :name", 
                      expressionAttributeNames: {'#age': 'age', '#name': 'name'},
                      expressionAttributeValues: {':age': 100, ':name': 'some one'}}},
                         
        { statement: 'age < 100 and firstname <> "some" or lastname > "one"', 
          expected: { expression: "#age < :age and #firstname <> :firstname or #lastname > :lastname", 
                      expressionAttributeNames: {'#age': 'age', '#firstname': 'firstname', '#lastname': 'lastname'},
                      expressionAttributeValues: {':age': 100, ':firstname': 'some', ':lastname': 'one'}}},

        { statement: 'age = 100 or firstname <> "some" and lastname = "one"', 
          expected: { expression: "#age = :age or #firstname <> :firstname and #lastname = :lastname", 
                      expressionAttributeNames: {'#age': 'age', '#firstname': 'firstname', '#lastname': 'lastname'},
                      expressionAttributeValues: {':age': 100, ':firstname': 'some', ':lastname': 'one'}}},

        { statement: 'age < 100 and ((firstname <> "some") or lastname > "one")', 
          expected: { expression: "#age < :age and ((#firstname <> :firstname) or #lastname > :lastname)", 
                      expressionAttributeNames: {'#age': 'age', '#firstname': 'firstname', '#lastname': 'lastname'},
                      expressionAttributeValues: {':age': 100, ':firstname': 'some', ':lastname': 'one'}}},

        { statement: 'age < 100 and firstname <> "some" or lastname > "one" and title = "Mr."', 
          expected: { expression: "#age < :age and #firstname <> :firstname or #lastname > :lastname and #title = :title", 
                      expressionAttributeNames: {'#age': 'age', '#firstname': 'firstname', '#lastname': 'lastname', '#title': 'title'},
                      expressionAttributeValues: {':age': 100, ':firstname': 'some', ':lastname': 'one', ':title': 'Mr.'}}},

        { statement: '(   age    between 30 and  100 and (   size(  height  ) <> 42    or  not (lastname in ("one","two")     )) and attribute_exists(  createdTimestamp  )   or   attribute_not_exists(  deletedTimestamp )    ) or enabled = true and attribute_type( description ,  "NULL"  ) and not   begins_with(  year ,  "2020"  )   or contains( body , "html" ) ', 
          expected: { expression: "(#age between :age_between_1 and :age_between_2 and (size(#height) <> :height or not (#lastname in (:lastname_in_1,:lastname_in_2))) and attribute_exists(#createdTimestamp) or attribute_not_exists(#deletedTimestamp)) or #enabled = :enabled and attribute_type(#description,:description) and not begins_with(#year,:year) or contains(#body,:body)", 
                      expressionAttributeNames: {'#age': 'age', '#height': 'height', '#lastname': 'lastname', '#enabled': 'enabled', '#createdTimestamp': 'createdTimestamp', '#deletedTimestamp': 'deletedTimestamp', '#description': 'description', '#year': 'year', '#body': 'body'},
                      expressionAttributeValues: {':age_between_1': 30, ':age_between_2': 100, ':height': 42, ':lastname_in_1': 'one', ':lastname_in_2': "two", ':enabled': true, ':description': 'NULL', ':year': "2020", ':body': 'html'}}},
    ]
    .forEach(test => 
    {
        it(`Advance query '${test.statement}' is valid.`, async () =>
        {
            let result = parseExpression(test.statement);
            assert.deepEqual(result, test.expected);
        })
    });

    [
        { statement: 'key', expected: {error: "NoViableAltException", message: ErrorMessage.UNRECOGNIZED_COMMAND.replace('?', 'key')}},
        { statement: 'key = ', expected: {error: "NoViableAltException", message: ErrorMessage.UNEXPECTED_END_OF_STATEMENT}},
        { statement: 'key = something', expected: {error: "NoViableAltException", message: ErrorMessage.UNRECOGNIZED_COMMAND.replace('?', 'something')}},
        { statement: 'key = = true', expected: {error: "NoViableAltException", message: ErrorMessage.UNRECOGNIZED_COMMAND.replace('?', '=')}},
        { statement: '(key = true', expected: {error: "MismatchedTokenException", message: ErrorMessage.EXPRESSION_MISSING_PARENTHESIS}},
        { statement: 'key = true)', expected: {error: "NotAllInputParsedException", message: ErrorMessage.UNEXPECTED_TOKEN.replace('?', ')')}},
        { statement: '(key = true))', expected: {error: "NotAllInputParsedException", message: ErrorMessage.UNEXPECTED_TOKEN.replace('?', ')')}},
        { statement: '(key = true) and', expected: {error: "NoViableAltException", message: ErrorMessage.UNEXPECTED_END_OF_STATEMENT}},
        { statement: '(key = true) or', expected: {error: "NoViableAltException", message: ErrorMessage.UNEXPECTED_END_OF_STATEMENT}},
        { statement: '(key = true) or (key = false', expected: {error: "MismatchedTokenException", message: ErrorMessage.EXPRESSION_MISSING_PARENTHESIS}},
        { statement: 'attribute_exists()', expected: {error: "MismatchedTokenException", message: undefined}},
        { statement: 'attribute_exists(12', expected: {error: "MismatchedTokenException", message: undefined}},
        { statement: 'attribute_exists(true', expected: {error: "MismatchedTokenException", message: undefined}},
        { statement: 'attribute_exists(key', expected: {error: "MismatchedTokenException", message: undefined}},
        { statement: 'attribute_not_exists()', expected: {error: "MismatchedTokenException", message: undefined}},
        { statement: 'attribute_not_exists(12', expected: {error: "MismatchedTokenException", message: undefined}},
        { statement: 'attribute_not_exists(true', expected: {error: "MismatchedTokenException", message: undefined}},
        { statement: 'attribute_not_exists(', expected: {error: "MismatchedTokenException", message: undefined}},
        { statement: 'attribute_not_exists(12', expected: {error: "MismatchedTokenException", message: undefined}},
        { statement: 'attribute_not_exists("key"', expected: {error: "MismatchedTokenException", message: undefined}},
        { statement: 'attribute_not_exists(key', expected: {error: "MismatchedTokenException", message: undefined}},
        { statement: 'attribute_not_exists(key,', expected: {error: "MismatchedTokenException", message: undefined}},
        { statement: 'attribute_not_exists(key,type', expected: {error: "MismatchedTokenException", message: undefined}},
        { statement: 'attribute_not_exists(key,"type"', expected: {error: "MismatchedTokenException", message: undefined}},
        { statement: 'begins_with(', expected: {error: "MismatchedTokenException", message: undefined}},
        { statement: 'begins_with(12', expected: {error: "MismatchedTokenException", message: undefined}},
        { statement: 'begins_with("key"', expected: {error: "MismatchedTokenException", message: undefined}},
        { statement: 'begins_with(key', expected: {error: "MismatchedTokenException", message: undefined}},
        { statement: 'begins_with(key,', expected: {error: "MismatchedTokenException", message: undefined}},
        { statement: 'begins_with(key,str', expected: {error: "MismatchedTokenException", message: undefined}},
        { statement: 'begins_with(key,"str"', expected: {error: "MismatchedTokenException", message: undefined}},
        { statement: 'contains(', expected: {error: "MismatchedTokenException", message: undefined}},
        { statement: 'contains(12', expected: {error: "MismatchedTokenException", message: undefined}},
        { statement: 'contains("key"', expected: {error: "MismatchedTokenException", message: undefined}},
        { statement: 'contains(key', expected: {error: "MismatchedTokenException", message: undefined}},
        { statement: 'contains(key,', expected: {error: "MismatchedTokenException", message: undefined}},
        { statement: 'contains(key,str', expected: {error: "MismatchedTokenException", message: undefined}},
        { statement: 'contains(key,"str"', expected: {error: "MismatchedTokenException", message: undefined}},
        { statement: 'attribute_type(', expected: {error: "MismatchedTokenException", message: undefined}},
        { statement: 'size()', expected: {error: "MismatchedTokenException", message: undefined}},
        { statement: 'size(12', expected: {error: "MismatchedTokenException", message: undefined}},
        { statement: 'size(true', expected: {error: "MismatchedTokenException", message: undefined}},
        { statement: 'size(key', expected: {error: "MismatchedTokenException", message: undefined}},
    ]
    .forEach(test => 
    {
        it(`'${test.statement}' is invalid because '${test.expected.message}'`, async () =>
        {
            let error = undefined;
            try
            {
                parseExpression(test.statement);
            }
            catch(e)
            {
                error = e;
            }
            
            assert.isDefined(error);
            assert.equal(error.name, test.expected.error);
            if(test.expected.message)
            {
                assert.equal(error.message, test.expected.message);
            }
        })
    });
});