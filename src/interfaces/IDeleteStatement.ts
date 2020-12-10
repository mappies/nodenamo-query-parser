import { IStatement } from './IStatement';

export interface IDeleteStatement extends IStatement
{
    id:string|number
    from:string
    where:{conditionExpression:string, expressionAttributeValues?:object, expressionAttributeNames?:object}
}