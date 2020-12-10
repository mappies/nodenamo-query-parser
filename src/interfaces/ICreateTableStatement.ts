import { IStatement } from './IStatement';

export interface ICreateTableStatement extends IStatement
{
    for:string
    withCapacityOf: {readCapacity:number, writeCapacity:number}
}