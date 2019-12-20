const GraphQLGenerator = require('./index');

class GraphQLQueryGenerator extends GraphQLGenerator {
  constructor(queryString) {
    if (queryString.indexOf('query') === -1)
      throw new Error('Provided string doesn\'t seems like a query');

    return super(queryString);
  }

  collectRequestName() {
    if (!this.graphQLStringCleanedArray[1])
      throw new Error('Malformed string provided');

    this.requestName = this.graphQLStringCleanedArray[1];
  }

  collectRequestParams() {
    if (!this.graphQLStringCleanedArray[0])
      throw new Error('Malformed string provided');

    const queryHeader = this.graphQLStringCleanedArray[0];
    const headerParameters = this.getTextBetweenParenthesis(queryHeader);
    if (headerParameters) {
      this.requestParams = this.extractParametersFromParenthesis(headerParameters)
    }
  }

  collectRequestFields() {
    const recombinedQuery = this.isolateQueryBody();
    super.collectRequestFields();
  }

  collectRequestValues() {
    super.collectRequestValues();
  }
}

module.exports = GraphQLQueryGenerator;
