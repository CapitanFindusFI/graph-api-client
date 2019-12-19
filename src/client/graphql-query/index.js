class GraphQLQueryRequest {
  constructor(queryName, queryParameters = [], queryFields = []) {
    this.queryName = queryName;
    this.queryParameters = queryParameters;
    this.queryFields = queryFields;

    return this;
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
    if (this.queryParameters.length) {
      const headerParams = this.queryParameters.map(this.generateHeaderField.bind(this));
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
    let fragmentField = this.queryName;
    if (this.queryParameters.length) {
      const fragmentParams = this.queryParameters.map(this.generateFragmentField.bind(this));
      fragmentField += `(${fragmentParams})`;
    }

    fragmentField += '{';

    return fragmentField;
  }

  generateQueryField(queryField) {
    if (queryField === Object(queryField)) {
      const fieldKeys = Object.keys(queryField);
      if (fieldKeys.length > 1)
        throw new Error('Query field object must have a single key');

      return this.generateQueryField(queryField[fieldKeys[0]]);
    } else {
      return queryField.toString()
    }
  }

  generateQueryFields() {
    return this.queryFields.map(this.generateQueryField.bind(this)).join(' ');
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
