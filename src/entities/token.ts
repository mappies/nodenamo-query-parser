import {createToken, Lexer} from 'chevrotain'

export class Token
{
    static readonly Get = createToken({ name: "Get", label: "get", pattern: /GET\s+/i })
    static readonly From = createToken({ name: "From", label: "from", pattern: /From/i })
    static readonly Explain = createToken({ name: "Explain", label: "explain", pattern: /Explain\s+/i })
    static readonly StronglyConsistent = createToken({ name: "StronglyConsistent", label: "strongly consistent", pattern: /Strongly\s+Consistent/i })
    static readonly CreateTable = createToken({ name: "CreateTable", label: "create table", pattern: /Create\s+Table/i })
    static readonly For = createToken({ name: "For", label: "for", pattern: /For/i })
    static readonly WithCapacityOf = createToken({ name: "WithCapacityOf", label: "with capacity of", pattern: /With\s+Capacity\s+Of/i})
    static readonly DeleteTable = createToken({ name: "DeleteTable", label: "delete table", pattern: /Delete\s+Table/i })
    static readonly Delete = createToken({ name: "Delete", label: "delete", pattern: /Delete\s+/i,})
    static readonly Where = createToken({ name: "Where", label: "where", pattern: /Where/i })
    static readonly Find = createToken({ name: "Find", label: "find", pattern: /Find/i })
    static readonly Describe = createToken({ name: "Describe", label: "describe", pattern: /Describe/i })
    static readonly Import = createToken({ name: "Import", label: "import", pattern: /Import/i })
    static readonly Insert = createToken({ name: "Insert", label: "insert", pattern: /Insert\s+/i })
    static readonly Into = createToken({ name: "Into", label: "into", pattern: /Into\s+/i })
    static readonly Update = createToken({ name: "Update", label: "update", pattern: /Update\s+/i })
    static readonly WithVersionCheck = createToken({ name: "WithVersionCheck", label: "with version check", pattern: /With\s+Version\s+Check/i })
    static readonly ShowTables = createToken({ name: "ShowTables", label: "show tables", pattern:/Show\s+Tables\s+/i })
    static readonly UnloadTable = createToken({ name: "UnloadTable", label: "unload table", pattern:/Unload\s+Table\s+/i })
    static readonly List = createToken({ name: "List", label: "list", pattern: /List\s+/i })
    static readonly Using = createToken({ name: "Using", label: "using", pattern: /Using/i })
    static readonly Filter = createToken({ name: "Filter", label: "filter", pattern: /Filter/i })
    static readonly Resume = createToken({ name: "Resume", label: "resume", pattern: /Resume/i })
    static readonly Order = createToken({ name: "Order", label: "order", pattern: /Order/i })
    static readonly Limit = createToken({ name: "Limit", label: "limit", pattern: /Limit/i })
    static readonly By = createToken({ name: "By", label: "by", pattern: /By\s+/i })
    static readonly As = createToken({ name: "As", label: "as", pattern: /As\s+/i })
    static readonly Asc = createToken({ name: "Asc", label: "asc", pattern: /\sAsc\W+/i })
    static readonly Desc = createToken({ name: "Desc", label: "desc", pattern:/\sDesc\W+/i })
    static readonly Star = createToken({ name: "Star", label: "*", pattern: /\*/ })

    static readonly Identifier = createToken({ name: "Identifier", label: "identifier", pattern: /[a-zA-Z][\w\-\.]*/ })
    static readonly String = createToken({ name: "String", label: "string", pattern: /"(:?[^\\"]|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/ })
    static readonly Comma = createToken({ name: "Comma", label: ",", pattern: /,/ })
    static readonly Colon = createToken({ name: "Colon", label: ":", pattern: /:/ })
    static readonly Number = createToken({ name: "Number", label: "number", pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/ })
    static readonly Boolean = createToken({ name: "Boolean", label: "boolean", pattern: /true|false/ })
    static readonly GreaterThan = createToken({ name: "GreaterThan", label: ">", pattern: />/ })
    static readonly GreaterThanEqual = createToken({ name: "GreaterThanEqual", label: ">=", pattern: />=/ })
    static readonly Equal = createToken({ name: "Equal", label: "=", pattern: /=/ })
    static readonly Not = createToken({ name: "Not", label: "not", pattern: /Not/i })
    static readonly NotEqual = createToken({ name: "NotEqual", label: "<>", pattern: /<>/ })
    static readonly LessThan = createToken({ name: "LessThan", label: "<", pattern: /</ })
    static readonly LessThanEqual = createToken({ name: "LessThanEqual", label: "<=", pattern: /<=/ })
    static readonly LeftParenthesis = createToken({ name: "LeftParenthesis", label: "(", pattern: /\(/ })
    static readonly RightParenthesis = createToken({ name: "RightParenthesis", label: ")", pattern: /\)/ })
    static readonly LeftCurlyParenthesis = createToken({ name: "LeftCurlyParenthesis", label: "{", pattern: /\{/ })
    static readonly RightCurlyParenthesis = createToken({ name: "RightCurlyParenthesis", label: "}", pattern: /\}/ })
    static readonly LeftSquareBracket = createToken({ name: "LeftSquareBracket", label: "[", pattern: /\[/ })
    static readonly RightSquareBracket = createToken({ name: "RightSquareBracket", label: "]", pattern: /\]/ })
    static readonly Null = createToken({ name: "Null", label: "null", pattern: /null/ })
    static readonly And = createToken({ name: "And", label: "and", pattern: /and\s+/i })
    static readonly Or = createToken({ name: "Or", label: "or", pattern: /or\s+/i })
    static readonly In = createToken({ name: "In", label: "in", pattern: /in\s+/i })
    static readonly On = createToken({ name: "On", label: "on", pattern: /on\s+/i })
    static readonly Add = createToken({ name: "Add", label: "add", pattern: /Add\s+/i })
    static readonly Remove = createToken({ name: "Remove", label: "remove", pattern: /Remove\s+/i })
    static readonly Set = createToken({ name: "Set", label: "set", pattern: /Set\s+/i })
    static readonly Between = createToken({ name: "Between", label: "between", pattern: /Between/i })
    static readonly WhiteSpace = createToken({name: "WhiteSpace", label: "a white space", pattern: /\s+/, group: Lexer.SKIPPED})
    static readonly AttributeExists = createToken({name: "AttributeExists", label: "attribute_exists", pattern: /attribute_exists\s*\(/})
    static readonly AttributeNotExists = createToken({name: "AttributeNotExists", label: "attribute_not_exists", pattern: /attribute_not_exists\s*\(/})
    static readonly AttributeType = createToken({name: "AttributeType", label: "attribute_type", pattern: /attribute_type\s*\(/})
    static readonly BeginsWith = createToken({name: "BeginsWith", label: "begins_with", pattern: /begins_with\s*\(/})
    static readonly Contains = createToken({name: "BeginsWith", label: "begins_with", pattern: /contains\s*\(/})
    static readonly Size = createToken({name: "Size", label: "size", pattern: /size\s*\(/})

    // note we are placing WhiteSpace first as it is very common thus it will speed up the lexer.
    static AllTokens = 
    [
        // "keywords" appear before the Identifier
        Token.Get,
        Token.From,
        Token.StronglyConsistent,
        Token.CreateTable,
        Token.For,
        Token.WithCapacityOf,
        Token.Explain,
        Token.DeleteTable,
        Token.Delete,
        Token.Where,
        Token.Size,
        Token.Find,
        Token.Filter,
        Token.Order,
        Token.Using,
        Token.Resume,
        Token.On,
        Token.Add,
        Token.Remove,
        Token.Set,
        Token.As,
        Token.Describe,
        Token.Asc,
        Token.Desc,
        Token.Star,
        Token.By,
        Token.Limit,
        Token.UnloadTable,
        Token.ShowTables,
        Token.List,
        Token.Comma,
        Token.Colon,
        Token.Null,
        Token.LeftSquareBracket,
        Token.RightSquareBracket,
        Token.Insert,
        Token.Into,
        Token.Import,
        Token.String,
        Token.Update,
        Token.WithVersionCheck,
        Token.And,
        Token.Or,
        Token.In,
        Token.Boolean,
        Token.Not,
        Token.Between,
        Token.AttributeExists,
        Token.AttributeNotExists,
        Token.AttributeType,
        Token.BeginsWith,
        Token.Contains,
        Token.WhiteSpace,
        // The Identifier must appear after the keywords because all keywords are valid identifiers.
        Token.Identifier,
        Token.Number,
        Token.GreaterThanEqual,
        Token.GreaterThan,
        Token.Equal,
        Token.LessThanEqual,
        Token.NotEqual,
        Token.LessThan,
        Token.LeftParenthesis,
        Token.RightParenthesis,
        Token.LeftCurlyParenthesis,
        Token.RightCurlyParenthesis
    ]
}