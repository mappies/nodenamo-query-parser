import { CstParser, TokenVocabulary, IParserConfig, Rule } from 'chevrotain';
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
                            { ALT: () => this.SUBRULE(this.deleteStatement) },
                            { ALT: () => this.SUBRULE(this.createTableStatement) },
                            { ALT: () => this.SUBRULE(this.deleteTableStatement) }
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
     * DELETE Statement
     * 
     * Syntax: DELETE string|number FROM identifier (WHERE condition)?
     */
    deleteStatement = this.RULE(RuleName.DeleteStatement, () =>
                            {
                                this.SUBRULE(this.deleteClause)
                                this.SUBRULE(this.deleteFromClause)
                                this.OPTION(() => {
                                    this.SUBRULE(this.whereClause)
                                })
                            })

    deleteClause = this.RULE(RuleName.DeleteClause, () =>
                            {
                                this.CONSUME(Token.Delete)
                                this.OR({
                                    DEF: [
                                        { ALT: () => this.CONSUME(Token.String)},
                                        { ALT: () => this.CONSUME(Token.Integer) }
                                    ],
                                    ERR_MSG: ErrorMessage.DELETE_MISSING_ID
                                })
                            })

    deleteFromClause = this.RULE(RuleName.DeleteFromClause, () =>
                            {
                                this.CONSUME(Token.From, { ERR_MSG: ErrorMessage.DELETE_MISSING_FROM })
                                this.CONSUME(Token.Identifier, { ERR_MSG: ErrorMessage.DELETE_MISSING_ENTITY_NAME })
                            })

    /**
     * WHERE clause
     */
    whereClause = this.RULE(RuleName.WhereClause, () =>
                            {
                                this.CONSUME(Token.Where)
                                this.SUBRULE(this.whereExpression)
                            })
    
    WhereAndOrExpression = this.RULE(RuleName.WhereAndOrExpression, () =>
    {

    })  
           
    whereExpression = this.RULE(RuleName.WhereExpression, () => 
                            {
                                this.OR({
                                    DEF: [
                                       // { ALT: () => this.SUBRULE(this.whereAndOrExpression) },
                                        { ALT: () => this.SUBRULE(this.whereComparisonExpression) }
                                    ]
                                })
                            })
/*
    whereAndOrExpression = this.RULE(RuleName.WhereAndOrExpression, () => 
                            {                 
                                this.SUBRULE1(this.whereAndOrExpression, { LABEL: 'lhs' })
                                this.MANY(() => {
                                    this.OR([
                                        { ALT: () => { this.CONSUME(Token.And)} },
                                        { ALT: () => { this.CONSUME(Token.Or)} }
                                    ])
                                    this.SUBRULE2(this.whereAndOrExpression, { LABEL: 'rhs' })
                                })
                            })
*/
    whereComparisonExpression = this.RULE(RuleName.WhereComparisonExpression, () => 
                            {
                                this.CONSUME(Token.Identifier);
                                this.OR([
                                    { ALT:() => { this.CONSUME(Token.Equal) }},
                                    { ALT:() => { this.CONSUME(Token.GreaterThanEqual) }},
                                    { ALT:() => { this.CONSUME(Token.NotEqual) }},
                                    { ALT:() => { this.CONSUME(Token.GreaterThan) }},
                                    { ALT:() => { this.CONSUME(Token.LessThanEqual) }},
                                    { ALT:() => { this.CONSUME(Token.LessThan) }},
                                ]);
                                this.SUBRULE(this.whereAtomicExpression);
                            })

    whereAtomicExpression = this.RULE(RuleName.WhereAtomicExpression, () => 
                            {
                                this.OR({
                                    DEF: [
                                        { ALT:() => { this.CONSUME(Token.Integer) }},
                                        { ALT:() => { this.CONSUME(Token.String) }}
                                    ]
                                });
                            });

    whereParenthesisExpression = this.RULE(RuleName.WhereParenthesisExpression, () => 
                            {
                                this.CONSUME(Token.LeftParenthesis)
                                this.SUBRULE(this.whereExpression)
                                this.CONSUME(Token.RightParenthesis)
                            })

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

    /**
     * DELETE TABLE Statement
     * 
     * Syntax: DELETE TABLE FOR identifier
     */
    deleteTableStatement = this.RULE(RuleName.DeleteTableStatement, () =>
                            {
                                this.SUBRULE(this.deleteTableClause)
                                this.SUBRULE(this.deleteTableForClause)
                            })

    deleteTableClause = this.RULE(RuleName.DeleteTableClause, () =>
                            {
                                this.CONSUME(Token.DeleteTable)
                            })

    deleteTableForClause = this.RULE(RuleName.DeleteTableForClause, () =>
                            {
                                this.CONSUME(Token.For, { ERR_MSG: ErrorMessage.DELETE_TABLE_MISSING_FOR })
                                this.CONSUME(Token.Identifier, { ERR_MSG: ErrorMessage.DELETE_TABLE_MISSING_ENTITY_NAME })
                            })

    constructor(tokenVocabulary: TokenVocabulary = Token.AllTokens, config?: IParserConfig)
    {
        super(tokenVocabulary, Object.assign({errorMessageProvider: new ParserErrorProvider()}, config))
        this.performSelfAnalysis()
    }
}
