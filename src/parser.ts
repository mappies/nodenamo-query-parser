import { Lexer } from 'chevrotain';
import { Token } from './entities/token';
import { StatementParser } from './parsers/statementParser';
import { StatementSemanticVisitor } from './parsers/statementSemanticVisitor';

let lexer = new Lexer(Token.AllTokens);
let parser = new StatementParser();

export function parse(text) 
{
    parser.input = lexer.tokenize(text + ' ').tokens;

    let cst = parser.statement();

    if (parser.errors.length > 0) 
    {
        throw parser.errors[0]
    }

    return new StatementSemanticVisitor().visit(cst)
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