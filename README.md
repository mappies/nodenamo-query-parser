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



## Table of Content

* [INSERT](#insert)
* [GET](#get)
* [LIST](#list)
* [FIND](#find)
* [UPDATE](#update)
* [ON](#on)
* [DELETE](#delete)
* [IMPORT](#import)
* [UNLOAD](#unload)
* [CREATE TABLE](#createTable)
* [DELETE TABLE](#deleteTable)
* [SHOW TABLES](#showTables)
* [EXPLAIN](#explain)

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


<a name="get"/>

### GET Statement


#### Syntax

**GET** _id_ **FROM** _[table](#import)_ **STRONGLY CONSISTENT**

### Example

```
GET 42 FROM users STRONGLY CONSISTENT
```

### Output

```javascript
{
  type: 'get', 
  id: 42, 
  from: 'users', 
  stronglyConsistent: true
}
```

<a name="list"/>

### LIST Statement

#### Syntax

**LIST** _projections_ **FROM** _[table](#import)_ **USING** _indexName_ **BY** _hashRange_ **FILTER** _[filterExpressions](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html#DDB-Query-request-FilterExpression)_ **RESUME** lastEvaluatedKey **ORDER** _order_ **LIMIT** _number_ **STRONGLY CONSISTENT**
 
where:
* `projections` is a list of properties to return.  Use `*` to return all properties.
* `indexName` is the name of a GSI.
* `hashRange` is a value to search against a hash property. It can be optionally followed by a comma and a value to search against a range property.
* `order` is `ASC` or `DESC`
* `strongly consistent` can be used to request a consistent read.

### Example

```
LIST * FROM users BY "name" , "timestamp" FILTER email = "someone@example.com" ORDER asc LIMIT 10 STRONGLY CONSISTENT
```

### Output

```javascript
{
  type: 'list',
  projections: undefined,
  from: 'users',
  using: undefined,
  by: { hash: 'name', range: 'timestamp' },
  filter: {
    expressionAttributeNames: { '#email': 'email' },
    expressionAttributeValues: { ':email': 'someone@example.com' },
    filterExpression: '#email = :email'
  },
  resume: undefined,
  order: 1,
  limit: 10,
  stronglyConsistent: true
}
```

<a name="find"/>

### FIND Statement

#### Syntax

**FIND** _projections_ **FROM** _[table](#import)_ **USING** _indexName_ **WHERE** _[keyConditions](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html#DDB-Query-request-KeyConditions)_ **FILTER** _[filterExpressions](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html#DDB-Query-request-FilterExpression)_ **RESUME** lastEvaluatedKey **ORDER** _order_ **LIMIT** _number_ **STRONGLY CONSISTENT**
 
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


<a name="on"/>

### ON Statement


#### Syntax

**ON** _id_ **FROM** _[table](#import)_ **SET**_[setExpression](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html#Expressions.UpdateExpressions.SET)_ **ADD** _[addExpression](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html#Expressions.UpdateExpressions.ADD)_ **DELETE** _[deleteExpression](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html#Expressions.UpdateExpressions.DELETE)_ **REMOVE** _[removeExpression](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html#Expressions.UpdateExpressions.REMOVE)_ _[conditionExpression](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html#DDB-UpdateItem-request-ConditionExpression)_ **WITH VERSION CHECK**

where:
* `WITH VERSION CHECK` can be used to request a version check.

### Example

```
ON 42 FROM users SET lastViewed = "today" ADD count 1 WHERE published = true WITH VERSION CHECK
```

### Output

```javascript
{
  type: 'on',
  id: 42,
  from: 'users',
  set: {
    setExpressions: [ '#lastViewed___1 = :lastViewed___1' ],
    expressionAttributeNames: { '#lastViewed___1': 'lastViewed' },
    expressionAttributeValues: { ':lastViewed___1': 'today' }
  },
  add: {
    addExpressions: [ '#count___2 :count___2' ],
    expressionAttributeNames: { '#count___2': 'count' },
    expressionAttributeValues: { ':count___2': 1 }
  },
  remove: undefined,
  delete: undefined,
  where: {
    expressionAttributeNames: { '#published': 'published' },
    expressionAttributeValues: { ':published': true },
    conditionExpression: '#published = :published'
  },
  versionCheck: true
}
```


<a name="delete"/>

### DELETE Statement


#### Syntax

**DELETE** _id_ **FROM** _[table](#import)_ **WHERE** _[conditionExpression](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html#DDB-DeleteItem-request-ConditionExpression)_

### Example

```
DELETE 42 FROM books WHERE deleted <> true
```

### Output

```javascript
{
  type: 'delete',
  id: 42,
  from: 'books',
  where: {
    expression: '#deleted <> :deleted',
    expressionAttributeNames: { '#deleted': 'deleted' },
    expressionAttributeValues: { ':deleted': true }
  }
}
```

<a name='import'/>

### IMPORT statement
