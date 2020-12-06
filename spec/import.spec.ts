import {assert as assert} from 'chai';
import { ErrorMessage } from '../src/entities/errorMessage';
import { parse } from '../src/parser';

describe('Import Statement', function () 
{
    [
        { statement: 'import user from "./user.ts"', expected: {type: 'import', entity: [{name: 'user', default: true}], from: "./user.ts"}},
        { statement: 'import {books} from "some-package"', expected: {type: 'import', entity: [{name: 'books', default: false}], from: "some-package"}},
        { statement: 'import {books},{users} from "some-package"', expected: {type: 'import', entity: [{name: 'books', default: false},{name: 'users', default: false}], from: "some-package"}},
        { statement: 'import books,users from "some-package"', expected: {type: 'import', entity: [{name: 'books', default: true},{name: 'users', default: true}], from: "some-package"}},
        { statement: 'import {users,books,cars} from "../some/file.ts"', expected: {type: 'import', entity: [{name: 'users', default: false},{name: 'books', default: false},{name: 'cars', default: false}], from: "../some/file.ts"}},
        { statement: 'import users,{books} from "some-package"', expected: {type: 'import', entity: [{name: 'users', default: true},{name: 'books', default: false}], from: "some-package"}},
        { statement: 'import {books},users from "some-package"', expected: {type: 'import', entity: [{name: 'books', default: false},{name: 'users', default: true}], from: "some-package"}},
        { statement: 'import {books},users,{cars} from "some-package"', expected: {type: 'import', entity: [{name: 'books', default: false},{name: 'users', default: true},{name: 'cars', default: false}], from: "some-package"}},
        { statement: 'import books,{users},cars from "some-package"', expected: {type: 'import', entity: [{name: 'books', default: true},{name: 'users', default: false},{name: 'cars', default: true}], from: "some-package"}},
        { statement: 'import books,users,{cars} from "some-package"', expected: {type: 'import', entity: [{name: 'books', default: true},{name: 'users', default: true},{name: 'cars', default: false}], from: "some-package"}},
        { statement: 'import {books},{users},cars from "some-package"', expected: {type: 'import', entity: [{name: 'books', default: false},{name: 'users', default: false},{name: 'cars', default: true}], from: "some-package"}}
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
        { statement: 'import', expected: {error: "NoViableAltException", message: ErrorMessage.MISSING_ENTITY_NAME}},
        { statement: 'import 1', expected: {error: "NoViableAltException", message: ErrorMessage.MISSING_ENTITY_NAME}},
        { statement: 'import "a"', expected: {error: "NoViableAltException", message: ErrorMessage.MISSING_ENTITY_NAME}},
        { statement: 'import {}', expected: {error: "MismatchedTokenException", message: ErrorMessage.MISSING_ENTITY_NAME}},
        { statement: 'import {1}', expected: {error: "MismatchedTokenException", message: ErrorMessage.MISSING_ENTITY_NAME}},
        { statement: 'import a', expected: {error: "MismatchedTokenException", message: ErrorMessage.IMPORT_MISSING_FROM}},
        { statement: 'import a,', expected: {error: "NoViableAltException", message: ErrorMessage.MISSING_ENTITY_NAME}},
        { statement: 'import a,{', expected: {error: "MismatchedTokenException", message: ErrorMessage.MISSING_ENTITY_NAME}},
        { statement: 'import a,{b', expected: {error: "MismatchedTokenException", message: ErrorMessage.IMPORT_MISSING_CLOSING_CURLY_PARENTHESIS}},
        { statement: 'import from', expected: {error: "NoViableAltException", message: ErrorMessage.MISSING_ENTITY_NAME}},
        { statement: 'import a from', expected: {error: "MismatchedTokenException", message: ErrorMessage.IMPORT_MISSING_PACKAGE_NAME}},
        { statement: 'import a from b', expected: {error: "MismatchedTokenException", message: ErrorMessage.IMPORT_MISSING_PACKAGE_NAME}}
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