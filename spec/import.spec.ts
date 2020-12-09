import {assert as assert} from 'chai';
import { ErrorMessage } from '../src/entities/errorMessage';
import { parse } from '../src/parser';

describe('Import Statement', function () 
{
    [
        { statement: 'import user from "./user.ts"', expected: {type: 'import', entity: [{name: 'user', as: 'user', default: true}], from: "./user.ts"}},
        { statement: 'import user as user_alias from "./user.ts"', expected: {type: 'import', entity: [{name: 'user', as: 'user_alias', default: true}], from: "./user.ts"}},
        { statement: 'import {books} from "some-package"', expected: {type: 'import', entity: [{name: 'books', as: 'books', default: false}], from: "some-package"}},
        { statement: 'import {books as books_alias} from "some-package"', expected: {type: 'import', entity: [{name: 'books', as: 'books_alias', default: false}], from: "some-package"}},
        { statement: 'import {books},{users} from "some-package"', expected: {type: 'import', entity: [{name: 'books', as: 'books', default: false},{name: 'users', as: 'users', default: false}], from: "some-package"}},
        { statement: 'import {books as books_alias},{users as users_alias} from "some-package"', expected: {type: 'import', entity: [{name: 'books', as: 'books_alias', default: false},{name: 'users', as: 'users_alias', default: false}], from: "some-package"}},
        { statement: 'import books,users from "some-package"', expected: {type: 'import', entity: [{name: 'books', as: 'books', default: true},{name: 'users', as: 'users', default: true}], from: "some-package"}},
        { statement: 'import books as books_alias,users as users_alias from "some-package"', expected: {type: 'import', entity: [{name: 'books', as: 'books_alias', default: true},{name: 'users', as: 'users_alias', default: true}], from: "some-package"}},
        { statement: 'import {users,books,cars} from "../some/file.ts"', expected: {type: 'import', entity: [{name: 'users', as: 'users', default: false},{name: 'books', as: 'books', default: false},{name: 'cars', as: 'cars', default: false}], from: "../some/file.ts"}},
        { statement: 'import users,{books} from "some-package"', expected: {type: 'import', entity: [{name: 'users', as: 'users', default: true},{name: 'books', as: 'books', default: false}], from: "some-package"}},
        { statement: 'import {books},users from "some-package"', expected: {type: 'import', entity: [{name: 'books', as: 'books', default: false},{name: 'users', as: 'users', default: true}], from: "some-package"}},
        { statement: 'import {books},users,{cars} from "some-package"', expected: {type: 'import', entity: [{name: 'books', as: 'books', default: false},{name: 'users', as: 'users', default: true},{name: 'cars', as: 'cars', default: false}], from: "some-package"}},
        { statement: 'import books,{users},cars from "some-package"', expected: {type: 'import', entity: [{name: 'books', as: 'books', default: true},{name: 'users', as: 'users', default: false},{name: 'cars', as: 'cars', default: true}], from: "some-package"}},
        { statement: 'import books,users,{cars} from "some-package"', expected: {type: 'import', entity: [{name: 'books', as: 'books', default: true},{name: 'users', as: 'users', default: true},{name: 'cars', as: 'cars', default: false}], from: "some-package"}},
        { statement: 'import {books},{users},cars from "some-package"', expected: {type: 'import', entity: [{name: 'books', as: 'books', default: false},{name: 'users', as: 'users', default: false},{name: 'cars', as: 'cars', default: true}], from: "some-package"}},
        { statement: 'import birds, horses as horses_alias, schools, {pencils, books as books_alias, dogs, users as users_alias}, cars as cars_alias, pigs, cats as cats_alias from "some-package"', expected: {type: 'import', entity: [{name: 'birds', as: 'birds', default: true},{name: 'horses', as: 'horses_alias', default: true},{name: 'schools', as: 'schools', default: true},{name: 'pencils', as: 'pencils', default: false},{name: 'books', as: 'books_alias', default: false},{name: 'dogs', as: 'dogs', default: false},{name: 'users', as: 'users_alias', default: false},{name: 'cars', as: 'cars_alias', default: true},{name: 'pigs', as: 'pigs', default: true},{name: 'cats', as: 'cats_alias', default: true}], from: "some-package"}}
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