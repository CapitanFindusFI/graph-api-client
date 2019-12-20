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

  collectRequestBody(query, variables) {
    return {
      query, variables
    }
  }

  query(queryName, queryParams, queryFields, queryValues, path = '/graphql') {
    const graphQLPayload = new GraphQLQueryRequest(queryName, queryParams, queryFields, queryValues).generate();
    const requestBody = this.collectRequestBody(graphQLPayload, queryValues);

    return this.post(path, requestBody);
  }

  mutate(mutationName, mutationParams, queryFields, mutationValues, path = '/graphql') {
    const graphQLPayload = new GraphQLMutationRequest(mutationName, mutationParams, queryFields, mutationValues).generate();
    const requestBody = this.collectRequestBody(graphQLPayload, mutationValues);

    return this.post(path, requestBody);
  }
}
