import { IStatement } from './IStatement';

export interface IDeleteTableStatement extends IStatement
{
    for:string
}