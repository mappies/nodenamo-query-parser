import { IStatement } from './IStatement';

export interface IFindStatement extends IStatement
{
    projections: string[]
    from: string
    using: string
    where: {keyConditions:string, expressionAttributeValues?:object, expressionAttributeNames?:object}
    filter: {filterExpression?:string, expressionAttributeValues?:object, expressionAttributeNames?:object}
    resume: string
    order: boolean
    limit: number
    stronglyConsistent: boolean
}