const GraphQLGenerator = require('./graphql-generator');

class GraphQLQueryGenerator extends GraphQLGenerator {
  constructor(queryString) {
    if (queryString.indexOf('query') === -1)
      throw new Error('Provided string doesn\'t seems like a query');

    super(queryString);
  }


}

module.exports = GraphQLQueryGenerator;
