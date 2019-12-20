class GraphQLGenerator {
  constructor(graphQLString) {
    const closingGraphs = graphQLString.split('}').length;
    const openingGraphs = graphQLString.split('{').length;

    if (closingGraphs !== openingGraphs)
      throw new Error('Malformed string passed');

    this.graphQLString = graphQLString;
    this.graphQLStringArray = this.splitString();
    this.graphQLStringCleanedArray = this.graphQLStringArray.map(s => s.replace(/}/g, ''));

    this.requestName = null;
    this.requestParams = [];
    this.requestFields = [];
    this.requestValues = {};

    return this;
  }

  splitString() {
    let strings = this.graphQLString.split(`{`);
    if (strings.length < 3)
      throw new Error('Malformed string passed');

    return strings;
  }

  getTextBetweenParenthesis(bracketsString) {
    const bracketRegex = new RegExp(/\((.*)\)/, 'g');
    const regMatches = bracketsString.match(bracketRegex);
    if (regMatches) {
      const textBetween = regMatches[0];
      return textBetween.substring(1, textBetween.length - 1);
    }
    return null;
  }

  extractParametersFromParenthesis(textBetweenParenthesis) {
    return textBetweenParenthesis.split(',').map((paramCouple) => {
      const splitCouple = paramCouple.split(':');
      let [name, type] = splitCouple;
      let isArray = false;

      if (name.indexOf('$') !== -1) {
        name = name.substring(1);
      }

      if (type.indexOf('[') !== -1) {
        type = type.substring(1, type.length - 1);
        isArray = true;
      }

      return {
        name, type, isArray
      }
    })
  }

  getTextBetweenBrackets(bracketsString) {
    const bracketRegex = new RegExp(/\({.*}\)/, 'g');
    const regMatches = bracketsString.match(bracketRegex);
    if (regMatches) {
      const textBetween = regMatches[0];
      return textBetween.substring(1, textBetween.length - 1);
    }
    return null;
  }

  cleanStringArray() {
    this.graphQLStringArray.splice(0, 2)
  }

  isolateQueryBody() {
    const restoredQuery = this.graphQLStringArray.join('{');
    return restoredQuery.substr(0, restoredQuery.length - 2);
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
    this.collectRequestName();
    this.collectRequestParams();

    this.cleanStringArray();

    this.collectRequestFields();
    this.collectRequestValues();

    return {
      ...this.requestName,
      ...this.requestParams,
      ...this.requestFields,
      ...this.requestValues
    };
  }

}

module.exports = GraphQLGenerator;
