import { StatementParser } from './statementParser';

const statementParser = new StatementParser()
const BaseSQLVisitor = statementParser.getBaseCstVisitorConstructor()

export class StatementSemanticVisitor extends BaseSQLVisitor 
{
    constructor()
    {
        super()
        this.validateVisitor()
    }

    /**
     * GET Statement
     * 
     * Syntax: "GET" String|Number "FROM" Identifier "StronglyConsistent"? 
     */
    statement(ctx)
    {
        if (ctx.getStatement)
        {
            return this.visit(ctx.getStatement)
        }
    }

    getStatement(ctx) 
    {
        return {
            type: "get",
            get: this.visit(ctx.getClause),
            from: this.visit(ctx.getFromClause),
            stronglyConsistent: this.visit(ctx.getStronglyConsistentClause)
        }
    }

    getClause(ctx) 
    {
        if (ctx.String)
        {
            //Remove ""
            return ctx.String[0].image.substr(1, ctx.String[0].image.length - 2)
        }
        else 
        {
            return Number(ctx.Integer[0].image)
        }
    }

    getFromClause(ctx) 
    {
        return ctx.Identifier[0].image
    }

    getStronglyConsistentClause(ctx) 
    {
        return true
    }
}