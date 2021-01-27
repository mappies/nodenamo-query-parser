import { Lexer } from 'chevrotain';
import { Token } from './entities/token';
import { IStatement } from './interfaces/IStatement';
import { StatementParser } from './parsers/statementParser';
import { StatementSemanticVisitor } from './parsers/statementSemanticVisitor';
import { RuleName } from './entities/ruleName';
import { IDescribeStatement } from './interfaces/IDescribeStatement';

export { IStatement } from './interfaces/IStatement';
export { IUpdateStatement } from './interfaces/IUpdateStatement';
export { IInsertStatement } from './interfaces/IInsertStatement';
export { IGetStatement } from './interfaces/IGetStatement';
export { IDeleteStatement } from './interfaces/IDeleteStatement';
export { IFindStatement } from './interfaces/IFindStatement';
export { IListStatement } from './interfaces/IListStatement';
export { ICreateTableStatement } from './interfaces/ICreateTableStatement';
export { IDeleteTableStatement } from './interfaces/IDeleteTableStatement';
export { IShowTablesStatement } from './interfaces/IShowTablesStatement';
export { IUnloadTableStatement } from './interfaces/IUnloadTableStatement';
export { IImportStatement } from './interfaces/IImportStatement';
export { IExplainStatement } from './interfaces/IExplainStatement';
export { IOnStatement } from './interfaces/IOnStatement'
export { IDescribeStatement } from './interfaces/IDescribeStatement'

let lexer = new Lexer(Token.AllTokens);
let parser = new StatementParser();

export function parse(text): IStatement
{
    parser.input = lexer.tokenize(text + ' ').tokens;

    let cst = parser.statement();

    if (parser.errors.length > 0) 
    {
        throw parser.errors[0]
    }

    return new StatementSemanticVisitor().visit(cst)
}

export function suggest(text): string[]
{
    let lex = lexer.tokenize(text + ' ');

    if(lex.errors.length > 0) return [];

    let suggestions = parser.computeContentAssist(RuleName.Statement, lex.tokens);

    return [...new Set(suggestions.map(suggestion => suggestion.nextTokenType.LABEL).sort())];
}

export function parseExpression(text) 
{
    parser.input = lexer.tokenize(text + ' ').tokens;

    let cst = parser.expression();

    if (parser.errors.length > 0) 
    {
        throw parser.errors[0]
    }

    return new StatementSemanticVisitor().visit(cst)
}

export function parseJsonObject(text) 
{
    parser.input = lexer.tokenize(text + ' ').tokens;

    let cst = parser.jsonObject();

    if (parser.errors.length > 0) 
    {
        throw parser.errors[0]
    }

    return new StatementSemanticVisitor().visit(cst)
}