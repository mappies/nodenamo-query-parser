export enum RuleName
{
    Statement = "statementRuleName",

    /**
     * GET Statement
     */
    GetStatement = "getStatementRuleName",
    GetClause = "getClauseRuleName",
    GetFromClause = "getFromClauseRuleName",
    GetStronglyConsistentClause ="getStronglyConsistentClauseRuleName",

    /**
     * CREATE TABLE statement
     */
    CreateTableStatement = "createTableStatement",
    CreateTableClause = "createTableClauseRuleName",
    CreateTableForClause = "createTableForClauseRuleName",
    CreateTableWithCapacityOfClause = "withCapacityOfClauseRuleName",

    /**
     * SHOW TABLES statement
     */
    ShowTablesStatement = "showTablesStatement",
    ShowTablesClause = "showTablesClauseRuleName",

    /**
     * REMOVE TABLE statement
     */
    RemoveTableStatement = "removeTableStatement",
    RemoveTableClause = "removeTableClauseRuleName",

    /**
     * DELETE TABLE statement
     */
    DeleteTableStatement = "deleteTableStatement",
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