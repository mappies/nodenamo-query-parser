import { CstParser, TokenVocabulary, IParserConfig } from 'chevrotain';
import { Token } from '../entities/token';
import { ErrorMessage } from '../entities/errorMessage';
import { ParserErrorProvider } from '../errorProviders/parserErrorProvider';
import { RuleName } from '../entities/ruleName';

export class StatementParser extends CstParser
{
    statement = this.RULE(RuleName.Statement, ()=>
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
    getStatement = this.RULE(RuleName.GetStatement, () =>
                {
                    this.SUBRULE(this.getClause)
                    this.SUBRULE(this.getFromClause)
                    this.OPTION(() => {
                        this.SUBRULE(this.getStronglyConsistentClause)
                    })
                })

    getClause = this.RULE(RuleName.GetClause, () =>
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

    getFromClause = this.RULE(RuleName.GetFromClause, () =>
                {
                    this.CONSUME(Token.From, {ERR_MSG: ErrorMessage.GET_MISSING_FROM})
                    this.CONSUME(Token.Identifier, {ERR_MSG: ErrorMessage.GET_MISSING_TABLE})
                })

    getStronglyConsistentClause = this.RULE(RuleName.GetStronglyConsistentClause, () =>
                {
                    this.CONSUME(Token.StronglyConsistent)
                });

    constructor(tokenVocabulary: TokenVocabulary = Token.AllTokens, config?: IParserConfig)
    {
        super(tokenVocabulary, Object.assign({errorMessageProvider: new ParserErrorProvider()}, config))
        this.performSelfAnalysis()
    }
}
