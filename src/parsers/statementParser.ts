import { CstParser, TokenVocabulary, IParserConfig } from 'chevrotain';
import { Token } from '../entities/token';

export class StatementParser extends CstParser
{
    statement = this.RULE('statement', ()=>
                {
                    this.OR([
                        { ALT: () => this.SUBRULE(this.getStatement) }
                    ])
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
                    this.OR([
                        { ALT: () => this.CONSUME(Token.String)},
                        { ALT: () => this.CONSUME(Token.Integer) }
                    ])
                })

    getFromClause = this.RULE("getFromClause", () =>
                {
                    this.CONSUME(Token.From)
                    this.CONSUME(Token.Identifier)
                })

    getStronglyConsistentClause = this.RULE('getStronglyConsistentClause', () =>
                {
                    this.CONSUME(Token.StronglyConsistent)
                });

    constructor(tokenVocabulary: TokenVocabulary = Token.AllTokens, config?: IParserConfig)
    {
        super(tokenVocabulary, config)
        this.performSelfAnalysis()
    }
}
