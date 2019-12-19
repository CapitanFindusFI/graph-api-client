class GraphQLQueryRequest {
  constructor(queryName, queryParameters, queryFields) {
    this.queryName = queryName;
    this.queryParameters = queryParameters;
    this.queryFields = queryFields;

    return this;
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

  generateHeaderField(headerField){
    if (!headerField['field']) {
      throw new Error('Header param field must be provided')
    }

    const paramField = headerField['field'];

    if (!headerField['graphType']) {
      throw new Error(`Header param ${headerField['graphType']} has no type provided`)
    }

    let paramGraphType = headerField['graphType'];
    if (headerField['isArray']) {
      paramGraphType = `[${paramGraphType}]`;
    }

    const paramName = headerField['alias'] || `$${paramField}`;

    return [paramName, paramGraphType].join(':')
  }

  setQueryHeader() {

  }

  setQueryFragment() {

  }

  setQueryFields() {
    return this.queryFields.map(this.generateQueryField).join('\n');
  }

  generate() {

  }
}
