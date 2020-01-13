const helper = require('../../helper');

class GraphQLRequest {
  constructor(requestName, requestParams, resultFields, requestValues) {
    if (!Array.isArray(resultFields))
      throw new Error('Result fields must be an array');

    this.requestName = requestName;
    this.requestParams = requestParams;
    this.resultFields = resultFields;
    this.requestValues = requestValues;

    return this;
  }

  areValuesValid() {
    if (!this.requestValues) {
      return true
    }

    const valuesKeys = Object.keys(this.requestValues);
    const mutationFields = this.requestParams.map(this.getParamQueryName.bind(this));

    const wrongValues = mutationFields.filter(key => valuesKeys.indexOf(key.toString()) === -1);
    if (wrongValues.length > 0)
      throw new Error(`GraphQL Request is missing following fields: ${wrongValues.join(',')}, double check your aliases if present`);

    return true;
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

  generateFragmentField(fragmentField) {
    const fieldName = this.getParamQueryName(fragmentField);

    return [fieldName, `$${fieldName}`].join(':');
  }

  generateQueryField(queryField) {
    if (helper.isObject(queryField)) {
      const objectKeys = Object.keys(queryField);
      if (objectKeys.length > 1)
        throw new Error('Query field object must have a single key');

      const objectName = objectKeys[0];
      const objectValues = queryField[objectName];
      const nestedValues = objectValues.map(this.generateQueryField.bind(this)).join(' ');

      return `${objectName}{${nestedValues}}`
    } else {
      return queryField.toString()
    }
  }

  generateHeader() {
    throw new Error('Must be implemented in extending classes');
  }

  generateFragment() {
    throw new Error('Must be implemented in extending classes');
  }

  generateBody() {
    throw new Error('Must be implemented in extending classes');
  }

  generate() {
    if (!this.areValuesValid())
      throw new Error('Passed values does not conform with query');

    return [
      this.generateHeader(),
      this.generateFragment(),
      this.generateBody(),
      '}}'
    ].join('');
  }
}

module.exports = GraphQLRequest;
