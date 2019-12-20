const helper = require('../../helper');

class GraphQLRequest {
  constructor(requestName, requestParams, resultFields) {
    if (!Array.isArray(resultFields))
      throw new Error('Result fields must be an array');

    this.requestName = requestName;
    this.requestParams = requestParams;
    this.resultFields = resultFields;

    return this;
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

  generateQueryFields() {
    return this.resultFields.map(this.generateQueryField.bind(this)).join(' ');
  }

  generate() {
    throw new Error('Must be implemented on child classes');
  }
}
