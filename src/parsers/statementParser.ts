import { CstParser, TokenVocabulary, IParserConfig } from 'chevrotain';
import { Token } from '../entities/token';
import { ErrorMessage } from '../entities/errorMessage';
import { ParserErrorProvider } from '../errorProviders/parserErrorProvider';

export class StatementParser extends CstParser
{
    statement = this.RULE('statement', ()=>
                {
                    this.OR({
                        DEF: [
                            { ALT: () => this.SUBRULE(this.getStatement) }
                        ]
                    })
                });

    /**
     * GET Statement
     * 
     * Syntax: "GET" String|Number "FROM" Identifier "StronglyConsistent"? 
     */
    getStatement = this.RULE("getStatement", () =>
                {
                    this.SUBRULE(this.getClause)
                    this.SUBRULE(this.getFromClause)
                    this.OPTION(() => {
                        this.SUBRULE(this.getStronglyConsistentClause)
                    })
                })

    getClause = this.RULE("getClause", () =>
                {
                    this.CONSUME(Token.Get);
                    this.OR({
                        DEF: [
                            { ALT: () => this.CONSUME(Token.String)},
                            { ALT: () => this.CONSUME(Token.Integer) }
                        ],
                        ERR_MSG: ErrorMessage.GET_MISSING_ID
                    })
                })

    getFromClause = this.RULE("getFromClause", () =>
                {
                    this.CONSUME(Token.From, {ERR_MSG: ErrorMessage.GET_MISSING_FROM})
                    this.CONSUME(Token.Identifier, {ERR_MSG: ErrorMessage.GET_MISSING_TABLE})
                })

    getStronglyConsistentClause = this.RULE('getStronglyConsistentClause', () =>
                {
                    this.CONSUME(Token.StronglyConsistent)
                });

    constructor(tokenVocabulary: TokenVocabulary = Token.AllTokens, config?: IParserConfig)
    {
        super(tokenVocabulary, Object.assign({errorMessageProvider: new ParserErrorProvider()}, config))
        this.performSelfAnalysis()
    }
}
