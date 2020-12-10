export class ErrorMessage
{
    static readonly UNEXPECTED_TOKEN = 'Unexpected token "?" found.'
    static readonly UNRECOGNIZED_COMMAND = 'Unrecognized command "?" found.'
    static readonly UNEXPECTED_END_OF_STATEMENT = 'Unexpected end of statement'
    
    static readonly MISSING_OBJECT_ID = 'Missing an object ID or an invalid ID is given.'
    static readonly MISSING_ENTITY_NAME = 'Missing an entity name or an invalid entity name is given.'
    static readonly MISSING_PROPERTY_NAME = 'Missing a property name or an invalid property name is given.'

    static readonly GET_MISSING_FROM = 'Missing "FROM" clause from the GET statement.'
    static readonly GET_MISSING_TABLE = 'Missing a table name from the GET statement.'

    static readonly CREATE_TABLE_MISSING_FOR = 'Missing "FOR" clause from the CREATE TABLE statement.'
    static readonly CREATE_TABLE_MISSING_READ_CAPACITY = 'Missing a read capacity number from the CREATE TABLE statement.'
    static readonly CREATE_TABLE_MISSING_WRITE_CAPACITY = 'Missing a read capacity number from the CREATE TABLE statement.'

    static readonly DELETE_TABLE_MISSING_FOR = 'Missing "FOR" clause from the DELETE TABLE statement.'
    static readonly DELETE_TABLE_MISSING_ENTITY_NAME = 'Missing an entity name from the DELETE TABLE statement.'

    static readonly DELETE_MISSING_FROM = 'Missing "FROM" clause from the DELETE statement.'

    static readonly FIND_MISSING_PROJECTIONS = 'Missing projected properties from the statement. Specify property names or use * to project all properties.'
    static readonly FIND_MISSING_PROJECTION = 'Missing a projected property after a comma.'
    static readonly FIND_MISSING_FROM = 'Missing "FROM" clause from the statement.'
    static readonly FIND_MISSING_TABLE = 'Missing a table name from the statement.'
    static readonly FIND_MISSING_LIMIT = 'Missing a number of records to return after LIMIT.'
    static readonly FIND_MISSING_USING = 'Missing a GSI name after USING.'
    static readonly FIND_MISSING_ORDER = 'Missing a sorting order (ASC or DESC) after ORDER.'
    static readonly FIND_MISSING_RESUME = 'Missing a lastEvaluatedKey after RESUME'

    static readonly LIST_MISSING_BY_HASH = 'Missing a hash property value after BY.'
    static readonly LIST_MISSING_BY_RANGE = 'Missing a range property value after BY.'

    static readonly IMPORT_MISSING_FROM = 'Missing "FROM" clause from the IMPORT statement.'
    static readonly IMPORT_MISSING_CLOSING_CURLY_PARENTHESIS = 'Missing a closing curly parenthesis.'
    static readonly IMPORT_MISSING_PACKAGE_NAME = 'Missing a package name from the IMPORT statement.'
    static readonly IMPORT_MISSING_ALIAS = 'Missing an alias name after AS.'

    static readonly EXPRESSION_MISSING_PARENTHESIS = 'Missing a closing parenthesis in the expression.'
    static readonly EXPRESSION_MISSING_PROPERTY_TYPE = 'Missing a property type.'
    static readonly EXPRESSION_MISSING_SEARCH_STRING = 'Missing a string to search for.'

    static readonly JSON_INVALID_OBJECT = 'Invalid JSON object.'
    static readonly JSON_MISSING_CLOSING_BRACKET = 'Invalid JSON array. Missing a closing bracket.'
    static readonly JSON_MISSING_PROPERTY_KEY = 'Invalid JSON object. Missing a property key.'
    static readonly JSON_MISSING_PROPERTY_VALUE = 'Invalid JSON object. Missing a property value.'
    static readonly JSON_MISSING_CLOSING_CURLY_PARENTHESIS = 'Invalid JSON object. Missing a closing curly parenthesis.'
    static readonly JSON_INVALID_VALUE = 'Invalid JSON value. Expect a string, a number, a boolean, an array, or an object.'
}