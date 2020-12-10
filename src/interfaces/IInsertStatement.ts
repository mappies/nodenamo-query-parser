import { IStatement } from './IStatement';

export interface IInsertStatement extends IStatement
{
    object:object
    into:string
    where:{conditionExpression?:string, expressionAttributeValues?:object, expressionAttributeNames?:object}
}