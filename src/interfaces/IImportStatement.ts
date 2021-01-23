import { IStatement } from './IStatement';

export interface IImportStatement extends IStatement
{
    entities:[{name:string, as:string, default:boolean}]
    from:string
}