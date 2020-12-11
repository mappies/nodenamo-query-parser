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
                            { ALT: () => this.SUBRULE(this.atomicStatement) },
                            { ALT: () => this.SUBRULE(this.explainStatement) }
                        ]
                    })
                })

    explainStatement = this.RULE(RuleName.ExplainStatement, () =>
                {
                    this.CONSUME(Token.Explain)
                    this.SUBRULE(this.atomicStatement)
                })

    atomicStatement = this.RULE(RuleName.AtomicStatement, ()=>
                {
                    this.OR({
                        DEF: [
                            { ALT: () => this.SUBRULE(this.listStatement) },
                            { ALT: () => this.SUBRULE(this.findStatement) },
                            { ALT: () => this.SUBRULE(this.getStatement) },
                            { ALT: () => this.SUBRULE(this.insertStatement) },
                            { ALT: () => this.SUBRULE(this.updateStatement) },
                            { ALT: () => this.SUBRULE(this.onStatement) },
                            { ALT: () => this.SUBRULE(this.deleteStatement) },
                            { ALT: () => this.SUBRULE(this.createTableStatement) },
                            { ALT: () => this.SUBRULE(this.deleteTableStatement) },
                            { ALT: () => this.SUBRULE(this.importStatement) },
                            { ALT: () => this.SUBRULE(this.showTablesStatement) },
                            { ALT: () => this.SUBRULE(this.unloadTableStatement) }
                        ]
                    })
                });
    /**
     * INSERT Statement
     * 
     * Syntax: INSERT jsonObject INTO identifier (where expression)? 
     */
    insertStatement = this.RULE(RuleName.InsertStatement, () =>
                {
                    this.SUBRULE(this.insertClause)
                    this.SUBRULE(this.insertIntoClause)
                    this.OPTION(() => {
                        this.SUBRULE(this.whereClause)
                    })
                })

    insertClause = this.RULE(RuleName.InsertClause, () =>
                {
                    this.CONSUME(Token.Insert);
                    this.SUBRULE(this.jsonObject);
                })

    insertIntoClause = this.RULE(RuleName.InsertIntoClause, () =>
                {
                    this.CONSUME(Token.Into, {ERR_MSG: ErrorMessage.MISSING_ENTITY_NAME})
                    this.CONSUME(Token.Identifier, {ERR_MSG: ErrorMessage.MISSING_ENTITY_NAME})
                })

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
     * UPDATE Statement
     * 
     * Syntax: UPDATE jsonObject FROM identifier (where expression)?  (with version check)?
     */
    updateStatement = this.RULE(RuleName.UpdateStatement, () =>
                {
                    this.SUBRULE(this.updateClause)
                    this.SUBRULE(this.updateFromClause)
                    this.OPTION1(() => {
                        this.SUBRULE(this.whereClause)
                    })
                    this.OPTION2(() => {
                        this.SUBRULE(this.updateWithVersionCheckClause)
                    })
                })

    updateClause = this.RULE(RuleName.UpdateClause, () =>
                {
                    this.CONSUME(Token.Update);
                    this.SUBRULE(this.jsonObject);
                })

    updateFromClause = this.RULE(RuleName.UpdateFromClause, () =>
                {
                    this.CONSUME(Token.From, {ERR_MSG: ErrorMessage.MISSING_ENTITY_NAME})
                    this.CONSUME(Token.Identifier, {ERR_MSG: ErrorMessage.MISSING_ENTITY_NAME})
                })

    updateWithVersionCheckClause = this.RULE(RuleName.UpdateWithVersionCheckClause, () =>
                {
                    this.CONSUME(Token.WithVersionCheck)
                })

    /**
     * ON Statement
     * 
     * Syntax: ON string|number FROM identifier 
     *         (SET identifier=value(, SET identifier=value)*)*
     *         (ADD identifier value(, ADD identifier value)*)*
     *         (DELETE identifier(, DELETE identifier)*)*
     *         (REMOVE identifier(, REMOVE identifier)*)*
     *         (where expression)?
     *         (with version check)?
     */
    onStatement = this.RULE(RuleName.OnStatement, () =>
                {
                    this.SUBRULE(this.onClause)
                    this.SUBRULE(this.onFromClause)
                    this.SUBRULE1(this.onExpressionClause)
                    this.MANY(()=>{
                        this.SUBRULE2(this.onExpressionClause)
                    })
                    this.OPTION1(() => {
                        this.SUBRULE(this.whereClause)
                    })
                    this.OPTION2(() => {
                        this.SUBRULE(this.onWithVersionCheck)
                    })
                })

    onClause = this.RULE(RuleName.OnClause, () =>
                {
                    this.CONSUME(Token.On)
                    this.SUBRULE(this.objectId)
                })

    onFromClause = this.RULE(RuleName.OnFromClause, () =>
                {
                    this.CONSUME(Token.From, {ERR_MSG:ErrorMessage.ON_MISSING_FROM})
                    this.CONSUME(Token.Identifier, {ERR_MSG: ErrorMessage.MISSING_ENTITY_NAME})
                })

    onExpressionClause = this.RULE(RuleName.OnExpressionClause, () =>
                {
                    this.OR({
                        DEF: [
                            {ALT: () => this.SUBRULE(this.onSetClause) },
                            {ALT: () => this.SUBRULE(this.onAddClause) },
                            {ALT: () => this.SUBRULE(this.onRemoveClause) },
                            {ALT: () => this.SUBRULE(this.onDeleteClause) }
                        ],
                        ERR_MSG: ErrorMessage.OR_MISSING_EXPRESSION
                    })
                })

    onSetClause = this.RULE(RuleName.OnSetClause, () => 
                {
                    this.CONSUME(Token.Set)
                    this.CONSUME1(Token.Identifier, {LABEL: 'lhs', ERR_MSG: ErrorMessage.MISSING_PROPERTY_NAME})
                    this.CONSUME2(Token.Equal, {ERR_MSG: ErrorMessage.ON_SET_MISSING_EQUAL})
                    this.SUBRULE1(this.atomicExpression, {LABEL: 'rhs'})
                    this.MANY(()=>{
                        this.CONSUME4(Token.Comma)
                        this.CONSUME5(Token.Identifier, {LABEL: 'lhs', ERR_MSG: ErrorMessage.MISSING_PROPERTY_NAME})
                        this.CONSUME6(Token.Equal, {ERR_MSG: ErrorMessage.ON_SET_MISSING_EQUAL})
                        this.SUBRULE(this.atomicExpression, {LABEL: 'rhs'})
                    })
                })

    onAddClause = this.RULE(RuleName.OnAddClause, () => 
                {
                    this.CONSUME(Token.Add)
                    this.CONSUME1(Token.Identifier, {LABEL: 'lhs', ERR_MSG: ErrorMessage.MISSING_PROPERTY_NAME})
                    this.CONSUME2(Token.Number, {LABEL: 'rhs', ERR_MSG: ErrorMessage.ON_ADD_MISSING_NUMBER})
                    this.MANY(()=>{
                        this.CONSUME(Token.Comma)
                        this.CONSUME3(Token.Identifier, {LABEL: 'lhs', ERR_MSG: ErrorMessage.MISSING_PROPERTY_NAME})
                        this.CONSUME4(Token.Number, {LABEL: 'rhs', ERR_MSG: ErrorMessage.ON_ADD_MISSING_NUMBER})
                    })
                })

    onRemoveClause = this.RULE(RuleName.OnRemoveClause, () => 
                {
                    this.CONSUME(Token.Remove)
                    this.CONSUME1(Token.Identifier, {LABEL: 'lhs', ERR_MSG: ErrorMessage.MISSING_PROPERTY_NAME})
                    this.MANY(()=>{
                        this.CONSUME(Token.Comma)
                        this.CONSUME2(Token.Identifier, {LABEL: 'lhs', ERR_MSG: ErrorMessage.MISSING_PROPERTY_NAME})
                    })
                })

    onDeleteClause = this.RULE(RuleName.OnDeleteClause, () => 
                {
                    this.CONSUME(Token.Delete)
                    this.CONSUME1(Token.Identifier, {LABEL: 'lhs', ERR_MSG: ErrorMessage.MISSING_PROPERTY_NAME})
                    this.SUBRULE1(this.atomicExpression, {LABEL: 'rhs'})
                    this.MANY(()=>{
                        this.CONSUME(Token.Comma)
                        this.CONSUME3(Token.Identifier, {LABEL: 'lhs', ERR_MSG: ErrorMessage.MISSING_PROPERTY_NAME})
                        this.SUBRULE2(this.atomicExpression, {LABEL: 'rhs'})
                    })
                })

    onWithVersionCheck = this.RULE(RuleName.OnWithVersionCheckClause, () =>
                {
                    this.CONSUME(Token.WithVersionCheck)
                })
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
     * FIND Statement
     * 
     * Syntax: FIND *|([string][,string]*) 
     *         FROM identifier 
     *         (USING identifier)?
     *         (WHERE expression)? 
     *         (FILTER expression)? 
     *         (ORDER ASC|DESC)? 
     *         (LIMIT number)? 
     *         (Strongly Consistent)? 
     */
    findStatement = this.RULE(RuleName.FindStatement, () =>
                {
                    this.SUBRULE(this.findClause)
                    this.SUBRULE(this.findFromClause)
                    this.OPTION1(() => {
                        this.SUBRULE(this.findUsingClause)
                    })
                    this.OPTION2(() => {
                        this.SUBRULE(this.whereClause)
                    })
                    this.OPTION3(() => {
                        this.SUBRULE(this.findFilterClause)
                    })
                    this.OPTION4(() => {
                        this.SUBRULE(this.findResumeClause)
                    })
                    this.OPTION5(()=> {
                        this.SUBRULE(this.findOrderClause)
                    })
                    this.OPTION6(()=> {
                        this.SUBRULE(this.findLimitClause)
                    })
                    this.OPTION7(() => {
                        this.SUBRULE(this.findStronglyConsistentClause)
                    })
                })

    findClause = this.RULE(RuleName.FindClause, () =>
                {
                    this.CONSUME(Token.Find);
                    this.OR({
                        DEF: [
                            { ALT: ()=> this.CONSUME(Token.Star) },
                            { ALT: ()=> {
                                this.CONSUME1(Token.Identifier) 
                                this.MANY(()=>{
                                    this.CONSUME(Token.Comma)
                                    this.CONSUME2(Token.Identifier, {ERR_MSG: ErrorMessage.FIND_MISSING_PROJECTION})
                                })
                            }}
                        ],
                        ERR_MSG: ErrorMessage.FIND_MISSING_PROJECTIONS
                    })
                })

    findFromClause = this.RULE(RuleName.FindFromClause, () =>
                {
                    this.CONSUME(Token.From, {ERR_MSG: ErrorMessage.FIND_MISSING_FROM})
                    this.CONSUME(Token.Identifier, {ERR_MSG: ErrorMessage.FIND_MISSING_TABLE})
                })

    findUsingClause = this.RULE(RuleName.FindUsingClause, () =>
                {
                    this.CONSUME(Token.Using)
                    this.CONSUME(Token.Identifier, {ERR_MSG: ErrorMessage.FIND_MISSING_USING})
                })

    findFilterClause = this.RULE(RuleName.FindFilterClause, () =>
                {
                    this.CONSUME(Token.Filter)
                    this.SUBRULE(this.expression)
                })

    findResumeClause = this.RULE(RuleName.FindResumeClause, () =>
                {
                    this.CONSUME(Token.Resume)
                    this.CONSUME(Token.Identifier, {ERR_MSG:ErrorMessage.FIND_MISSING_RESUME})
                })

    findOrderClause = this.RULE(RuleName.FindOrderClause, () =>
                {
                    this.CONSUME(Token.Order)
                    this.OR({
                        DEF: [
                            {ALT: ()=>this.CONSUME(Token.Asc, {LABEL: 'Asc'})},
                            {ALT: ()=>this.CONSUME(Token.Desc, {LABEL: 'Desc'})}
                        ],
                        ERR_MSG: ErrorMessage.FIND_MISSING_ORDER
                    });
                })

    findLimitClause = this.RULE(RuleName.FindLimitClause, () =>
                {
                    this.CONSUME(Token.Limit)
                    this.CONSUME(Token.Number, {ERR_MSG: ErrorMessage.FIND_MISSING_LIMIT})
                })

    findStronglyConsistentClause = this.RULE(RuleName.FindStronglyConsistentClause, () =>
                {
                    this.CONSUME(Token.StronglyConsistent)
                });

    /**
     * LIST Statement
     * 
     * Syntax: LIST *|([string][,string]*) 
     *         FROM identifier 
     *         (USING identifier)?
     *         (BY hash,range)? 
     *         (FILTER expression)? 
     *         (ORDER ASC|DESC)? 
     *         (LIMIT number)? 
     *         (Strongly Consistent)? 
     */
    listStatement = this.RULE(RuleName.ListStatement, () =>
                {
                    this.SUBRULE(this.listClause)
                    this.SUBRULE(this.findFromClause)
                    this.OPTION1(() => {
                        this.SUBRULE(this.findUsingClause)
                    })
                    this.OPTION2(()=> {
                        this.SUBRULE(this.listByClause)
                    })
                    this.OPTION3(() => {
                        this.SUBRULE(this.findFilterClause)
                    })
                    this.OPTION4(() => {
                        this.SUBRULE(this.findResumeClause)
                    })
                    this.OPTION5(()=> {
                        this.SUBRULE(this.findOrderClause)
                    })
                    this.OPTION6(()=> {
                        this.SUBRULE(this.findLimitClause)
                    })
                    this.OPTION7(() => {
                        this.SUBRULE(this.findStronglyConsistentClause)
                    })
                })

    listClause = this.RULE(RuleName.ListClause, () =>
                {
                    this.CONSUME(Token.List);
                    this.OR({
                        DEF: [
                            { ALT: ()=> this.CONSUME(Token.Star) },
                            { ALT: ()=> {
                                this.CONSUME1(Token.Identifier) 
                                this.MANY(()=>{
                                    this.CONSUME(Token.Comma)
                                    this.CONSUME2(Token.Identifier, {ERR_MSG: ErrorMessage.FIND_MISSING_PROJECTION})
                                })
                            }}
                        ],
                        ERR_MSG: ErrorMessage.FIND_MISSING_PROJECTIONS
                    })
                })

    listByClause = this.RULE(RuleName.ListByClause, () =>
                {
                    this.CONSUME(Token.By)
                    this.CONSUME(Token.String, {ERR_MSG: ErrorMessage.LIST_MISSING_BY_HASH})
                    this.OPTION(()=>{
                        this.CONSUME1(Token.Comma)
                        this.CONSUME2(Token.String, {ERR_MSG: ErrorMessage.LIST_MISSING_BY_RANGE})
                    })
                })
    /**
     * WHERE clause
     */
    whereClause = this.RULE(RuleName.WhereClause, () =>
                            {
                                this.CONSUME(Token.Where)
                                this.SUBRULE(this.expression)
                            })

    expression = this.RULE(RuleName.Expression, () =>
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
                                        { ALT: () => this.SUBRULE(this.betweenInExpression) },
                                        { ALT: () => this.SUBRULE(this.attributeExistsExpression) },
                                        { ALT: () => this.SUBRULE(this.attributeNotExistsExpression) },
                                        { ALT: () => this.SUBRULE(this.attributeTypeExpression)},
                                        { ALT: () => this.SUBRULE(this.beginsWithExpression)},
                                        { ALT: () => this.SUBRULE(this.containsExpression)},
                                        { ALT: () => this.SUBRULE(this.sizeExpression) }
                                    ]
                                })
                            })

    sizeExpression = this.RULE(RuleName.SizeExpression, () => 
                            {
                                this.CONSUME(Token.Size)
                                this.CONSUME(Token.Identifier, {ERR_MSG: ErrorMessage.MISSING_PROPERTY_NAME})
                                this.CONSUME(Token.RightParenthesis, {ERR_MSG: ErrorMessage.EXPRESSION_MISSING_PARENTHESIS})
                                this.SUBRULE(this.operand)
                                this.SUBRULE(this.atomicExpression)
                            })

    operand = this.RULE(RuleName.Operand, () => 
                            {
                                this.OR([
                                    { ALT:() => { this.CONSUME(Token.Equal) }},
                                    { ALT:() => { this.CONSUME(Token.GreaterThanEqual) }},
                                    { ALT:() => { this.CONSUME(Token.NotEqual) }},
                                    { ALT:() => { this.CONSUME(Token.GreaterThan) }},
                                    { ALT:() => { this.CONSUME(Token.LessThanEqual) }},
                                    { ALT:() => { this.CONSUME(Token.LessThan) }},
                                ]);
                            })

    attributeExistsExpression = this.RULE(RuleName.AttributeExistsExpression, () => 
                            {
                                this.CONSUME(Token.AttributeExists)
                                this.CONSUME(Token.Identifier, {ERR_MSG: ErrorMessage.MISSING_PROPERTY_NAME})
                                this.CONSUME(Token.RightParenthesis, {ERR_MSG: ErrorMessage.EXPRESSION_MISSING_PARENTHESIS})
                            })

    attributeNotExistsExpression = this.RULE(RuleName.AttributeNotExistsExpression, () => 
                            {
                                this.CONSUME(Token.AttributeNotExists)
                                this.CONSUME(Token.Identifier, {ERR_MSG: ErrorMessage.MISSING_PROPERTY_NAME})
                                this.CONSUME(Token.RightParenthesis, {ERR_MSG: ErrorMessage.EXPRESSION_MISSING_PARENTHESIS})
                            })

    attributeTypeExpression = this.RULE(RuleName.AttributeTypeExpression, () => 
                            {
                                this.CONSUME(Token.AttributeType)
                                this.CONSUME(Token.Identifier, {ERR_MSG: ErrorMessage.MISSING_PROPERTY_NAME})
                                this.CONSUME(Token.Comma, {ERR_MSG: ErrorMessage.EXPRESSION_MISSING_PROPERTY_TYPE})
                                this.CONSUME(Token.String, {ERR_MSG: ErrorMessage.EXPRESSION_MISSING_PROPERTY_TYPE})
                                this.CONSUME(Token.RightParenthesis, {ERR_MSG: ErrorMessage.EXPRESSION_MISSING_PARENTHESIS})
                            })

    beginsWithExpression = this.RULE(RuleName.BeginsWithExpression, () => 
                            {
                                this.CONSUME(Token.BeginsWith)
                                this.CONSUME(Token.Identifier, {ERR_MSG: ErrorMessage.MISSING_PROPERTY_NAME})
                                this.CONSUME(Token.Comma, {ERR_MSG: ErrorMessage.EXPRESSION_MISSING_SEARCH_STRING})
                                this.CONSUME(Token.String, {ERR_MSG: ErrorMessage.EXPRESSION_MISSING_SEARCH_STRING})
                                this.CONSUME(Token.RightParenthesis, {ERR_MSG: ErrorMessage.EXPRESSION_MISSING_PARENTHESIS})
                            })

    containsExpression = this.RULE(RuleName.ContainsExpression, () => 
                            {
                                this.CONSUME(Token.Contains)
                                this.CONSUME(Token.Identifier, {ERR_MSG: ErrorMessage.MISSING_PROPERTY_NAME})
                                this.CONSUME(Token.Comma, {ERR_MSG: ErrorMessage.EXPRESSION_MISSING_SEARCH_STRING})
                                this.CONSUME(Token.String, {ERR_MSG: ErrorMessage.EXPRESSION_MISSING_SEARCH_STRING})
                                this.CONSUME(Token.RightParenthesis, {ERR_MSG: ErrorMessage.EXPRESSION_MISSING_PARENTHESIS})
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
                                this.SUBRULE(this.operand)
                                this.SUBRULE(this.atomicExpression);
                            })

    atomicExpression = this.RULE(RuleName.AtomicExpression, () => 
                            {
                                this.OR({
                                    DEF: [
                                        { ALT:() => { this.CONSUME(Token.Number) }},
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
     * IMPORT Statement
     * 
     * Syntax: IMPORT identifier (AS identifier)?|{identifier (AS identifier)?} FROM string
     */
    importStatement = this.RULE(RuleName.ImportStatement, () =>
                            {
                                this.SUBRULE(this.importClause)
                                this.SUBRULE(this.importFromClause)
                            })

    importClause = this.RULE(RuleName.ImportClause, () =>
                            {
                                this.CONSUME(Token.Import)
                                this.OR({
                                    DEF: [
                                        { ALT: () => this.SUBRULE(this.importNonDefaultTypeClause, { LABEL: 'entity'}) },
                                        { ALT: () => this.SUBRULE(this.importDefaultTypeClause, {LABEL: 'defaultEntity'}) }
                                    ],
                                    ERR_MSG: ErrorMessage.MISSING_ENTITY_NAME
                                })
                            })

    importDefaultTypeClause = this.RULE(RuleName.ImportDefaultTypeClause, () =>
                            {
                                this.CONSUME1(Token.Identifier, {ERR_MSG: ErrorMessage.MISSING_ENTITY_NAME})
                                this.OPTION1(()=>{
                                    this.CONSUME(Token.As)
                                    this.CONSUME2(Token.Identifier, {LABEL: "alias", ERR_MSG: ErrorMessage.IMPORT_MISSING_ALIAS})
                                })
                                this.OPTION2(()=>{
                                    this.CONSUME2(Token.Comma)
                                    this.OR({
                                        DEF: [
                                            {ALT: () => this.SUBRULE(this.importNonDefaultTypeClause)},
                                            {ALT: () => this.SUBRULE(this.importDefaultTypeClause)}
                                        ],
                                        ERR_MSG: ErrorMessage.MISSING_ENTITY_NAME
                                    })
                                })
                            })

    importNonDefaultTypeClause = this.RULE(RuleName.ImportNonDefaultTypeClause, () =>
                            {
                                this.CONSUME(Token.LeftCurlyParenthesis, {ERR_MSG: ErrorMessage.MISSING_ENTITY_NAME})
                                this.SUBRULE1(this.importTypeClause)
                                this.MANY(()=>{
                                    this.CONSUME(Token.Comma)
                                    this.SUBRULE2(this.importTypeClause)
                                })
                                this.CONSUME(Token.RightCurlyParenthesis, {ERR_MSG: ErrorMessage.IMPORT_MISSING_CLOSING_CURLY_PARENTHESIS}),
                                this.OPTION(()=>{
                                    this.CONSUME2(Token.Comma)
                                    this.OR({
                                        DEF: [
                                            {ALT: () => this.SUBRULE(this.importNonDefaultTypeClause)},
                                            {ALT: () => this.SUBRULE(this.importDefaultTypeClause)}
                                        ],
                                        ERR_MSG: ErrorMessage.MISSING_ENTITY_NAME
                                    })
                                })
                            })

    importTypeClause = this.RULE(RuleName.ImportTypeClause, () =>
                            {
                                this.CONSUME1(Token.Identifier, {ERR_MSG: ErrorMessage.MISSING_ENTITY_NAME})
                                    this.OPTION1(()=>{
                                        this.CONSUME1(Token.As)
                                        this.CONSUME2(Token.Identifier, {LABEL: "alias", ERR_MSG: ErrorMessage.IMPORT_MISSING_ALIAS})
                                    })
                            })

    importFromClause = this.RULE(RuleName.ImportFromClause, () =>
                            {
                                this.CONSUME(Token.From, {ERR_MSG: ErrorMessage.IMPORT_MISSING_FROM})
                                this.CONSUME(Token.String, {ERR_MSG: ErrorMessage.IMPORT_MISSING_PACKAGE_NAME})
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
                                this.CONSUME1(Token.Number, { ERR_MSG: ErrorMessage.CREATE_TABLE_MISSING_READ_CAPACITY })
                                this.CONSUME(Token.Comma, { ERR_MSG: ErrorMessage.CREATE_TABLE_MISSING_WRITE_CAPACITY })
                                this.CONSUME2(Token.Number, { ERR_MSG: ErrorMessage.CREATE_TABLE_MISSING_WRITE_CAPACITY })
                            })
    /**
     * SHOW TABLES Statement
     * 
     * Syntax: SHOW TABLES
     */
    showTablesStatement = this.RULE(RuleName.ShowTablesStatement, () =>
                            {
                                this.SUBRULE(this.showTablesClause)
                            })

    showTablesClause = this.RULE(RuleName.ShowTablesClause, ()=>
                            {
                                this.CONSUME(Token.ShowTables)
                            })
    /**
     * UNLOAD TABLE Statement
     * 
     * Syntax: UNLOAD TABLE identifier
     */
    unloadTableStatement = this.RULE(RuleName.UnloadTableStatement, () =>
                            {
                                this.SUBRULE(this.unloadTableClause)
                            })

    unloadTableClause = this.RULE(RuleName.UnloadTableClause, ()=>
                            {
                                this.CONSUME(Token.UnloadTable)
                                this.CONSUME(Token.Identifier, {ERR_MSG: ErrorMessage.MISSING_ENTITY_NAME})
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
     * JSON
     */
    jsonObject = this.RULE(RuleName.JsonObject, () =>
                            {
                                this.CONSUME(Token.LeftCurlyParenthesis, {ERR_MSG: ErrorMessage.JSON_INVALID_OBJECT})
                                this.OPTION(() => {
                                  this.SUBRULE(this.jsonObjectItem)
                                  this.MANY(() => {
                                    this.CONSUME(Token.Comma)
                                    this.SUBRULE2(this.jsonObjectItem)
                                  })
                                })
                                this.CONSUME(Token.RightCurlyParenthesis, {ERR_MSG: ErrorMessage.JSON_MISSING_CLOSING_CURLY_PARENTHESIS})
                            })

    jsonObjectItem = this.RULE(RuleName.JsonObjectItem, () =>
                            {
                                this.OR({
                                    DEF: [
                                        {ALT: () => this.CONSUME(Token.String)},
                                        {ALT: () => this.CONSUME(Token.Identifier)}
                                    ],
                                    ERR_MSG: ErrorMessage.JSON_MISSING_PROPERTY_KEY
                                })
                                this.CONSUME(Token.Colon, {ERR_MSG: ErrorMessage.JSON_MISSING_PROPERTY_VALUE})
                                this.SUBRULE(this.jsonValue)
                            })

    jsonArray = this.RULE(RuleName.JsonArray, () =>
                            {
                                this.CONSUME(Token.LeftSquareBracket)
                                this.OPTION(() => {
                                    this.SUBRULE(this.jsonValue)
                                    this.MANY(() => {
                                    this.CONSUME(Token.Comma)
                                    this.SUBRULE2(this.jsonValue)
                                })})
                                this.CONSUME(Token.RightSquareBracket, {ERR_MSG: ErrorMessage.JSON_MISSING_CLOSING_BRACKET})
                            })

    jsonValue = this.RULE(RuleName.JsonValue, () =>
                            {
                                this.OR({
                                    DEF: [
                                        { ALT: () => this.CONSUME(Token.String) },
                                        { ALT: () => this.CONSUME(Token.Number) },
                                        { ALT: () => this.SUBRULE(this.jsonObject) },
                                        { ALT: () => this.SUBRULE(this.jsonArray) },
                                        { ALT: () => this.CONSUME(Token.Boolean) },
                                        { ALT: () => this.CONSUME(Token.Null) }
                                    ],
                                    ERR_MSG: ErrorMessage.JSON_INVALID_VALUE
                                }) 
                            })
    /**
     * ObjectId
     */
    objectId = this.RULE(RuleName.ObjectId, () => 
                            {
                                this.OR({
                                    DEF: [
                                        { ALT: () => this.CONSUME(Token.String)},
                                        { ALT: () => this.CONSUME(Token.Number) }
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
