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
     * Misc
     */
    ObjectId = "objectIdRuleName"
}