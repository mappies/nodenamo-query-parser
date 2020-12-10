import { IStatement } from './IStatement';

export interface IGetStatement extends IStatement
{
    id:string|number
    from:string
    stronglyConsistent:boolean
}