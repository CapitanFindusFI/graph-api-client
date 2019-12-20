const axios = require('axios');
const GraphQLQueryRequest = require('./graphql-request/query');

class GraphAPIClient {
  constructor(axiosRequestConfig) {
    this.axios = axios.create(axiosRequestConfig)
  }

  query(queryName, queryParams, queryFields) {
    const queryRequest = new GraphQLQueryRequest(queryName, queryParams, queryFields);
    return queryRequest.generate();
  }
}
