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

#### Queries


#### Mutations
