import { IStatement } from './IStatement';
import { ReturnValue } from './returnValue';

export interface IUpdateStatement extends IStatement
{
    object:object
    from:string
    where:{conditionExpression?:string, expressionAttributeValues?:object, expressionAttributeNames?:object}
    versionCheck:boolean
    returnValue: ReturnValue
}