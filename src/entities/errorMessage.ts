export class ErrorMessage
{
    static readonly UNEXPECTED_TOKEN = 'Unexpected token "?" found.'
    static readonly UNRECOGNIZED_COMMAND = 'Unrecognized command "?" found.'

    static readonly GET_MISSING_ID = 'Missing an object ID from the GET statement.'
    static readonly GET_MISSING_FROM = 'Missing "FROM" clause from the GET statement.'
    static readonly GET_MISSING_TABLE = 'Missing a table name from the GET statement.'
}