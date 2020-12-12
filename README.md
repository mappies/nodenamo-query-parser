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


### FIND Statement

#### Syntax

**FIND** _projections_ **FROM** _[table](#import)_ **USING** _indexName_ **WHERE** _[keyConditions](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html#DDB-Query-request-KeyConditions)_ **FILTER** _[filterExpressions](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html#DDB-Query-request-FilterExpression)_ **RESUME** lastEvaluatedKey **ORDER** _order_ **LIMIT** _number_ **STRONGLY CONSISTENT*
 
where:
* `projections` is a list of properties to return.  Use `*` to return all properties.
* `indexName` is the name of a GSI.
* `order` is `ASC` or `DESC`
* `strongly consistent` can be used to request a consistent read.

### Example

```
FIND id, name, email FROM users USING users-gsi WHERE name = "some one" FILTER email = "someone@example.com" RESUME token ORDER desc LIMIT 2 STRONGLY CONSISTENT
```

### Output

```javascript
{
  type: 'find',
  projections: [ 'id', 'name', 'email' ],
  from: 'users',
  using: 'users-gsi',
  where: {
    expressionAttributeNames: { '#name': 'name' },
    expressionAttributeValues: { ':name': 'some one' },
    keyConditions: '#name = :name'
  },
  filter: {
    expressionAttributeNames: { '#email': 'email' },
    expressionAttributeValues: { ':email': 'someone@example.com' },
    filterExpression: '#email = :email'
  },
  resume: 'token',
  order: -1,
  limit: 2,
  stronglyConsistent: true
}
```
