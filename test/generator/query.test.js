const mocha = require('mocha');
const describe = mocha.describe;
const assert = require('assert');

const GraphQLQueryGenerator = require('../../src/generator/graphql-generator/query');

describe('it should handle graph query request', () => {
  it('should generate from a simple query', () => {
    const queryString = 'query{test{id name}}';
    const generatedPayload = new GraphQLQueryGenerator(queryString).generate();
  });

  it('should generate from a query with single param', () => {
    const queryString = 'query($id:String){test(id:$id){name}}';
    const generatedPayload = new GraphQLQueryGenerator(queryString).generate();
  });

  it('should generate from a query with nested fields', () => {
    const queryString = 'query($id:String){test(id:$id){name components{id}}}';
    const generatedPayload = new GraphQLQueryGenerator(queryString).generate();
  });
});
