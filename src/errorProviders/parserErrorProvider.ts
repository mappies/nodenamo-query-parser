import { IParserErrorMessageProvider, IToken, TokenType, defaultParserErrorProvider } from 'chevrotain';
import { ErrorMessage } from '../entities/errorMessage';

export class ParserErrorProvider implements IParserErrorMessageProvider
{
    buildMismatchTokenMessage(options: { expected: TokenType; actual: IToken; previous: IToken; customUserDescription?: string, ruleName: string; }): string
    {
        return options.customUserDescription || defaultParserErrorProvider.buildMismatchTokenMessage(options);
    }
    buildNotAllInputParsedMessage(options: { firstRedundant: IToken; ruleName: string; }): string
    {
        return ErrorMessage.UNEXPECTED_TOKEN.replace('?', options.firstRedundant.image)
    }
    buildNoViableAltMessage(options: { expectedPathsPerAlt: TokenType[][][]; actual: IToken[]; previous: IToken; customUserDescription: string; ruleName: string; }): string
    {
        return options.customUserDescription || 
               (options.actual[0].image && ErrorMessage.UNRECOGNIZED_COMMAND.replace('?', options.actual[0].image)) ||
               (options.previous.image && ErrorMessage.UNEXPECTED_END_OF_STATEMENT)  ||
               defaultParserErrorProvider.buildNoViableAltMessage(options);
    }
    buildEarlyExitMessage(options: { expectedIterationPaths: TokenType[][]; actual: IToken[]; previous: IToken; customUserDescription: string; ruleName: string; }): string
    {
        return options.customUserDescription || defaultParserErrorProvider.buildEarlyExitMessage(options);
    }

}