export enum RuleName
{
    Statement = "statementRuleName",
    AtomicStatement = 'atomicStatementRuleName',

    /**
     * Explain Statement
     */
    ExplainStatement = 'explainStatementRuleName',

    /**
     * DESCRIBE Statement
     */
    DescribeStatement = "describeStatementRuleName",

    /**
     * INSERT Statement
     */
    InsertStatement = "insertStatementRuleName",
    InsertClause = "insertClauseRuleName",
    InsertIntoClause = "insertIntoClauseRuleName",

    /**
     * GET Statement
     */
    GetStatement = "getStatementRuleName",
    GetClause = "getClauseRuleName",
    GetFromClause = "getFromClauseRuleName",
    GetStronglyConsistentClause ="getStronglyConsistentClauseRuleName",
    
    /**
     * UPDATE Statement
     */
    UpdateStatement = "updateStatementRuleName",
    UpdateClause = "updateClauseRuleName",
    UpdateFromClause = "updateFromClauseRuleName",
    UpdateWithVersionCheckClause = "updateWithVersionCheckClauseRuleName",

    /**
     * ON Statement
     */
    OnStatement = "onStatementRuleName",
    OnClause = "onClauseRuleName",
    OnFromClause = "onFromClauseRuleName",
    OnExpressionClause = "onExpressionClauseRuleName",
    OnAddClause = "onAddClauseRuleName",
    OnDeleteClause = "onDeleteClauseRuleName",
    OnRemoveClause = "onRemoveClauseRuleName",
    OnSetClause = "onSetClauseRuleName",
    OnWithVersionCheckClause = "onWithVersionCheckClauseRuleName",

    /**
     * CREATE TABLE statement
     */
    CreateTableStatement = "createTableStatementRuleName",
    CreateTableClause = "createTableClauseRuleName",
    CreateTableForClause = "createTableForClauseRuleName",
    CreateTableWithCapacityOfClause = "withCapacityOfClauseRuleName",

    /**
     * SHOW TABLES statement
     */
    ShowTablesStatement = "showTablesStatementRuleName",
    ShowTablesClause = "showTablesClauseRuleName",

    /**
     * REMOVE TABLE statement
     */
    UnloadTableStatement = "removeTableStatementRuleName",
    UnloadTableClause = "removeTableClauseRuleName",

    /**
     * DELETE TABLE statement
     */
    DeleteTableStatement = "deleteTableStatementRuleName",
    DeleteTableClause = "deleteTableClauseRuleName",
    DeleteTableForClause = "deleteTableForClauseRuleName",

    /**
     * DELETE statement
     */
    DeleteStatement = "deleteStatementRuleName",
    DeleteClause = "deleteClauseRuleName",
    DeleteFromClause = "deleteFromClauseRuleName",
    DeleteWhereClause = "deleteWhereClauseRuleName",

    /**
     * Find statement
     */
    FindStatement = "findStatementRuleName",
    FindClause = "findClauseRuleName",
    FindFromClause = "findFromClauseRuleName",
    FindWhereClause = "findWhereClauseRuleName",
    FindUsingClause = "findUsingClauseRuleName",
    FindFilterClause = "findFilterClauseRuleName",
    FindOrderClause = "findOrderClauseRuleName",
    FindResumeClause = "findResumeClauseRuleName",
    FindLimitClause = "findLimitClauseRuleName",
    FindStronglyConsistentClause = "findStrongConsistentClauseRuleName",

    /**
     * List statement
     */
    ListStatement = "listStatementRuleName",
    ListClause = "listClauseRuleName",
    ListByClause = "listByClauseRuleName",

    /**
     * Import statement
     */
    ImportStatement = "importStatementRuleName",
    ImportClause = "importClauseRuleName",
    ImportFromClause = "importFromClauseRuleName",
    ImportTypeClause = "importTypeClauseRuleName",
    ImportNonDefaultTypeClause = "importNonDefaultTypeClauseRuleName",
    ImportDefaultTypeClause = "importDefaultTypeClauseRuleName",

    /**
     * Where clause
     */
    WhereClause = "whereClauseRuleName",

    /**
     * Expression
     */
    Expression = "expressionRuleName",
    HighPrecedenceExpression = "highPrecedenceExpressionRuleName",
    AtomicExpression = "atomicExpressionRuleName",
    AndOrExpression = "andOrExpressionRuleName",
    NotExpression = "notExpressionRuleName",
    InExpression = "inExpressionRuleName",
    BetweenInExpression = "betweenInExpressionRuleName",
    ComparisonExpression = "comparisonExpressionRuleName",
    ParenthesisExpression = "parenthesisExpressionRuleName",
    AttributeExistsExpression = "attributeExistsExpressionRuleName",
    AttributeNotExistsExpression = "attributeNotExistsExpressionRuleName",
    AttributeTypeExpression = "attributeTypeExpressionRuleName",
    BeginsWithExpression = "beginsWithExpressionRuleName",
    ContainsExpression = "containsExpressionRuleName",
    SizeExpression = "sizeExpressionRuleName",
    Operand = "OperandRuleName",

    /**
     * JSON
     */
    JsonObject = 'jsonObjectRuleName',
    JsonArray = 'jsonArrayRuleName',
    JsonObjectItem = 'jsonObjectItemRuleName',
    JsonValue = 'jsonValueRuleName',

    /**
     * Misc
     */
    ObjectId = "objectIdRuleName"
}