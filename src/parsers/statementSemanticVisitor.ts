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

    [RuleName.Statement](ctx)
    {
        if (ctx[RuleName.GetStatement])
        {
            return this.visit(ctx[RuleName.GetStatement])
        }
        else if(ctx[RuleName.DeleteStatement])
        {
            return this.visit(ctx[RuleName.DeleteStatement])
        }
        else if(ctx[RuleName.CreateTableStatement])
        {
            return this.visit(ctx[RuleName.CreateTableStatement])
        }
        else if(ctx[RuleName.DeleteTableStatement])
        {
            return this.visit(ctx[RuleName.DeleteTableStatement])
        }
    }


    /**
     * GET Statement
     * 
     * Syntax: GET string|number FROM identifier (Strongly Consistent)? 
     */
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

    /**
     * DELETE TABLE Statement
     * 
     * Syntax: DELETE TABLE FOR identifier
     */
    [RuleName.DeleteStatement](ctx)
    {
        return {
            type: "delete",
            id: this.visit(ctx[RuleName.DeleteClause]),
            from: this.visit(ctx[RuleName.DeleteFromClause])
        }
    }

    [RuleName.DeleteClause](ctx)
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

    [RuleName.DeleteFromClause](ctx)
    {
        return ctx.Identifier[0].image;
    }

    /**
     * CREATE TABLE Statement
     * 
     * Syntax: CREATE TABLE FOR identifier WITH CAPACITY OF number number
     */
    [RuleName.CreateTableStatement](ctx)
    {
        return {
            type: "create_table",
            for: this.visit(ctx[RuleName.CreateTableForClause]),
            withCapacityOf: this.visit(ctx[RuleName.CreateTableWithCapacityOfClause])
        }
    }

    [RuleName.CreateTableClause](ctx)
    {
        return
    }

    [RuleName.CreateTableForClause](ctx)
    {
        return ctx.Identifier[0].image;
    }

    [RuleName.CreateTableWithCapacityOfClause](ctx)
    {
        return {
            readCapacity: Number(ctx.Integer[0].image),
            writeCapacity: Number(ctx.Integer[1].image)
        }
    }

    /**
     * DELETE TABLE Statement
     * 
     * Syntax: DELETE TABLE FOR identifier
     */
    [RuleName.DeleteTableStatement](ctx)
    {
        return {
            type: "delete_table",
            for: this.visit(ctx[RuleName.DeleteTableForClause])
        }
    }

    [RuleName.DeleteTableClause](ctx)
    {
        return
    }

    [RuleName.DeleteTableForClause](ctx)
    {
        return ctx.Identifier[0].image;
    }
}