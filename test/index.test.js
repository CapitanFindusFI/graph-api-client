const mocha = require('mocha');
const describe = mocha.describe;
const assert = require('assert');

const GraphQLQueryRequest = require('../src/client/graphql-query');

describe('it should handle graph query request', () => {
  it('should generate a simple query', () => {
    const queryName = 'test';
    const queryParams = [];
    const queryFields = ['id', 'name'];

    const generatedQuery = new GraphQLQueryRequest(queryName, queryParams, queryFields).generate();
    assert.equal(generatedQuery, 'query{test{id name}}')
  });

  it('should generate a real-case simple query', () => {
    const queryName = 'productLine';
    const queryParams = [];
    const queryFields = ['name', 'code', 'description'];

    const generatedQuery = new GraphQLQueryRequest(queryName, queryParams, queryFields).generate();
    assert.equal(generatedQuery, 'query{productLine{name code description}}');
  });

  it('should generate a simple query with params', () => {
    const queryName = 'test';
    const queryParams = [{
      name: 'id',
      type: 'String'
    }];
    const queryFields = ['name'];

    const generatedQuery = new GraphQLQueryRequest(queryName, queryParams, queryFields).generate();
    assert.equal(generatedQuery, 'query($id:String){test(id:$id){name}}');
  });

  it('should generate a real-case simple query', () => {
    const queryName = 'productLine';
    const queryParams = [{
      name: 'id',
      type: 'String'
    }];
    const queryFields = ['name', 'code', 'description'];

    const generatedQuery = new GraphQLQueryRequest(queryName, queryParams, queryFields).generate();
    assert.equal(generatedQuery, 'query($id:String){productLine(id:$id){name code description}}');
  })
});
