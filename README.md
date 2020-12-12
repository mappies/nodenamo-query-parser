# nodenamo-query-parser

[Nodenamo Query Language](#nql) Parser

## Usage

### Example
```typescript
import {parse} from 'nodenamo-query-parser'

let statement = parse('FIND * FROM users WHERE department = "IT" FILTER enabled = true ORDER ASC LIMIT 10')

console.log(statement) 

```

### Output
```javascript
{
  type: 'find',
  projections: undefined,
  from: 'users',
  using: undefined,
  where: {
    expressionAttributeNames: { '#department': 'department' },
    expressionAttributeValues: { ':department': 'IT' },
    keyConditions: '#department = :department'
  },
  filter: {
    expressionAttributeNames: { '#enabled': 'enabled' },
    expressionAttributeValues: { ':enabled': true },
    filterExpression: '#enabled = :enabled'
  },
  resume: undefined,
  order: 1,
  limit: 10,
  stronglyConsistent: undefined
}
```

<a name='nql'/>

## Nodenamo Query Language

<a name="insert"/>

### INSERT Statement


#### Syntax

**INSERT** _[jsonObject](https://www.json.org/json-en.html)_ **INTO** _[table](#import)_ **WHERE** _[expression](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html#DDB-PutItem-request-ConditionExpression)_ 

 
### Example

```
INSERT {id:2,title:"some thing",price:21,status:true} INTO books WHERE attribute_not_exists(id)
```

### Output

```javascript
{
  type: 'insert',
  object: { id: 2, title: 'some thing', price: 21, status: true },
  into: 'books',
  where: {
    expressionAttributeNames: { '#id': 'id' },
    expressionAttributeValues: {},
    conditionExpression: 'attribute_not_exists(#id)'
  }
}
```
