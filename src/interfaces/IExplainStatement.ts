import { IStatement } from './IStatement';

export interface IExplainStatement extends IStatement
{
    statement:IStatement
}