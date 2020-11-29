import { RuleName } from '../entities/ruleName';
import { Token } from '../entities/token';
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
            id: this.visit(ctx[RuleName.GetClause]),
            from: this.visit(ctx[RuleName.GetFromClause]),
            stronglyConsistent: this.visit(ctx[RuleName.GetStronglyConsistentClause])
        }
    }

    [RuleName.GetClause](ctx) 
    {
        return this.visit(ctx[RuleName.ObjectId])
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
            from: this.visit(ctx[RuleName.DeleteFromClause]),
            where: this.visit(ctx[RuleName.WhereClause])
        }
    }

    [RuleName.DeleteClause](ctx)
    {
        return this.visit(ctx[RuleName.ObjectId])
    }

    [RuleName.DeleteFromClause](ctx)
    {
        return ctx.Identifier[0].image;
    }

    /**
     * WHERE clause
     */
    [RuleName.WhereClause](ctx)
    {
        return this.visit(ctx[RuleName.Expression])
    }

    [RuleName.Expression](ctx)
    {
        return this.visit(ctx[RuleName.AndOrExpression])
    }
    
    /**
     * Expressions
     */
    [RuleName.AndOrExpression](ctx)
    {
        let operands = []
        
        Object.entries(ctx).forEach(([key, value]) => {
            if(key === Token.And.name || key === Token.Or.name)
            {
                operands = operands.concat(...<[]>value)
            }
        });
        //Ensure the location of operands are in order.
        operands = operands.sort((a,b) => a.startOffset - b.startOffset);
        
        let lhs = this.visit(ctx.lhs)
        
        if(ctx['rhs'])
        {
            let rhsResults = ctx.rhs.map(i => this.visit(i))

            let firstRhsResult = rhsResults.shift()
            let firstOperand = operands.shift()

            let rhsExpression = firstRhsResult.expression
            let rhsExpressionAttributeNames = firstRhsResult.expressionAttributeNames
            let rhsExpressionAttributeValues = firstRhsResult.expressionAttributeValues

            for(let rhs of rhsResults)
            {
                rhsExpression = `${rhsExpression} ${operands.shift().image} ${rhs.expression}`,
                rhsExpressionAttributeNames = Object.assign(rhsExpressionAttributeNames, rhs.expressionAttributeNames),
                rhsExpressionAttributeValues = Object.assign(rhsExpressionAttributeValues, rhs.expressionAttributeValues)
            }

            return {
                expression: `${lhs.expression} ${firstOperand.image} ${rhsExpression}`,
                expressionAttributeNames: Object.assign(lhs.expressionAttributeNames, rhsExpressionAttributeNames),
                expressionAttributeValues: Object.assign(lhs.expressionAttributeValues, rhsExpressionAttributeValues)
            }
        }
        else
        {
            return lhs;
        }
    }
    [RuleName.HighPrecedenceExpression](ctx)
    {
        if(ctx[RuleName.ComparisonExpression])
        {
            return this.visit(ctx[RuleName.ComparisonExpression])
        }
        else if(ctx[RuleName.ParenthesisExpression])
        {
            return this.visit(ctx[RuleName.ParenthesisExpression])
        }
        else if(ctx[RuleName.NotExpression])
        {
            return this.visit(ctx[RuleName.NotExpression])
        }
        else if(ctx[RuleName.BetweenInExpression])
        {
            return this.visit(ctx[RuleName.BetweenInExpression])
        }
        else if(ctx[RuleName.InExpression])
        {
            return this.visit(ctx[RuleName.InExpression])
        }
        else if(ctx[RuleName.AttributeExistsExpression])
        {
            return this.visit(ctx[RuleName.AttributeExistsExpression])
        }
        else if(ctx[RuleName.AttributeNotExistsExpression])
        {
            return this.visit(ctx[RuleName.AttributeNotExistsExpression])
        }
        else if(ctx[RuleName.AttributeTypeExpression])
        {
            return this.visit(ctx[RuleName.AttributeTypeExpression])
        }
        else if(ctx[RuleName.SizeExpression])
        {
            return this.visit(ctx[RuleName.SizeExpression])
        }
    }
    [RuleName.Operand](ctx)
    {
        let operand = '';
        
        if(ctx[Token.Equal.name])
        {
            operand = '='
        }
        else if(ctx[Token.NotEqual.name])
        {
            operand = '<>'
        }
        else if(ctx[Token.GreaterThan.name])
        {
            operand = '>'
        }
        else if(ctx[Token.GreaterThanEqual.name])
        {
            operand = '>='
        }
        else if(ctx[Token.LessThan.name])
        {
            operand = '<'
        }
        else if(ctx[Token.LessThanEqual.name])
        {
            operand = '<='
        }

        return operand
    }
    [RuleName.ComparisonExpression](ctx)
    {
        let lhs = ctx.Identifier[0].image;
        let operand = this.visit(ctx[RuleName.Operand])
        let rhs = this.visit(ctx[RuleName.AtomicExpression])
        
        return {
            expression: `#${lhs} ${operand} :${lhs}`,
            expressionAttributeNames: { [`#${lhs}`]: lhs },
            expressionAttributeValues: { [`:${lhs}`]: rhs }
        }
    }
    [RuleName.AtomicExpression](ctx)
    {
        if (ctx.String)
        {
            //Remove ""
            return ctx.String[0].image.substr(1, ctx.String[0].image.length - 2)
        }
        else if(ctx.Boolean)
        {
            return ctx.Boolean[0].image.toLowerCase() === 'true'
        }
        else 
        {
            return Number(ctx.Integer[0].image)
        }
    }
    [RuleName.ParenthesisExpression](ctx)
    {
        let child = this.visit(ctx[RuleName.AndOrExpression])

        return {
            expression: `(${child.expression})`,
            expressionAttributeNames: child.expressionAttributeNames,
            expressionAttributeValues: child.expressionAttributeValues
        }
    }
    [RuleName.NotExpression](ctx)
    {
        let child = this.visit(ctx[RuleName.AndOrExpression])

        return {
            expression: `not ${child.expression}`,
            expressionAttributeNames: child.expressionAttributeNames,
            expressionAttributeValues: child.expressionAttributeValues
        }
    }
    [RuleName.BetweenInExpression](ctx)
    {
        let lhs = ctx.Identifier[0].image
        let between = this.visit(ctx.between)
        let and = this.visit(ctx.and)

        return {
            expression: `#${lhs} between :${lhs}_between_1 and :${lhs}_between_2`,
            expressionAttributeNames: {[`#${lhs}`]: lhs},
            expressionAttributeValues: {[`:${lhs}_between_1`]: between, [`:${lhs}_between_2`]: and}
        }
    }
    [RuleName.InExpression](ctx)
    {
        let lhs = ctx.Identifier[0].image

        let rhs = ctx[RuleName.AtomicExpression].map(i => this.visit(i))

        return {
            expression: `#${lhs} in (${rhs.map((item, index)=>`:${lhs}_in_${index+1}`)})`,
            expressionAttributeNames: {[`#${lhs}`]: lhs},
            expressionAttributeValues: rhs.reduce((result, item, index)=>{result[`:${lhs}_in_${index+1}`] = item; return result}, {})
        }
    }
    [RuleName.AttributeExistsExpression](ctx)
    {
        let identifier = ctx.Identifier[0].image

        return {
            expression: `attribute_exists(#${identifier})`,
            expressionAttributeNames: {[`#${identifier}`]: identifier},
            expressionAttributeValues: {}
        }
    }
    [RuleName.AttributeNotExistsExpression](ctx)
    {
        let identifier = ctx.Identifier[0].image

        return {
            expression: `attribute_not_exists(#${identifier})`,
            expressionAttributeNames: {[`#${identifier}`]: identifier},
            expressionAttributeValues: {}
        }
    }
    [RuleName.AttributeTypeExpression](ctx)
    {
        let identifier = ctx.Identifier[0].image
        let type = this.removeEnclosingDoubleQuotes(ctx.String[0].image)

        return {
            expression: `attribute_type(#${identifier},:${identifier})`,
            expressionAttributeNames: {[`#${identifier}`]: identifier},
            expressionAttributeValues: {[`:${identifier}`]: type}
        }
    }
    [RuleName.SizeExpression](ctx)
    {
        let lhs = ctx.Identifier[0].image
        let operand = this.visit(ctx[RuleName.Operand])
        let rhs = this.visit(ctx[RuleName.AtomicExpression])

        return {
            expression: `size(#${lhs}) ${operand} :${lhs}`,
            expressionAttributeNames: {[`#${lhs}`]: lhs},
            expressionAttributeValues: {[`:${lhs}`]: rhs}
        }
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

    /**
     * ObjectId
     */
    [RuleName.ObjectId](ctx)
    {
        if (ctx.String)
        {
            //Remove ""
            return this.removeEnclosingDoubleQuotes(ctx.String[0].image)
        }
        else 
        {
            return Number(ctx.Integer[0].image)
        }
    }

    /**
     * Helper
     */
    removeEnclosingDoubleQuotes(s)
    {
        return s.substr(1, s.length - 2)
    }
}