const GraphQLRequest = require('../graphql-request');

class GraphQLQueryRequest extends GraphQLRequest {
  constructor(queryName, queryParameters = [], queryFields) {
    return super(queryName, queryParameters, queryFields);
  }

  getParamQueryName(graphQLParam) {
    if (!graphQLParam['name'])
      throw new Error('GraphQL param is missing its name');

    let paramName;
    if (graphQLParam['alias']) {
      const paramString = graphQLParam['alias'].split('$');
      paramName = paramString[paramString.length - 1];
    } else {
      paramName = `${graphQLParam['name']}`
    }

    return paramName
  }

  generateHeaderField(headerParam) {
    const fieldName = `$${this.getParamQueryName(headerParam)}`;

    if (!headerParam['type'])
      throw new Error(`Header param: ${headerParam['name']} is missing its type`);

    const fieldType = headerParam['isArray'] ? `[${headerParam['type']}]` : headerParam['type'];

    return [fieldName, fieldType].join(':')
  }

  generateQueryHeader() {
    let queryString = 'query';
    if (this.requestParams.length) {
      const headerParams = this.requestParams.map(this.generateHeaderField.bind(this));
      queryString += `(${headerParams})`
    }

    queryString += '{';
    return queryString;
  }

  generateFragmentField(fragmentField) {
    const fieldName = this.getParamQueryName(fragmentField);

    return [fieldName, `$${fieldName}`].join(':');
  }

  generateQueryFragment() {
    let fragmentField = this.requestName;
    if (this.requestParams.length) {
      const fragmentParams = this.requestParams.map(this.generateFragmentField.bind(this));
      fragmentField += `(${fragmentParams})`;
    }

    fragmentField += '{';

    return fragmentField;
  }

  generate() {
    const header = this.generateQueryHeader();
    const fragment = this.generateQueryFragment();
    const fields = this.generateQueryFields();
    return [
      header,
      fragment,
      fields,
      '}',
      '}'
    ].join('');
  }
}


module.exports = GraphQLQueryRequest;
