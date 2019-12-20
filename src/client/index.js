const axios = require('axios');
const GraphQLQueryRequest = require('./graphql-request/query');
const GraphQLMutationRequest = require('./graphql-request/mutation');

class GraphAPIClient {
  constructor(axiosRequestConfig) {
    this.axios = axios.create(axiosRequestConfig)
  }

  get(path, params = {}, headers = {}) {
    return this.axios.get(path, {
      ...params,
      ...headers
    })
  }

  post(path, body, params = {}, headers = {}) {
    return this.axios.post(path, body, {
      ...params,
      ...headers
    })
  }

  query(queryName, queryParams, queryFields) {
    const queryRequest = new GraphQLQueryRequest(queryName, queryParams, queryFields);
    return queryRequest.generate();
  }

  mutate(mutationName, mutationParams, queryFields, mutationValues) {
    const mutationRequest = new GraphQLMutationRequest(mutationName, mutationParams, queryFields, mutationValues);
    return mutationRequest.generate();
  }
}
