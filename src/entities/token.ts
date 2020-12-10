import {createToken, Lexer} from 'chevrotain'

export class Token
{
    static readonly Get = createToken({ name: "Get", pattern: /GET\s+/i })
    static readonly From = createToken({ name: "From", pattern: /From/i })
    static readonly StronglyConsistent = createToken({ name: "StronglyConsistent", pattern: /Strongly\s+Consistent/i })
    static readonly CreateTable = createToken({ name: "CreateTable", pattern: /Create\s+Table/i })
    static readonly For = createToken({ name: "For", pattern: /For/i })
    static readonly WithCapacityOf = createToken({ name: "WithCapacityOf", pattern: /With\s+Capacity\s+Of/i })
    static readonly DeleteTable = createToken({ name: "DeleteTable", pattern: /Delete\s+Table/i })
    static readonly Delete = createToken({ name: "Delete", pattern: /Delete\s+/i,})
    static readonly Where = createToken({ name: "Where", pattern: /Where/i })
    static readonly Find = createToken({ name: "Find", pattern: /Find/i })
    static readonly Import = createToken({ name: "Import", pattern: /Import/i })
    static readonly Insert = createToken({ name: "Insert", pattern: /Insert\s+/i })
    static readonly Into = createToken({ name: "Into", pattern: /Into\s+/i })
    static readonly ShowTables = createToken({ name: "ShowTables", pattern:/Show\s+Tables\s+/i })
    static readonly RemoveTable = createToken({ name: "RemoveTable", pattern:/Remove\s+Table\s+/i })
    static readonly List = createToken({ name: "List", pattern: /List\s+/i })
    static readonly Using = createToken({ name: "Using", pattern: /Using/i })
    static readonly Filter = createToken({ name: "Filter", pattern: /Filter/i })
    static readonly Resume = createToken({ name: "Resume", pattern: /Resume/i })
    static readonly Order = createToken({ name: "Order", pattern: /Order/i })
    static readonly Limit = createToken({ name: "Limit", pattern: /Limit/i })
    static readonly By = createToken({ name: "By", pattern: /By\s+/i })
    static readonly As = createToken({ name: "As", pattern: /As\s+/i })
    static readonly Asc = createToken({ name: "Asc", pattern: /\sAsc\W+/i })
    static readonly Desc = createToken({ name: "Desc", pattern:/\sDesc\W+/i })
    static readonly Star = createToken({ name: "Star", pattern: /\*/ })

    static readonly Identifier = createToken({ name: "Identifier", pattern: /[a-zA-Z][\w\-\.]*/ })
    static readonly String = createToken({ name: "String", pattern: /"(:?[^\\"]|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/ })
    static readonly Comma = createToken({ name: "Comma", pattern: /,/ })
    static readonly Colon = createToken({ name: "Colon", pattern: /:/ })
    static readonly Number = createToken({ name: "Number", pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/ })
    static readonly Boolean = createToken({ name: "Boolean", pattern: /true|false/ })
    static readonly GreaterThan = createToken({ name: "GreaterThan", pattern: />/ })
    static readonly GreaterThanEqual = createToken({ name: "GreaterThanEqual", pattern: />=/ })
    static readonly Equal = createToken({ name: "Equal", pattern: /=/ })
    static readonly Not = createToken({ name: "Not", pattern: /Not/i })
    static readonly NotEqual = createToken({ name: "NotEqual", pattern: /<>/ })
    static readonly LessThan = createToken({ name: "LessThan", pattern: /</ })
    static readonly LessThanEqual = createToken({ name: "LessThanEqual", pattern: /<=/ })
    static readonly LeftParenthesis = createToken({ name: "LeftParenthesis", pattern: /\(/ })
    static readonly RightParenthesis = createToken({ name: "RightParenthesis", pattern: /\)/ })
    static readonly LeftCurlyParenthesis = createToken({ name: "LeftCurlyParenthesis", pattern: /\{/ })
    static readonly RightCurlyParenthesis = createToken({ name: "RightCurlyParenthesis", pattern: /\}/ })
    static readonly LeftSquareBracket = createToken({ name: "LeftSquareBracket", pattern: /\[/ })
    static readonly RightSquareBracket = createToken({ name: "RightSquareBracket", pattern: /\]/ })
    static readonly Null = createToken({ name: "Null", pattern: /null/ })
    static readonly And = createToken({ name: "And", pattern: /and\s+/i })
    static readonly Or = createToken({ name: "Or", pattern: /or\s+/i })
    static readonly In = createToken({ name: "In", pattern: /in\s+/i })
    static readonly Between = createToken({ name: "Between", pattern: /Between/i })
    static readonly WhiteSpace = createToken({name: "WhiteSpace", pattern: /\s+/, group: Lexer.SKIPPED})
    static readonly AttributeExists = createToken({name: "AttributeExists", pattern: /attribute_exists\s*\(/})
    static readonly AttributeNotExists = createToken({name: "AttributeNotExists", pattern: /attribute_not_exists\s*\(/})
    static readonly AttributeType = createToken({name: "AttributeType", pattern: /attribute_type\s*\(/})
    static readonly BeginsWith = createToken({name: "BeginsWith", pattern: /begins_with\s*\(/})
    static readonly Contains = createToken({name: "BeginsWith", pattern: /contains\s*\(/})
    static readonly Size = createToken({name: "Size", pattern: /size\s*\(/})

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
        Token.DeleteTable,
        Token.Delete,
        Token.Where,
        Token.Size,
        Token.Find,
        Token.Filter,
        Token.Order,
        Token.Using,
        Token.Resume,
        Token.As,
        Token.Asc,
        Token.Desc,
        Token.Star,
        Token.By,
        Token.Limit,
        Token.RemoveTable,
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