import { RuleName } from '../entities/ruleName';
import { Token } from '../entities/token';
import { IUpdateStatement } from '../interfaces/IUpdateStatement';
import { StatementParser } from './statementParser';
import { IInsertStatement } from '../interfaces/IInsertStatement';
import { IGetStatement } from '../interfaces/IGetStatement';
import { IDeleteStatement } from '../interfaces/IDeleteStatement';
import { IFindStatement } from '../interfaces/IFindStatement';
import { IListStatement } from '../interfaces/IListStatement';
import { ICreateTableStatement } from '../interfaces/ICreateTableStatement';
import { IDeleteTableStatement } from '../interfaces/IDeleteTableStatement';
import { IShowTablesStatement } from '../interfaces/IShowTablesStatement';
import { IUnloadTableStatement } from '../interfaces/IUnloadTableStatement';
import { IImportStatement } from '../interfaces/IImportStatement';
import { IExplainStatement } from '../interfaces/IExplainStatement';
import { IOnStatement } from '../interfaces/IOnStatement';
import { IDescribeStatement } from '../interfaces/IDescribeStatement';
import { ReturnValue } from '../parser';

const statementParser = new StatementParser()
const BaseSQLVisitor = statementParser.getBaseCstVisitorConstructor()
let propertyCollisionIndex = 1

export function resetCollisionIndex()
{
    propertyCollisionIndex = 1;
}

export class StatementSemanticVisitor extends BaseSQLVisitor 
{
    constructor()
    {
        super()
        this.validateVisitor()
    }

    [RuleName.Statement](ctx)
    {
        if(ctx[RuleName.ExplainStatement])
        {
            return this.visit(ctx[RuleName.ExplainStatement])
        }
        else if(ctx[RuleName.AtomicStatement])
        {
            return this.visit(ctx[RuleName.AtomicStatement])
        }
    }

    [RuleName.ExplainStatement](ctx): IExplainStatement
    {
        return { type: 'explain',
                 statement: this.visit(ctx[RuleName.AtomicStatement])}
    }

    [RuleName.AtomicStatement](ctx)
    {
        if (ctx[RuleName.ListStatement])
        {
            return this.visit(ctx[RuleName.ListStatement])
        }
        else if (ctx[RuleName.FindStatement])
        {
            return this.visit(ctx[RuleName.FindStatement])
        }
        else if (ctx[RuleName.GetStatement])
        {
            return this.visit(ctx[RuleName.GetStatement])
        }
        else if (ctx[RuleName.InsertStatement])
        {
            return this.visit(ctx[RuleName.InsertStatement])
        }
        else if (ctx[RuleName.UpdateStatement])
        {
            return this.visit(ctx[RuleName.UpdateStatement])
        }
        else if (ctx[RuleName.OnStatement])
        {
            return this.visit(ctx[RuleName.OnStatement])
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
        else if (ctx[RuleName.ImportStatement])
        {
            return this.visit(ctx[RuleName.ImportStatement])
        }
        else if (ctx[RuleName.ShowTablesStatement])
        {
            return this.visit(ctx[RuleName.ShowTablesStatement])
        }
        else if (ctx[RuleName.UnloadTableStatement])
        {
            return this.visit(ctx[RuleName.UnloadTableStatement])
        }
        else if (ctx[RuleName.DescribeStatement])
        {
            return this.visit(ctx[RuleName.DescribeStatement])
        }
    }

    /**
     * DESCRIBE Statement
     * 
     * Syntax: DESCRIBE identifier 
     */
    [RuleName.DescribeStatement](ctx): IDescribeStatement
    {
        return {
            type: "describe",
            name: ctx.Identifier[0].image
        }
    }

    /**
     * INSERT Statement
     * 
     * Syntax: INSERT jsonObject INTO identifier (where expression)? 
     */
    [RuleName.InsertStatement](ctx): IInsertStatement
    {
        return {
            type: "insert",
            object: this.visit(ctx[RuleName.InsertClause]),
            into: this.visit(ctx[RuleName.InsertIntoClause]),
            where: this.visit(ctx[RuleName.WhereClause], 'conditionExpression')
        }
    }

    [RuleName.InsertClause](ctx) 
    {
        return this.visit(ctx[RuleName.JsonObject])
    }

    [RuleName.InsertIntoClause](ctx) 
    {
        return ctx.Identifier[0].image
    }

    /**
     * GET Statement
     * 
     * Syntax: GET string|number FROM identifier (Strongly Consistent)? 
     */
    [RuleName.GetStatement](ctx): IGetStatement
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
     * UPDATE Statement
     * 
     * Syntax: UPDATE jsonObject FROM identifier (where expression)? (returning NONE|ALLOLD|ALLNEW)? (with version check)?
     */
    [RuleName.UpdateStatement](ctx): IUpdateStatement
    {
        return {
            type: "update",
            object: this.visit(ctx[RuleName.UpdateClause]),
            from: this.visit(ctx[RuleName.UpdateFromClause]),
            where: this.visit(ctx[RuleName.WhereClause], 'conditionExpression'),
            versionCheck: this.visit(ctx[RuleName.UpdateWithVersionCheckClause]),
            returnValue: this.visit(ctx[RuleName.ReturningClause])
        }
    }

    [RuleName.UpdateClause](ctx) 
    {
        return this.visit(ctx[RuleName.JsonObject])
    }

    [RuleName.UpdateFromClause](ctx) 
    {
        return ctx.Identifier[0].image
    }

    [RuleName.UpdateWithVersionCheckClause](ctx) 
    {
        return true
    }

    /**
     * ON Statement
     * 
     * Syntax: ON string|number FROM identifier 
     *         (SET identifier=value(, SET identifier=value)*)*
     *         (ADD identifier value(, ADD identifier value)*)*
     *         (DELETE identifier(, DELETE identifier)*)*
     *         (REMOVE identifier(, REMOVE identifier)*)*
     *         (where expression)?
     *         (returning NONE|ALLOLD|ALLNEW)? 
     *         (with version check)?
     */
    [RuleName.OnStatement](ctx): IOnStatement
    {
        let expressions = ctx[RuleName.OnExpressionClause].map(i => this.visit(i))

        let setExpression = {setExpressions:[], expressionAttributeNames:{}, expressionAttributeValues:{}}
        let addExpression = {addExpressions:[], expressionAttributeNames:{}, expressionAttributeValues:{}}
        let removeExpression = {removeExpressions:[], expressionAttributeNames:{}, expressionAttributeValues:{}}
        let deleteExpression = {deleteExpressions:[], expressionAttributeNames:{}, expressionAttributeValues:{}}

        for(let expression of expressions)
        {
            if(expression.setExpressions)
            {
                setExpression.setExpressions = setExpression.setExpressions.concat(expression.setExpressions)
                setExpression.expressionAttributeNames = Object.assign(setExpression.expressionAttributeNames, expression.expressionAttributeNames)
                setExpression.expressionAttributeValues = Object.assign(setExpression.expressionAttributeValues, expression.expressionAttributeValues)
            }
            else if(expression.addExpressions)
            {
                addExpression.addExpressions = addExpression.addExpressions.concat(expression.addExpressions)
                addExpression.expressionAttributeNames = Object.assign(addExpression.expressionAttributeNames, expression.expressionAttributeNames)
                addExpression.expressionAttributeValues = Object.assign(addExpression.expressionAttributeValues, expression.expressionAttributeValues)
            }
            else if(expression.removeExpressions)
            {
                removeExpression.removeExpressions = removeExpression.removeExpressions.concat(expression.removeExpressions)
                removeExpression.expressionAttributeNames = Object.assign(removeExpression.expressionAttributeNames, expression.expressionAttributeNames)
                removeExpression.expressionAttributeValues = Object.assign(removeExpression.expressionAttributeValues, expression.expressionAttributeValues)
            }
            else if(expression.deleteExpressions)
            {
                deleteExpression.deleteExpressions = deleteExpression.deleteExpressions.concat(expression.deleteExpressions)
                deleteExpression.expressionAttributeNames = Object.assign(deleteExpression.expressionAttributeNames, expression.expressionAttributeNames)
                deleteExpression.expressionAttributeValues = Object.assign(deleteExpression.expressionAttributeValues, expression.expressionAttributeValues)
            }
        }
        
        return {
            type: "on",
            id:  this.visit(ctx[RuleName.OnClause]),
            from: this.visit(ctx[RuleName.OnFromClause]),
            set: setExpression.setExpressions.length > 0 ? setExpression : undefined,
            add: addExpression.addExpressions.length > 0 ? addExpression : undefined,
            remove: removeExpression.removeExpressions.length > 0 ? removeExpression : undefined,
            delete: deleteExpression.deleteExpressions.length > 0 ? deleteExpression : undefined,
            where: this.visit(ctx[RuleName.WhereClause], 'conditionExpression'),
            returnValue: this.visit(ctx[RuleName.ReturningClause]),
            versionCheck: this.visit(ctx[RuleName.OnWithVersionCheckClause])
        }
    }

    [RuleName.OnClause](ctx)
    {
        return this.visit(ctx[RuleName.ObjectId])
    }

    [RuleName.OnFromClause](ctx)
    {
        return ctx.Identifier[0].image
    }

    [RuleName.OnExpressionClause](ctx)
    {
        if(ctx[RuleName.OnSetClause])
        {
            return this.visit(ctx[RuleName.OnSetClause])
        }
        else if(ctx[RuleName.OnAddClause])
        {
            return this.visit(ctx[RuleName.OnAddClause])
        }
        else if(ctx[RuleName.OnRemoveClause])
        {
            return this.visit(ctx[RuleName.OnRemoveClause])
        }
        else if(ctx[RuleName.OnDeleteClause])
        {
            return this.visit(ctx[RuleName.OnDeleteClause])
        }
    }

    [RuleName.OnSetClause](ctx)
    {
        let lhs = ctx.lhs.map(i => i.image)
        let rhs = ctx.rhs.map(i => this.visit(i))

        let expressions = []
        let attributeNames = {}
        let attributeValues = {}

        lhs.forEach((property, index)=>{
            //Duplicate property found.
            let suffix = `___${propertyCollisionIndex++}`

            expressions.push(`#${property}${suffix} = :${property}${suffix}`)
            attributeNames[`#${property}${suffix}`] = property
            attributeValues[`:${property}${suffix}`] = rhs[index]
        })

        return {
            setExpressions: expressions,
            expressionAttributeNames: attributeNames,
            expressionAttributeValues: attributeValues
        }
    }

    [RuleName.OnAddClause](ctx)
    {
        let lhs = ctx.lhs.map(i => i.image)
        let rhs = ctx.rhs.map(i => Number(i.image))

        let expressions = []
        let attributeNames = {}
        let attributeValues = {}

        lhs.forEach((property, index)=>{
            //Duplicate property found.
            let suffix = `___${propertyCollisionIndex++}`

            expressions.push(`#${property}${suffix} :${property}${suffix}`)
            attributeNames[`#${property}${suffix}`] = property
            attributeValues[`:${property}${suffix}`] = rhs[index]
        })

        return {
            addExpressions: expressions,
            expressionAttributeNames: attributeNames,
            expressionAttributeValues: attributeValues
        }
    }

    [RuleName.OnRemoveClause](ctx)
    {
        let lhs = ctx.lhs.map(i => i.image)

        let expressions = []
        let attributeNames = {}

        lhs.forEach((property)=>{
            //Duplicate property found.
            let suffix = `___${propertyCollisionIndex++}`

            expressions.push(`#${property}${suffix}`)
            attributeNames[`#${property}${suffix}`] = property
        })

        return {
            removeExpressions: expressions,
            expressionAttributeNames: attributeNames,
            expressionAttributeValues: {}
        }
    }

    [RuleName.OnDeleteClause](ctx)
    {
        let lhs = ctx.lhs.map(i => i.image)
        let rhs = ctx.rhs.map(i => this.visit(i))

        let expressions = []
        let attributeNames = {}
        let attributeValues = {}

        lhs.forEach((property, index)=>{
            //Duplicate property found.
            let suffix = `___${propertyCollisionIndex++}`

            expressions.push(`#${property}${suffix} :${property}${suffix}`)
            attributeNames[`#${property}${suffix}`] = property
            attributeValues[`:${property}${suffix}`] = rhs[index]
        })

        return {
            deleteExpressions: expressions,
            expressionAttributeNames: attributeNames,
            expressionAttributeValues: attributeValues
        }
    }

    [RuleName.OnWithVersionCheckClause](ctx)
    {
        return true
    }

    /**
     * DELETE TABLE Statement
     * 
     * Syntax: DELETE TABLE FOR identifier
     */
    [RuleName.DeleteStatement](ctx): IDeleteStatement
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
    [RuleName.FindStatement](ctx): IFindStatement
    {
        return {
            type: "find",
            projections: this.visit(ctx[RuleName.FindClause]),
            from: this.visit(ctx[RuleName.FindFromClause]),
            using: this.visit(ctx[RuleName.FindUsingClause]),
            where: this.visit(ctx[RuleName.WhereClause], 'keyConditions'),
            filter: this.visit(ctx[RuleName.FindFilterClause]),
            resume: this.visit(ctx[RuleName.FindResumeClause]),
            order: this.visit(ctx[RuleName.FindOrderClause]),
            limit: this.visit(ctx[RuleName.FindLimitClause]),
            stronglyConsistent: this.visit(ctx[RuleName.FindStronglyConsistentClause])
        }
    }

    [RuleName.FindClause](ctx)
    {
        if(ctx.Star)
        {
            return undefined
        }

        return ctx.Identifier.map(s => s.image)
    }

    [RuleName.FindFromClause](ctx)
    {
        return ctx.Identifier[0].image;
    }

    [RuleName.FindUsingClause](ctx)
    {
        return ctx.Identifier[0].image;
    }

    [RuleName.FindFilterClause](ctx)
    {
        return this.visit(ctx[RuleName.Expression], 'filterExpression')
    }

    [RuleName.FindResumeClause](ctx)
    {
        return this.removeEnclosingDoubleQuotes(ctx.String[0].image);
    }

    [RuleName.FindOrderClause](ctx)
    {
        return ctx.Desc ? false : true;
    }

    [RuleName.FindLimitClause](ctx)
    {
        return Number(ctx.Number[0].image);
    }

    [RuleName.FindStronglyConsistentClause](ctx) 
    {
        return true
    }

    /**
     * LIST Statement
     * 
     * Syntax: FIND *|([string][,string]*) 
     *         FROM identifier 
     *         (USING identifier)?
     *         (BY hash [,range]?)? 
     *         (FILTER expression)? 
     *         (ORDER ASC|DESC)? 
     *         (LIMIT number)? 
     *         (Strongly Consistent)? 
     */
    [RuleName.ListStatement](ctx): IListStatement
    {
        return {
            type: "list",
            projections: this.visit(ctx[RuleName.ListClause]),
            from: this.visit(ctx[RuleName.FindFromClause]),
            using: this.visit(ctx[RuleName.FindUsingClause]),
            by: this.visit(ctx[RuleName.ListByClause]),
            filter: this.visit(ctx[RuleName.FindFilterClause]),
            resume: this.visit(ctx[RuleName.FindResumeClause]),
            order: this.visit(ctx[RuleName.FindOrderClause]),
            limit: this.visit(ctx[RuleName.FindLimitClause]),
            stronglyConsistent: this.visit(ctx[RuleName.FindStronglyConsistentClause])
        }
    }

    [RuleName.ListClause](ctx)
    {
        if(ctx.Star)
        {
            return undefined
        }

        return ctx.Identifier.map(s => s.image)
    }

    [RuleName.ListByClause](ctx)
    {
        return {
            hash: this.removeEnclosingDoubleQuotes(ctx.String[0].image),
            range: ctx.String.length > 1 ? this.removeEnclosingDoubleQuotes(ctx.String[1].image) : undefined
        }
    }

    /**
     * WHERE clause
     */
    [RuleName.WhereClause](ctx, expressionKeyName?:string)
    {
        return this.visit(ctx[RuleName.Expression], expressionKeyName)
    }

    [RuleName.Expression](ctx, expressionKeyName?:string)
    {
        let result = this.visit(ctx[RuleName.AndOrExpression])

        if(expressionKeyName && result?.expression)
        {
            result[expressionKeyName] = result.expression
            delete result.expression
        }

        return result
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
        operands.forEach(operand => operand.image = operand.image.trim())

        let lhs = this.visit(ctx.lhs)
        
        if(ctx['rhs'])
        {
            let rhsResults = ctx.rhs.map(i => this.visit(i))

            let firstRhsResult = rhsResults.shift()
            let firstOperand = operands.shift()

            let rhsExpression = {
                    expression: firstRhsResult.expression,
                    expressionAttributeNames: firstRhsResult.expressionAttributeNames,
                    expressionAttributeValues: firstRhsResult.expressionAttributeValues
            }

            for(let rhs of rhsResults)
            {
                rhsExpression = this.mergeExpressions(rhsExpression, operands.shift().image, rhs);
            }

            return this.mergeExpressions(lhs, firstOperand.image, rhsExpression)
        }
        else
        {
            return lhs;
        }
    }

    private mergeExpressions(expression1:{expression:string, expressionAttributeNames:object,expressionAttributeValues:object},
                             operand: string,
                             expression2:{expression:string, expressionAttributeNames:object,expressionAttributeValues:object} )
    {
        let expression1attributeNames = Object.keys(expression1.expressionAttributeNames)

        for(let expression1attributeName of expression1attributeNames)
        {
            if(expression2.expressionAttributeNames && expression1attributeName in expression2.expressionAttributeNames)
            {
                let duplicateAttributeName = expression1attributeName

                //Duplicate property found.
                let suffix = propertyCollisionIndex++

                //Change #duplicateProperty in expression2 to #duplicateProperty___$suffix
                let regex = new RegExp(`${expression1attributeName}([\\s,\\)])|${expression1attributeName}$`, "i")
                let newExpression2attributeName = duplicateAttributeName +`___${suffix}`

                expression2.expression = expression2.expression.replace(regex, newExpression2attributeName+"$1")
                expression2.expressionAttributeNames[newExpression2attributeName] = expression2.expressionAttributeNames[duplicateAttributeName] 
                delete expression2.expressionAttributeNames[duplicateAttributeName]

                //Change :duplicateProperty in expression2 to :duplicateProperty___$suffix
                let duplicateAttributeValue = duplicateAttributeName.replace(/^#/, ':')
                let newExpression2AttributeValue = duplicateAttributeValue+`___${suffix}`

                if(duplicateAttributeValue in expression2.expressionAttributeValues)
                {
                    let regex = new RegExp(`${duplicateAttributeValue}([\\s,\\)])|${duplicateAttributeValue}$`, "i")

                    expression2.expression = expression2.expression.replace(regex, newExpression2AttributeValue+'$1')
                    expression2.expressionAttributeValues[newExpression2AttributeValue] = expression2.expressionAttributeValues[duplicateAttributeValue]
                    delete expression2.expressionAttributeValues[duplicateAttributeValue]
                }
            }
        }

        return {
            expression: `${expression1.expression} ${operand} ${expression2.expression}`,
            expressionAttributeNames: Object.assign(expression1.expressionAttributeNames, expression2.expressionAttributeNames),
            expressionAttributeValues: Object.assign(expression1.expressionAttributeValues, expression2.expressionAttributeValues)
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
        else if(ctx[RuleName.BeginsWithExpression])
        {
            return this.visit(ctx[RuleName.BeginsWithExpression])
        }
        else if(ctx[RuleName.ContainsExpression])
        {
            return this.visit(ctx[RuleName.ContainsExpression])
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
            return Number(ctx.Number[0].image)
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

        //use propertyCollisionIndex to avoid collision
        let suffix = propertyCollisionIndex++
        let lhsWithSuffix = `${lhs}___${suffix}`

        return {
            expression: `#${lhsWithSuffix} between :${lhsWithSuffix}_between_1 and :${lhsWithSuffix}_between_2`,
            expressionAttributeNames: {[`#${lhsWithSuffix}`]: lhs},
            expressionAttributeValues: {[`:${lhsWithSuffix}_between_1`]: between, [`:${lhsWithSuffix}_between_2`]: and}
        }
    }
    [RuleName.InExpression](ctx)
    {
        let lhs = ctx.Identifier[0].image

        let rhs = ctx[RuleName.AtomicExpression].map(i => this.visit(i))

        //use propertyCollisionIndex to avoid collision
        let suffix = propertyCollisionIndex++
        let lhsWithSuffix = `${lhs}___${suffix}`

        return {
            expression: `#${lhsWithSuffix} in (${rhs.map((item, index)=>`:${lhsWithSuffix}_in_${index+1}`)})`,
            expressionAttributeNames: {[`#${lhsWithSuffix}`]: lhs},
            expressionAttributeValues: rhs.reduce((result, item, index)=>{result[`:${lhsWithSuffix}_in_${index+1}`] = item; return result}, {})
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
    [RuleName.BeginsWithExpression](ctx)
    {
        let identifier = ctx.Identifier[0].image
        let str = this.removeEnclosingDoubleQuotes(ctx.String[0].image)

        return {
            expression: `begins_with(#${identifier},:${identifier})`,
            expressionAttributeNames: {[`#${identifier}`]: identifier},
            expressionAttributeValues: {[`:${identifier}`]: str}
        }
    }
    [RuleName.ContainsExpression](ctx)
    {
        let identifier = ctx.Identifier[0].image
        let str = this.removeEnclosingDoubleQuotes(ctx.String[0].image)

        return {
            expression: `contains(#${identifier},:${identifier})`,
            expressionAttributeNames: {[`#${identifier}`]: identifier},
            expressionAttributeValues: {[`:${identifier}`]: str}
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
     * IMPORT Statement
     * 
     * Syntax: IMPORT identifier (AS identifier)?|{identifier (AS identifier)?} FROM string
     */
    [RuleName.ImportStatement](ctx): IImportStatement
    {
        return {
            type: "import",
            entities: this.visit(ctx[RuleName.ImportClause]),
            from: this.visit(ctx[RuleName.ImportFromClause])
        }
    }

    [RuleName.ImportClause](ctx)
    {
        if(ctx.entity)
        {
            return this.visit(ctx.entity)
        }
        else if(ctx.defaultEntity)
        {
            return this.visit(ctx.defaultEntity)
        }
    }

    [RuleName.ImportDefaultTypeClause](ctx)
    {
        let alias = ctx.alias ? ctx.alias[0].image : ctx.Identifier[0].image
        
        let result = [{name: ctx.Identifier[0].image, as: alias, default: true}]

        if(ctx[RuleName.ImportNonDefaultTypeClause])
        {
            result.push(...this.visit(ctx[RuleName.ImportNonDefaultTypeClause]))
        }
        
        if(ctx[RuleName.ImportDefaultTypeClause])
        {
            result.push(...this.visit(ctx[RuleName.ImportDefaultTypeClause]))
        }

        return result
    }

    [RuleName.ImportNonDefaultTypeClause](ctx)
    {
        let result = ctx.importTypeClauseRuleName.map(clause => this.visit(clause))

        if(ctx[RuleName.ImportDefaultTypeClause])
        {
            result.push(...this.visit(ctx[RuleName.ImportDefaultTypeClause]))
        }
        
        if(ctx[RuleName.ImportNonDefaultTypeClause])
        {
            result.push(...this.visit(ctx[RuleName.ImportNonDefaultTypeClause]))
        }

        return result
    }

    [RuleName.ImportTypeClause](ctx)
    {
        let alias =  ctx.alias ? ctx.alias[0].image : ctx.Identifier[0].image

        return {name: ctx.Identifier[0].image, as: alias, default: false}
    }

    [RuleName.ImportFromClause](ctx)
    {
        return this.removeEnclosingDoubleQuotes(ctx.String[0].image)
    }

    /**
     * CREATE TABLE Statement
     * 
     * Syntax: CREATE TABLE FOR identifier WITH CAPACITY OF number number
     */
    [RuleName.CreateTableStatement](ctx): ICreateTableStatement
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
            readCapacity: Number(ctx.Number[0].image),
            writeCapacity: Number(ctx.Number[1].image)
        }
    }

    /**
     * SHOW TABLES Statement
     * 
     * Syntax: SHOW TABLES
     */
    [RuleName.ShowTablesStatement](ctx): IShowTablesStatement
    {
        return {
            type: "show_tables"
        }
    }

    [RuleName.ShowTablesClause](ctx)
    {
        return
    }

    /**
     * REMOVE TABLE Statement
     * 
     * Syntax: REMOVE TABLE identifier
     */
    [RuleName.UnloadTableStatement](ctx): IUnloadTableStatement
    {
        return {
            type: "unload_table",
            name: this.visit(ctx[RuleName.UnloadTableClause])
        }
    }

    [RuleName.UnloadTableClause](ctx)
    {
        return ctx.Identifier[0].image;
    }

    /**
     * DELETE TABLE Statement
     * 
     * Syntax: DELETE TABLE FOR identifier
     */
    [RuleName.DeleteTableStatement](ctx): IDeleteTableStatement
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
     * JSON
     */
    [RuleName.JsonObject](ctx)
    {
        let keyValuePairs = ctx[RuleName.JsonObjectItem]?.map(item => (this.visit(item))) || []

        let result = {}

        for(let kvp of keyValuePairs)
        {
            result = Object.assign(result, kvp)
        }

        return result
    }

    [RuleName.JsonObjectItem](ctx)
    {
        let key = ctx.String ? this.removeEnclosingDoubleQuotes(ctx.String[0].image) : ctx.Identifier[0].image
        let value = this.visit(ctx[RuleName.JsonValue])

        return {[key]: value}
    }

    [RuleName.JsonArray](ctx)
    {
        return ctx[RuleName.JsonValue]?.map(clause => this.visit(clause)) || []
    }

    [RuleName.JsonValue](ctx)
    {
        if(ctx.String)
        {
            return JSON.parse(ctx.String[0].image)
        }
        else if(ctx.Number)
        {
            return Number(ctx.Number[0].image)
        }
        else if(ctx.Boolean)
        {
            return ctx.Boolean[0].image.toLowerCase() === 'true'
        }
        else if(ctx.Null)
        {
            return null
        }
        else if(ctx.Undefined)
        {
            return undefined
        }
        else if(ctx[RuleName.JsonArray])
        {
            return this.visit(ctx[RuleName.JsonArray])
        }
        else if(ctx[RuleName.JsonObject])
        {
            return this.visit(ctx[RuleName.JsonObject])
        }
        else
        {
            return undefined
        }
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
            return Number(ctx.Number[0].image)
        }
    }

    /**
     * Returning
     */
    [RuleName.ReturningClause](ctx) 
    {
        return ctx.AllNew ? ReturnValue.AllNew : (ctx.AllOld ? ReturnValue.AllOld : ReturnValue.None)
    }

    /**
     * Helper
     */
    removeEnclosingDoubleQuotes(s)
    {
        return s.substr(1, s.length - 2)
    }
}