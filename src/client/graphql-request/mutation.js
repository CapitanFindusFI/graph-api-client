const helper = require('../../helper');
const GraphQLRequest = require('../graphql-request');

class GraphQLMutationRequest extends GraphQLRequest {
  constructor(mutationName, mutationParameters, queryFields = [], mutationValues) {
    if (!Array.isArray(mutationParameters))
      throw new Error('Mutation must provide parameters');

    if (!helper.isObject(mutationValues))
      throw new Error('Mutation values must be a map of field/value');

    return super(mutationName, mutationParameters, queryFields, mutationValues);
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

  generate() {
    if (!this.areMutationValuesValid())
      throw new Error('Mutation values does not conform to query signature');

    return super.generate();
  }

  areMutationValuesValid() {
    const valuesKeys = Object.keys(this.requestValues);
    const mutationFields = this.requestParams.map(this.getParamQueryName.bind(this));

    const wrongValues = mutationFields.filter(key => valuesKeys.indexOf(key.toString()) === -1);
    if (wrongValues.length > 0)
      throw new Error(`Mutation is missing following fields: ${wrongValues.join(',')}, double check your aliases if present`);

    return true;
  }

}

module.exports = GraphQLMutationRequest;
