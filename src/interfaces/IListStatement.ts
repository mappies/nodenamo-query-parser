import { IStatement } from './IStatement';

export interface IListStatement extends IStatement
{
    projections: string[]
    from: string
    using: string
    by: {hash:string, range:string}
    filter: {filterExpression?:string, expressionAttributeValues?:object, expressionAttributeNames?:object}
    resume: string
    order: boolean
    limit: number
    stronglyConsistent: boolean
}