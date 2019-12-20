const GraphQLRequest = require('../graphql-request');

class GraphQLQueryRequest extends GraphQLRequest {
  constructor(queryName, queryParameters = [], queryFields) {
    return super(queryName, queryParameters, queryFields);
  }

  generateHeader() {
    let queryString = 'query';
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


module.exports = GraphQLQueryRequest;
