import { IStatement } from './IStatement';

export interface IImportStatement extends IStatement
{
    entity:{name:string, as:string, default:boolean}
    from:string
}