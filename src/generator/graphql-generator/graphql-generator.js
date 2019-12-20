class GraphQLGenerator {
  constructor(graphQLString) {
    const closingGraphs = graphQLString.split('}').length;
    const openingGraphs = graphQLString.split('{').length;

    if (closingGraphs !== openingGraphs)
      throw new Error('Malformed string passed');

    this.graphQLString = graphQLString;
    this.graphQLStringArray = this.splitString().map(s => s.replace(/}/g, ''));
  }

  splitString() {
    let strings = this.graphQLString.split(`{`);
    if (strings.length < 3)
      throw new Error('Malformed string passed');

    return strings;
  }

  collectRequestName() {

  }

  collectRequestParams() {

  }

  collectRequestFields() {

  }

  collectRequestValues() {

  }

  generate() {

  }

}

module.exports = GraphQLGenerator;
