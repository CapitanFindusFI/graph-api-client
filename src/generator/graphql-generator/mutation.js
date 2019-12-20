const GraphQLGenerator = require('./graphql-generator');

class GraphQLMutationGenerator extends GraphQLGenerator {
  constructor(mutationString) {
    if (mutationString.indexOf('mutation') === -1)
      throw new Error('Provided string doesn\'t seems like a mutation');

    super(mutationString);
  }


}

module.exports = GraphQLMutationGenerator;
