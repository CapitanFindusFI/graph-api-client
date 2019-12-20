const GraphQLRequest = require('../graphql-request');

class GraphQLMutationRequest extends GraphQLRequest {
  constructor(mutationName, mutationParameters, queryFields = []) {
    if (!Array.isArray(mutationParameters))
      throw new Error('Mutation must provide parameters');

    return super(mutationName, mutationParameters, queryFields);
  }

  generateHeader() {
    let queryString = 'mutation';
    if (this.requestParams.length) {
      const headerParams = this.requestParams.map(this.generateHeaderField.bind(this));
      queryString += `(${headerParams})`
    }

    queryString += '{';
    return queryString;
  }

  generateFragment() {
    let fragmentField = this.requestName;
    if (this.requestParams.length) {
      const fragmentParams = this.requestParams.map(this.generateFragmentField.bind(this));
      fragmentField += `(${fragmentParams})`;
    }

    fragmentField += '{';

    return fragmentField;
  }

  generateBody() {
    return this.resultFields.map(this.generateQueryField.bind(this)).join(' ');
  }

}
