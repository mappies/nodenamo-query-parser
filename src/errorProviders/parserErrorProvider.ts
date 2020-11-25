import { IParserErrorMessageProvider, IToken, TokenType, defaultParserErrorProvider } from 'chevrotain';
import { ErrorMessage } from '../entities/errorMessage';

export class ParserErrorProvider implements IParserErrorMessageProvider
{
    buildMismatchTokenMessage(options: { expected: TokenType; actual: IToken; previous: IToken; ruleName: string; }): string
    {
        return defaultParserErrorProvider.buildMismatchTokenMessage(options);
    }
    buildNotAllInputParsedMessage(options: { firstRedundant: IToken; ruleName: string; }): string
    {
        return ErrorMessage.UNEXPECTED_TOKEN.replace('?', options.firstRedundant.image)
    }
    buildNoViableAltMessage(options: { expectedPathsPerAlt: TokenType[][][]; actual: IToken[]; previous: IToken; customUserDescription: string; ruleName: string; }): string
    {
        return options.customUserDescription || ErrorMessage.UNRECOGNIZED_COMMAND.replace('?', options.actual[0].image)
    }
    buildEarlyExitMessage(options: { expectedIterationPaths: TokenType[][]; actual: IToken[]; previous: IToken; customUserDescription: string; ruleName: string; }): string
    {
        return options.customUserDescription || defaultParserErrorProvider.buildEarlyExitMessage(options);
    }

}