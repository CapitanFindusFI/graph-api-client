const GraphQLRequest = require('../graphql-request');

class GraphQLMutationRequest extends GraphQLRequest {
  constructor(mutationName, mutationParameters, queryFields = []) {
    if(!Array.isArray(mutationParameters))
      throw new Error('Mutation must provide parameters');

    return super(mutationName, mutationParameters, queryFields);
  }

}
