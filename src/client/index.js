const axios = require('axios');
const GraphQLQueryRequest = require('./graphql-request/query');
const GraphQLMutationRequest = require('./graphql-request/mutation');

class GraphAPIClient {
  constructor(axiosRequestConfig) {
    this.axios = axios.create(axiosRequestConfig)
  }

  query(queryName, queryParams, queryFields) {
    const queryRequest = new GraphQLQueryRequest(queryName, queryParams, queryFields);
    return queryRequest.generate();
  }

  mutate(mutationName, mutationParams, queryFields) {
    const mutationRequest = new GraphQLMutationRequest(mutationName, mutationParams, queryFields);
    return mutationRequest.generate();
  }
}
