# Graph API Client
JS Library created to simplify using of GraphQL by using a defined structure for queries and mutations, instead of passing raw strings to the API handler

Just create an instance of the `GraphAPIClient` object and it will take care of the rest

```
class GraphAPIClient {
    constructor(axiosRequestConfig){
        // will create its own instance of Axios client
        this.axios = new axios(axiosRequestConfig);
    }
}
```

then just call the `.query` or the `.mutation` methods to enjoy magic things
requests are similar, they params are sightly different instead

The main class `GraphQLRequest` is being extended by `GraphQLQueryRequest` and `GraphQLMutationRequest`, and is being utilized to generate GraphQL query string,
used by the `GraphAPIClient` with its methods `.query` and `.mutate`

### Query Request

The `GraphQLQueryRequest` class requires the following parameters:
- queryName (String), which represents the query name inside GraphQL
- queryParameters (`[{name: String, type: String}]`), which represents parameters to be passed to GraphQL.  
They'll be added inside query header and fragment
- queryFields (`[String | {String: [String]]`), represents the list of fields to be retrieved from query. 
Can be a list of strings or `{[property]: [nested fields]}`, as nested fields will be automatically nested inside query string
- queryValues: List of values to be passed (identified by parameters)

Examples:

##### Simple query with no parameters or nested fields  
To obtain this query string: `query{test{id name}}`
Those should be the provided parameters
```javascript
const queryName = 'test';
const queryParams = [];
const queryFields = ['id', 'name'];

const generatedQuery = new GraphQLQueryRequest(queryName, queryParams, queryFields).generate();
// generatedQuery = query{test{id name}}
```

##### Query with parameters
To obtain this query string: `query($id:String){test(id:$id){name}}`
Those should be the provided parameters
```javascript
const queryName = 'test';
const queryParams = [{
  name: 'id',
  type: 'String'
}];
const queryFields = ['name'];

const generatedQuery = new GraphQLQueryRequest(queryName, queryParams, queryFields).generate();
// generatedQuery = query($id:String){test(id:$id){name}}
```

##### Query with nested fields
To obtain this query string `query{test{foo{bar baz}}}`
Those should be the provided parameters
```javascript
const queryName = 'test';
const queryParams = [];
const queryFields = [{foo: ['bar', 'baz']}];

const generatedQuery = new GraphQLQueryRequest(queryName, queryParams, queryFields).generate();
// generatedQuery = query{test{foo{bar baz}}}
```

##### Query with mixed fields
To obtain this query string `query{test{id name foo{id name bar{baz nolgo{id}}}}}`
Those should be the provided parameters
```javascript
const queryName = 'test';
const queryParams = [];
const queryFields = [
  'id', 'name', {
    foo: [
      'id', 'name', {
        bar: [
          'baz', {
            nolgo: [
              'id'
            ]
          }
        ]
      }
    ]
  }
];

const generatedQuery = new GraphQLQueryRequest(queryName, queryParams, queryFields).generate();
// generatedQuery = query{test{id name foo{id name bar{baz nolgo{id}}}}}
```


### Mutations
