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
                            { ALT: () => this.SUBRULE(this.getStatement) },
                            { ALT: () => this.SUBRULE(this.createTableStatement) }
                        ]
                    })
                });

    /**
     * GET Statement
     * 
     * Syntax: GET string|number FROM identifier (Strongly Consistent)? 
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

    /**
     * CREATE TABLE Statement
     * 
     * Syntax: CREATE TABLE FOR identifier WITH CAPACITY OF number number
     */
    createTableStatement = this.RULE(RuleName.CreateTableStatement, () =>
                            {
                                this.SUBRULE(this.createTableClause)
                                this.SUBRULE(this.createTableForClause)
                                this.OPTION(() => {
                                    this.SUBRULE(this.createTableWithCapacityOf)
                                })
                            })

    createTableClause = this.RULE(RuleName.CreateTableClause, () =>
                            {
                                this.CONSUME(Token.CreateTable)
                            })

    createTableForClause = this.RULE(RuleName.CreateTableForClause, () =>
                            {
                                this.CONSUME(Token.For, { ERR_MSG: ErrorMessage.CREATE_TABLE_MISSING_FOR })
                                this.CONSUME(Token.Identifier, { ERR_MSG: ErrorMessage.CREATE_TABLE_MISSING_ENTITY_NAME })
                            })
    
    createTableWithCapacityOf = this.RULE(RuleName.CreateTableWithCapacityOfClause, () =>
                            {
                                this.CONSUME(Token.WithCapacityOf)
                                this.CONSUME1(Token.Integer, { ERR_MSG: ErrorMessage.CREATE_TABLE_MISSING_READ_CAPACITY })
                                this.CONSUME2(Token.Integer, { ERR_MSG: ErrorMessage.CREATE_TABLE_MISSING_WRITE_CAPACITY })
                            })

    constructor(tokenVocabulary: TokenVocabulary = Token.AllTokens, config?: IParserConfig)
    {
        super(tokenVocabulary, Object.assign({errorMessageProvider: new ParserErrorProvider()}, config))
        this.performSelfAnalysis()
    }
}
