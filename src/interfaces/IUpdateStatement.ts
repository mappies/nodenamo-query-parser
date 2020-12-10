import { IStatement } from './IStatement';

export interface IUpdateStatement extends IStatement
{
    object:object
    from:string
    where:{conditionExpression?:string, expressionAttributeValues?:object, expressionAttributeNames?:object}
    versionCheck:boolean
}