import { Lexer } from 'chevrotain';
import { Token } from './entities/token';
import { StatementParser } from './parsers/statementParser';
import { StatementSemanticVisitor } from './parsers/statementSemanticVisitor';

export function parse(text) 
{
    let lexResult = new Lexer(Token.AllTokens).tokenize(text);

    let statementParser = new StatementParser();
    statementParser.input = lexResult.tokens;

    let cst = statementParser.statement();

    if (statementParser.errors.length > 0) 
    {
        throw statementParser.errors[0]
    }

    return new StatementSemanticVisitor().visit(cst)
}