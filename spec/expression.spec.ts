import {assert as assert} from 'chai';
import { ErrorMessage } from '../src/entities/errorMessage';
import { parseExpression } from '../src/parser';
import { resetCollisionIndex } from '../src/parsers/statementSemanticVisitor';

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
        { value: "true", expected: true },
        { value: "false", expected: false },
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
          expected: { expression: "#age___1 between :age___1_between_1 and :age___1_between_2", 
                      expressionAttributeNames: {'#age___1': 'age'},
                      expressionAttributeValues: {':age___1_between_1': 25, ':age___1_between_2': 30}}},

        { statement: 'age in (10)', 
          expected: { expression: "#age___1 in (:age___1_in_1)", 
                      expressionAttributeNames: {'#age___1': 'age'},
                      expressionAttributeValues: {':age___1_in_1': 10}}},

        { statement: 'age in (10,"str",true)', 
          expected: { expression: "#age___1 in (:age___1_in_1,:age___1_in_2,:age___1_in_3)", 
                      expressionAttributeNames: {'#age___1': 'age'},
                      expressionAttributeValues: {':age___1_in_1': 10, ':age___1_in_2': "str", ':age___1_in_3': true}}},

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
                resetCollisionIndex();

                let result = parseExpression(test.statement);
                assert.deepEqual(result, test.expected);
            })
        });
    [
        { statement: 'age = 100 and name = "some one"', 
          expected: { expression: "#age = :age and #name = :name", 
                      expressionAttributeNames: {'#age': 'age', '#name': 'name'},
                      expressionAttributeValues: {':age': 100, ':name': 'some one'}}},

        { statement: 'age > 21 and age < 65', 
          expected: { expression: "#age > :age and #age___1 < :age___1", 
                      expressionAttributeNames: {'#age': 'age', '#age___1': 'age'},
                      expressionAttributeValues: {':age': 21, ':age___1': 65}}},

        { statement: 'age > 21 and age < 65 and age <> 50', 
          expected: { expression: "#age > :age and #age___2 < :age___2 and #age___1 <> :age___1", 
                      expressionAttributeNames: {'#age': 'age', '#age___2': 'age', '#age___1': 'age'},
                      expressionAttributeValues: {':age': 21, ':age___2': 65, ':age___1': 50}}},

        { statement: 'age > 21 and age_2 < 65 and age <> 50', 
          expected: { expression: "#age > :age and #age_2 < :age_2 and #age___1 <> :age___1", 
                      expressionAttributeNames: {'#age': 'age', '#age_2': 'age_2', '#age___1': 'age'},
                      expressionAttributeValues: {':age': 21, ':age_2': 65, ':age___1': 50}}},
                         
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
          expected: { expression: "(#age___1 between :age___1_between_1 and :age___1_between_2 and (size(#height) <> :height or not (#lastname___2 in (:lastname___2_in_1,:lastname___2_in_2))) and attribute_exists(#createdTimestamp) or attribute_not_exists(#deletedTimestamp)) or #enabled = :enabled and attribute_type(#description,:description) and not begins_with(#year,:year) or contains(#body,:body)", 
                      expressionAttributeNames: {'#age___1': 'age', '#height': 'height', '#lastname___2': 'lastname', '#enabled': 'enabled', '#createdTimestamp': 'createdTimestamp', '#deletedTimestamp': 'deletedTimestamp', '#description': 'description', '#year': 'year', '#body': 'body'},
                      expressionAttributeValues: {':age___1_between_1': 30, ':age___1_between_2': 100, ':height': 42, ':lastname___2_in_1': 'one', ':lastname___2_in_2': "two", ':enabled': true, ':description': 'NULL', ':year': "2020", ':body': 'html'}}},
    ]
    .forEach(test => 
    {
        it(`Advance query '${test.statement}' is valid.`, async () =>
        {
            resetCollisionIndex();

            let result = parseExpression(test.statement);
            assert.deepEqual(result, test.expected);
        })
    });

    [

        { statement: 'age > 21 and age < 65', 
          expected: { expression: "#age > :age and #age___1 < :age___1", 
                      expressionAttributeNames: {'#age': 'age', '#age___1': 'age'},
                      expressionAttributeValues: {':age': 21, ':age___1': 65}}},

        { statement: 'age > 21 and age < 65 and age <> 50', 
          expected: { expression: "#age > :age and #age___2 < :age___2 and #age___1 <> :age___1", 
                      expressionAttributeNames: {'#age': 'age', '#age___2': 'age', '#age___1': 'age'},
                      expressionAttributeValues: {':age': 21, ':age___2': 65, ':age___1': 50}}},

        { statement: 'age > 21 and age_in_years < 65 and age <> 50', 
          expected: { expression: "#age > :age and #age_in_years < :age_in_years and #age___1 <> :age___1", 
                      expressionAttributeNames: {'#age': 'age', '#age_in_years': 'age_in_years', '#age___1': 'age'},
                      expressionAttributeValues: {':age': 21, ':age_in_years': 65, ':age___1': 50}}},

        { statement: 'attribute_exists(age) and attribute_type(age, "N") or age between 21 and 65 and size(age) < 100 or age in (30,40,50,60) or begins_with(age, "3")', 
          expected: { expression: 'attribute_exists(#age) and attribute_type(#age___5,:age___5) or #age___1 between :age___1_between_1 and :age___1_between_2 and size(#age___3) < :age___3 or #age___2 in (:age___2_in_1,:age___2_in_2,:age___2_in_3,:age___2_in_4) or begins_with(#age___4,:age___4)', 
                      expressionAttributeNames: {'#age': 'age', '#age___5': 'age', '#age___1': 'age', '#age___3': 'age', '#age___2': 'age', '#age___4': 'age'},
                      expressionAttributeValues: {':age___5': "N", ':age___1_between_1': 21, ':age___1_between_2': 65, ':age___3': 100, ':age___2_in_1': 30, ':age___2_in_2': 40, ':age___2_in_3': 50, ':age___2_in_4': 60, ':age___4': '3'}}},

        { statement: 'age=1 and age<2 and age<>3 or age>4', 
          expected: { expression: "#age = :age and #age___3 < :age___3 and #age___1 <> :age___1 or #age___2 > :age___2", 
                      expressionAttributeNames: {'#age': 'age', '#age___3': 'age', '#age___1': 'age', '#age___2': 'age'},
                      expressionAttributeValues: {':age': 1, ':age___3': 2, ':age___1': 3, ':age___2': 4}}},

        { statement: '(age in (10) and age in (20)) or age in (30)', 
          expected: { expression: "(#age___1 in (:age___1_in_1) and #age___2 in (:age___2_in_1)) or #age___3 in (:age___3_in_1)", 
                      expressionAttributeNames: {'#age___1': 'age', '#age___2': 'age', '#age___3': 'age'},
                      expressionAttributeValues: {':age___1_in_1': 10, ':age___2_in_1': 20, ':age___3_in_1': 30}}},

        { statement: 'age between 1 and 2 and (age between 3 and 4 or age between 5 and 6)', 
          expected: { expression: "#age___1 between :age___1_between_1 and :age___1_between_2 and (#age___2 between :age___2_between_1 and :age___2_between_2 or #age___3 between :age___3_between_1 and :age___3_between_2)", 
                      expressionAttributeNames: {'#age___1': 'age', '#age___2': 'age', '#age___3': 'age'},
                      expressionAttributeValues: {':age___1_between_1': 1, ':age___1_between_2': 2, ':age___2_between_1': 3, ':age___2_between_2': 4, ':age___3_between_1': 5, ':age___3_between_2': 6}}}
    ]
    .forEach(test => 
    {
        it(`Duplicate properties query '${test.statement}' is valid.`, async () =>
        {
            resetCollisionIndex();

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
        { statement: 'attribute_exists()', expected: {error: "MismatchedTokenException", message: ErrorMessage.MISSING_PROPERTY_NAME}},
        { statement: 'attribute_exists(12', expected: {error: "MismatchedTokenException", message: ErrorMessage.MISSING_PROPERTY_NAME}},
        { statement: 'attribute_exists(true', expected: {error: "MismatchedTokenException", message: ErrorMessage.MISSING_PROPERTY_NAME}},
        { statement: 'attribute_exists(key', expected: {error: "MismatchedTokenException", message: ErrorMessage.EXPRESSION_MISSING_PARENTHESIS}},
        { statement: 'attribute_not_exists()', expected: {error: "MismatchedTokenException", message: ErrorMessage.MISSING_PROPERTY_NAME}},
        { statement: 'attribute_not_exists(12', expected: {error: "MismatchedTokenException", message: ErrorMessage.MISSING_PROPERTY_NAME}},
        { statement: 'attribute_not_exists(true', expected: {error: "MismatchedTokenException", message: ErrorMessage.MISSING_PROPERTY_NAME}},
        { statement: 'attribute_not_exists(', expected: {error: "MismatchedTokenException", message: ErrorMessage.MISSING_PROPERTY_NAME}},
        { statement: 'attribute_not_exists("key"', expected: {error: "MismatchedTokenException", message: ErrorMessage.MISSING_PROPERTY_NAME}},
        { statement: 'attribute_not_exists(key', expected: {error: "MismatchedTokenException", message: ErrorMessage.EXPRESSION_MISSING_PARENTHESIS}},
        { statement: 'attribute_not_exists(key,', expected: {error: "MismatchedTokenException", message: ErrorMessage.EXPRESSION_MISSING_PARENTHESIS}},,
        { statement: 'begins_with(', expected: {error: "MismatchedTokenException", message: ErrorMessage.MISSING_PROPERTY_NAME}},
        { statement: 'begins_with(12', expected: {error: "MismatchedTokenException", message: ErrorMessage.MISSING_PROPERTY_NAME}},
        { statement: 'begins_with("key"', expected: {error: "MismatchedTokenException", message: ErrorMessage.MISSING_PROPERTY_NAME}},
        { statement: 'begins_with(key', expected: {error: "MismatchedTokenException", message: ErrorMessage.EXPRESSION_MISSING_SEARCH_STRING}},
        { statement: 'begins_with(key,', expected: {error: "MismatchedTokenException", message: ErrorMessage.EXPRESSION_MISSING_SEARCH_STRING}},
        { statement: 'begins_with(key,str', expected: {error: "MismatchedTokenException", message: ErrorMessage.EXPRESSION_MISSING_SEARCH_STRING}},
        { statement: 'begins_with(key,"str"', expected: {error: "MismatchedTokenException", message: ErrorMessage.EXPRESSION_MISSING_PARENTHESIS}},
        { statement: 'contains(', expected: {error: "MismatchedTokenException", message: ErrorMessage.MISSING_PROPERTY_NAME}},
        { statement: 'contains(12', expected: {error: "MismatchedTokenException", message: ErrorMessage.MISSING_PROPERTY_NAME}},
        { statement: 'contains("key"', expected: {error: "MismatchedTokenException", message: ErrorMessage.MISSING_PROPERTY_NAME}},
        { statement: 'contains(key', expected: {error: "MismatchedTokenException", message: ErrorMessage.EXPRESSION_MISSING_SEARCH_STRING}},
        { statement: 'contains(key,', expected: {error: "MismatchedTokenException", message: ErrorMessage.EXPRESSION_MISSING_SEARCH_STRING}},
        { statement: 'contains(key,str', expected: {error: "MismatchedTokenException", message: ErrorMessage.EXPRESSION_MISSING_SEARCH_STRING}},
        { statement: 'contains(key,"str"', expected: {error: "MismatchedTokenException", message: ErrorMessage.EXPRESSION_MISSING_PARENTHESIS}},
        { statement: 'attribute_type(', expected: {error: "MismatchedTokenException", message: ErrorMessage.MISSING_PROPERTY_NAME}},
        { statement: 'attribute_type(key', expected: {error: "MismatchedTokenException", message: ErrorMessage.EXPRESSION_MISSING_PROPERTY_TYPE}},
        { statement: 'attribute_type(key,', expected: {error: "MismatchedTokenException", message: ErrorMessage.EXPRESSION_MISSING_PROPERTY_TYPE}},
        { statement: 'attribute_type(key,1', expected: {error: "MismatchedTokenException", message: ErrorMessage.EXPRESSION_MISSING_PROPERTY_TYPE}},
        { statement: 'attribute_type(key,"S"', expected: {error: "MismatchedTokenException", message: ErrorMessage.EXPRESSION_MISSING_PARENTHESIS}},
        { statement: 'size()', expected: {error: "MismatchedTokenException", message: ErrorMessage.MISSING_PROPERTY_NAME}},
        { statement: 'size(12', expected: {error: "MismatchedTokenException", message: ErrorMessage.MISSING_PROPERTY_NAME}},
        { statement: 'size(true', expected: {error: "MismatchedTokenException", message: ErrorMessage.MISSING_PROPERTY_NAME}},
        { statement: 'size(key', expected: {error: "MismatchedTokenException", message: ErrorMessage.EXPRESSION_MISSING_PARENTHESIS}},
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