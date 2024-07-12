import { IStatement } from './IStatement';
import { ReturnValue } from './returnValue';

export interface IOnStatement extends IStatement
{
    id: string|number
    from: string
    set: {setExpressions:string[], expressionAttributeNames?:object, expressionAttributeValues?:object}
    add: {addExpressions:string[], expressionAttributeNames?:object, expressionAttributeValues?:object}
    remove: {removeExpressions:string[], expressionAttributeNames?:object, expressionAttributeValues?:object}
    delete: {deleteExpressions:string[], expressionAttributeNames?:object, expressionAttributeValues?:object}
    where: {conditionExpression?:string, expressionAttributeValues?:object, expressionAttributeNames?:object}
    versionCheck: boolean
    returnValue: ReturnValue
}
