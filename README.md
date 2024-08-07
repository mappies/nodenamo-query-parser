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
  order: true,
  limit: 10,
  stronglyConsistent: undefined
}
```

<a name='nql'/>

## Nodenamo Query Language



## Table of Content

* [IMPORT](#import)
* [INSERT](#insert)
* [GET](#get)
* [LIST](#list)
* [FIND](#find)
* [UPDATE](#update)
* [ON](#on)
* [DELETE](#delete)
* [UNLOAD TABLE](#unloadTable)
* [CREATE TABLE](#createTable)
* [DELETE TABLE](#deleteTable)
* [SHOW TABLES](#showTables)
* [EXPLAIN](#explain)
* [DESCRIBE](#describe)


<a name='import'/>

### IMPORT statement

#### Syntax

**IMPORT** _class_ **FROM** _"path"_
**IMPORT** _class_ **AS** alias **FROM** _"path"_
**IMPORT** _{class}_ **FROM** _"path"_
**IMPORT** _{class as alias}_ **FROM** _"path"_

where:
* `class` is the exported class decorated with [nodenamo](https://github.com/mappies/nodenamo)'s `@DBTable`
* `alias` is an alias to be referenced to the imported class from subsequent statements.
* `path` is the path to the file or a package containing the `class` to import.
 
 
### Example

```
IMPORT usersTable as users FROM "./usersTable.ts"
```

### Output

```javascript
{
  type: 'import',
  entity: [ { name: 'usersTable', as: 'users', default: true } ],
  from: './usersTable.ts'
}
```

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

**LIST** _projections_ **FROM** _[table](#import)_ **USING** _indexName_ **BY** _hashRange_ **FILTER** _[filterExpressions](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html#DDB-Query-request-FilterExpression)_ **RESUME** "lastEvaluatedKey" **ORDER** _order_ **LIMIT** _number_ **STRONGLY CONSISTENT**
 
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
  order: true,
  limit: 10,
  stronglyConsistent: true
}
```

<a name="find"/>

### FIND Statement

#### Syntax

**FIND** _projections_ **FROM** _[table](#import)_ **USING** _indexName_ **WHERE** _[keyConditions](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html#DDB-Query-request-KeyConditions)_ **FILTER** _[filterExpressions](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html#DDB-Query-request-FilterExpression)_ **RESUME** "lastEvaluatedKey" **ORDER** _order_ **LIMIT** _number_ **STRONGLY CONSISTENT**
 
where:
* `projections` is a list of properties to return.  Use `*` to return all properties.
* `indexName` is the name of a GSI.
* `order` is `ASC` or `DESC`
* `strongly consistent` can be used to request a consistent read.

### Example

```
FIND id, name, email FROM users USING users-gsi WHERE name = "some one" FILTER email = "someone@example.com" resume "token" ORDER desc LIMIT 2 STRONGLY CONSISTENT
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
  order: false,
  limit: 2,
  stronglyConsistent: true
}
```




<a name="update"/>

### UPDATE Statement


#### Syntax

**UPDATE** _[jsonObject](https://www.json.org/json-en.html)_ **FROM** _[table](#import)_ **WHERE** _[conditionExpression](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html#DDB-DeleteItem-request-ConditionExpression)_ **RETURNING** _returnValue_ **WITH VERSION CHECK**

where:
* `WITH VERSION CHECK` can be used to request a version check.
* `returnValue` is `NONE`, `ALLNEW`, or `ALLOLD`

### Example

```
UPDATE {id:1,name:"new name"} FROM users WHERE attribute_not_exists(id) RETURNING ALLOLD WITH VERSION CHECK
```

### Output

```javascript
{
  type: 'update',
  object: { id: 1, name: 'new name' },
  from: 'users',
  where: {
    expressionAttributeNames: { '#id': 'id' },
    expressionAttributeValues: {},
    conditionExpression: 'attribute_not_exists(#id)'
  },
  versionCheck: true,
  returning: AllNew
}
```


<a name="on"/>

### ON Statement


#### Syntax

**ON** _id_ **FROM** _[table](#import)_ **SET**_[setExpression](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html#Expressions.UpdateExpressions.SET)_ **ADD** _[addExpression](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html#Expressions.UpdateExpressions.ADD)_ **DELETE** _[deleteExpression](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html#Expressions.UpdateExpressions.DELETE)_ **REMOVE** _[removeExpression](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html#Expressions.UpdateExpressions.REMOVE)_ _[conditionExpression](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html#DDB-UpdateItem-request-ConditionExpression)_ **RETURNING** _returnValue_ **WITH VERSION CHECK**

where:
* `WITH VERSION CHECK` can be used to request a version check.
* `returnValue` is `NONE`, `ALLNEW`, or `ALLOLD`

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



<a name="unloadTable"/>

### UNLOAD TABLE Statement


#### Syntax

**UNLOAD TABLE** _name_ 

where:
* `name` is the imported class name or its alias.

### Example

```
UNLOAD TABLE users
```

### Output

```javascript
{ 
  type: 'unload_table', 
  name: 'users' 
}
```



<a name="createTable"/>

### CREATE TABLE Statement


#### Syntax

**CREATE TABLE FOR** _name_ **WITH CAPACITY OF** readCapacityNumber, writeCapacityNumber

where:
* `name` is the imported class name or its alias.
* `readCapacityNumber` is the desired read capacity for the table.
* `writeCapacityNumber` is the desired write capacity for the table.

### Example

```
CREATE TABLE FOR users WITH CAPACITY OF 123, 456
```

### Output

```javascript
{
  type: 'create_table',
  for: 'users',
  withCapacityOf: { readCapacity: 123, writeCapacity: 456 }
}
```


<a name="deleteTable"/>

### DELETE TABLE Statement


#### Syntax

**DELETE TABLE FOR** _name_

where:
* `name` is the imported class name or its alias.

### Example

```
DELETE TABLE FOR users
```

### Output

```javascript
{
  type: 'delete_table',
  for: 'users'
}
```




<a name="showTables"/>

### SHOW TABLES Statement


#### Syntax

**SHOW TABLES**

### Example

```
SHOW TABLES
```

### Output

```javascript
{
  type: 'show_tables',
}
```




<a name="explain"/>

### EXPLAIN Statement


#### Syntax

**Explain** statement

where:
* `statement` is one of nodenamo query language stattements.

### Example

```
EXPLAIN INSERT {id:1,name:"some one"} INTO users
```

### Output

```javascript
{
  type: 'explain',
  statement: {
    type: 'insert',
    object: { id: 1, name: 'some one' },
    into: 'users',
    where: undefined
  }
}
```



<a name="describe"/>

### DESCRIBE Statement


#### Syntax

**Describe** _name_

where:
* `name` is the imported class name or its alias.

### Example

```
DESCRIBE users
```

### Output

```javascript
{
  type: 'describe',
  name: 'users'
}
```