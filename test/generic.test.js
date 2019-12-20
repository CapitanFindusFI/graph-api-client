const mocha = require('mocha');
const describe = mocha.describe;
const assert = require('assert');

const GraphQLMutationRequest = require('../src/client/graphql-request/mutation');
const GraphQLQueryRequest = require('../src/client/graphql-request/query');

describe('it should correctly throw library errors', () => {
  it('should throw an error for missing query fields', () => {
    const queryName = 'test';
    const queryParams = [];
    const queryFields = [];

    const methodCall = new GraphQLQueryRequest(queryName, queryParams, queryFields).generate;
    assert.throws(methodCall, Error, 'missing params');
  });

  it('should throw an error for uncongruent query params', () => {
    const queryName = 'test';
    const queryParams = [{
      name: 'id',
      type: 'String'
    }];
    const queryFields = ['name'];
    const queryValues = {i: '123'};

    const methodCall = new GraphQLQueryRequest(queryName, queryParams, queryFields, queryValues).generate;
    assert.throws(methodCall, Error, 'missing params');
  });

  it('should throw an error for uncongruent query params with aliases', () => {
    const queryName = 'test';
    const queryParams = [{
      name: 'id',
      type: 'String',
      alias: 'foo'
    }];
    const queryFields = ['name'];
    const queryValues = {id: '123'};

    const methodCall = new GraphQLQueryRequest(queryName, queryParams, queryFields, queryValues).generate;
    assert.throws(methodCall, Error, 'missing params');
  });
});
