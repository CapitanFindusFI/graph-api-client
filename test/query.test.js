const mocha = require('mocha');
const describe = mocha.describe;
const assert = require('assert');

const GraphQLQueryRequest = require('../src/client/graphql-request/query');

describe('it should handle graph query request', () => {
  it('should generate a simple query', () => {
    const queryName = 'test';
    const queryParams = [];
    const queryFields = ['id', 'name'];

    const generatedQuery = new GraphQLQueryRequest(queryName, queryParams, queryFields).generate();
    assert.equal(generatedQuery, 'query{test{id name}}');
  });

  it('should throw an error for missing query fields', () => {
    const queryName = 'test';
    const queryParams = [];
    const queryFields = [];

    const methodCall = new GraphQLQueryRequest(queryName, queryParams, queryFields).generate;
    assert.throws(methodCall, Error, 'missing params');
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

  it('should generate a query with multiple params', () => {
    const queryName = 'test';
    const queryParams = [{
      name: 'id',
      type: 'String'
    }, {
      name: 'name',
      type: 'String'
    }];
    const queryFields = ['name'];

    const generatedQuery = new GraphQLQueryRequest(queryName, queryParams, queryFields).generate();
    assert.equal(generatedQuery, 'query($id:String,$name:String){test(id:$id,name:$name){name}}');
  });

  it('should generate a query with nested fields', () => {
    const queryName = 'test';
    const queryParams = [];
    const queryFields = [{foo: ['bar', 'baz']}];

    const generatedQuery = new GraphQLQueryRequest(queryName, queryParams, queryFields).generate();
    assert.equal(generatedQuery, 'query{test{foo{bar baz}}}');
  });

  it('should generate a query with mixed fields', () => {
    const queryName = 'test';
    const queryParams = [];
    const queryFields = [
      {foo: ['bar', 'baz']},
      'let'
    ];

    const generatedQuery = new GraphQLQueryRequest(queryName, queryParams, queryFields).generate();
    assert.equal(generatedQuery, 'query{test{foo{bar baz} let}}');
  });

  it('should generate a query with mixed fields and params', () => {
    const queryName = 'test';
    const queryParams = [{
      name: 'id',
      type: 'String'
    }];
    const queryFields = [
      'let', {
        foo: ['bar', 'baz']
      },
    ];

    const generatedQuery = new GraphQLQueryRequest(queryName, queryParams, queryFields).generate();
    assert.equal(generatedQuery, 'query($id:String){test(id:$id){let foo{bar baz}}}');
  });

  it('should generate a query with multiple subfields', () => {
    const queryName = 'test';
    const queryParams = [];
    const queryFields = [
      'id', 'name', {
        foo: [
          'id', 'name', {
            bar: [
              'baz', {
                nolgo: [
                  'id'
                ]
              }
            ]
          }
        ]
      }
    ];

    const generatedQuery = new GraphQLQueryRequest(queryName, queryParams, queryFields).generate();
    assert.equal(generatedQuery, 'query{test{id name foo{id name bar{baz nolgo{id}}}}}');
  })
});
