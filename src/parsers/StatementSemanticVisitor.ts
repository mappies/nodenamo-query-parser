import { RuleName } from '../entities/ruleName';
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
    [RuleName.Statement](ctx)
    {
        if (ctx[RuleName.GetStatement])
        {
            return this.visit(ctx[RuleName.GetStatement])
        }
    }

    [RuleName.GetStatement](ctx) 
    {
        return {
            type: "get",
            get: this.visit(ctx[RuleName.GetClause]),
            from: this.visit(ctx[RuleName.GetFromClause]),
            stronglyConsistent: this.visit(ctx[RuleName.GetStronglyConsistentClause])
        }
    }

    [RuleName.GetClause](ctx) 
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

    [RuleName.GetFromClause](ctx) 
    {
        return ctx.Identifier[0].image
    }

    [RuleName.GetStronglyConsistentClause](ctx) 
    {
        return true
    }
}