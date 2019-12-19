const axios = require('axios');
const graphQLQueryRequest = require('./graphql-query');

class GraphAPIClient {
  constructor(axiosRequestConfig) {
    this.axios = axios.create(axiosRequestConfig)
  }

  query(queryName, queryParams, queryFields) {
    const queryRequest = new graphQLQueryRequest(queryName, queryParams, queryFields);
    return queryRequest.generate();
  }
}
