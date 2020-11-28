export class ErrorMessage
{
    static readonly UNEXPECTED_TOKEN = 'Unexpected token "?" found.'
    static readonly UNRECOGNIZED_COMMAND = 'Unrecognized command "?" found.'
    static readonly UNEXPECTED_END_OF_STATEMENT = 'Unexpected end of statement'
    
    static readonly MISSING_OBJECT_ID = 'Missing an object ID or an invalid ID is given.'
    static readonly MISSING_ENTITY_NAME = 'Missing an entity name.'

    static readonly GET_MISSING_FROM = 'Missing "FROM" clause from the GET statement.'
    static readonly GET_MISSING_TABLE = 'Missing a table name from the GET statement.'

    static readonly CREATE_TABLE_MISSING_FOR = 'Missing "FOR" clause from the CREATE TABLE statement.'
    static readonly CREATE_TABLE_MISSING_READ_CAPACITY = 'Missing a read capacity number from the CREATE TABLE statement.'
    static readonly CREATE_TABLE_MISSING_WRITE_CAPACITY = 'Missing a read capacity number from the CREATE TABLE statement.'

    static readonly DELETE_TABLE_MISSING_FOR = 'Missing "FOR" clause from the DELETE TABLE statement.'
    static readonly DELETE_TABLE_MISSING_ENTITY_NAME = 'Missing an entity name from the DELETE TABLE statement.'

    static readonly DELETE_MISSING_FROM = 'Missing "FROM" clause from the DELETE statement.'

    static readonly EXPRESSION_MISSING_PARENTHESIS = 'Missing a closing parenthesis in the expression.'
}