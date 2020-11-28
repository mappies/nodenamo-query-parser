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
     * Where clause
     */
    WhereClause = "whereClauseRuleName",

    /**
     * Expression
     */
    Expression = "expression",
    HighPrecedenceExpression = "highPrecedenceExpression",
    AtomicExpression = "atomicExpression",
    AndOrExpression = "andOrExpression",
    ComparisonExpression = "comparisonExpression",
    ParenthesisExpression = "parenthesisExpression",

    /**
     * Misc
     */
    ObjectId = "objectIdRuleName"
}