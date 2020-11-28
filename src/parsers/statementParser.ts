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
                    this.SUBRULE(this.objectId);
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
                                this.SUBRULE(this.objectId)
                            })

    deleteFromClause = this.RULE(RuleName.DeleteFromClause, () =>
                            {
                                this.CONSUME(Token.From, { ERR_MSG: ErrorMessage.DELETE_MISSING_FROM })
                                this.CONSUME(Token.Identifier, { ERR_MSG: ErrorMessage.MISSING_ENTITY_NAME })
                            })

    /**
     * WHERE clause
     */
    whereClause = this.RULE(RuleName.WhereClause, () =>
                            {
                                this.CONSUME(Token.Where)
                                this.SUBRULE(this.keyConditionExpression)
                            })

    keyConditionExpression = this.RULE(RuleName.Expression, () =>
                            {
                                this.SUBRULE(this.andOrExpression)
                            });

    /**
     * Expressions
     */
    andOrExpression = this.RULE(RuleName.AndOrExpression, () =>
                            {
                                this.SUBRULE1(this.highPrecedenceExpression, { LABEL: "lhs" });
                                this.MANY(() => {
                                    this.OR({
                                        DEF: [
                                            {ALT: () => { this.CONSUME(Token.And); }},
                                            {ALT: () => { this.CONSUME(Token.Or); }}
                                        ]
                                    })        
                                    this.SUBRULE2(this.highPrecedenceExpression,{LABEL: "rhs" });
                                });
                            })  

    highPrecedenceExpression = this.RULE(RuleName.HighPrecedenceExpression, () => 
                            {
                                this.OR({
                                    DEF: [
                                        { ALT: () => this.SUBRULE(this.notExpression) },
                                        { ALT: () => this.SUBRULE(this.inExpression) },
                                        { ALT: () => this.SUBRULE(this.parenthesisExpression) },
                                        { ALT: () => this.SUBRULE(this.comparisonExpression) },
                                        { ALT: () => this.SUBRULE(this.betweenInExpression) }
                                    ]
                                })
                            })

    inExpression = this.RULE(RuleName.InExpression, () =>
                            {
                                this.CONSUME(Token.Identifier)
                                this.CONSUME(Token.In)
                                this.CONSUME(Token.LeftParenthesis)
                                this.SUBRULE1(this.atomicExpression)
                                this.MANY(()=>{
                                    this.CONSUME(Token.Comma)
                                    this.SUBRULE2(this.atomicExpression)
                                })
                                this.CONSUME(Token.RightParenthesis)
                            })

    betweenInExpression = this.RULE(RuleName.BetweenInExpression, () =>
                            {
                                this.CONSUME1(Token.Identifier)
                                this.CONSUME(Token.Between)
                                this.SUBRULE1(this.atomicExpression, {LABEL: 'between'})
                                this.CONSUME(Token.And)
                                this.SUBRULE2(this.atomicExpression, {LABEL: 'and'})
                            })

    notExpression = this.RULE(RuleName.NotExpression, () =>
                            {
                                this.CONSUME(Token.Not)
                                this.SUBRULE(this.andOrExpression)
                            })

    comparisonExpression = this.RULE(RuleName.ComparisonExpression, () => 
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
                                this.SUBRULE(this.atomicExpression);
                            })

    atomicExpression = this.RULE(RuleName.AtomicExpression, () => 
                            {
                                this.OR({
                                    DEF: [
                                        { ALT:() => { this.CONSUME(Token.Integer) }},
                                        { ALT:() => { this.CONSUME(Token.String) }},
                                        { ALT:() => { this.CONSUME(Token.Boolean) }}
                                    ]
                                });
                            });

    parenthesisExpression = this.RULE(RuleName.ParenthesisExpression, () => 
                            {
                                this.CONSUME(Token.LeftParenthesis)
                                this.SUBRULE(this.andOrExpression)
                                this.CONSUME(Token.RightParenthesis, { ERR_MSG: ErrorMessage.EXPRESSION_MISSING_PARENTHESIS })
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
                                this.CONSUME(Token.Identifier, { ERR_MSG: ErrorMessage.MISSING_ENTITY_NAME })
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

    /**
     * ObjectId
     */
    objectId = this.RULE(RuleName.ObjectId, () => 
                            {
                                this.OR({
                                    DEF: [
                                        { ALT: () => this.CONSUME(Token.String)},
                                        { ALT: () => this.CONSUME(Token.Integer) }
                                    ],
                                    ERR_MSG: ErrorMessage.MISSING_OBJECT_ID
                                })
                            })

    constructor(tokenVocabulary: TokenVocabulary = Token.AllTokens, config?: IParserConfig)
    {
        super(tokenVocabulary, Object.assign({errorMessageProvider: new ParserErrorProvider()}, config))
        this.performSelfAnalysis()
    }
}
