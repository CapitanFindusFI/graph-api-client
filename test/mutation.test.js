const mocha = require('mocha');
const describe = mocha.describe;
const assert = require('assert');

const GraphQLMutationRequest = require('../src/client/graphql-request/mutation');

describe('it should handle graph mutation request', () => {
  it('should generate a simple mutation', () => {
    const mutationName = 'test';
    const mutationParams = [{
      name: 'id',
      type: 'String',
      alias: '$turnId'
    }];
    const queryFields = ['id', 'name'];

    const generatedQuery = new GraphQLMutationRequest(mutationName, mutationParams, queryFields).generate();
    assert.equal(generatedQuery, 'mutation($turnId:String){test(turnId:$turnId){id name}}')
  });

  it('should throw an error for missing parameters', () => {
    const mutationName = 'test';
    const mutationParams = [];
    const queryFields = ['id', 'name'];

    const methodCall = new GraphQLMutationRequest(mutationName, mutationParams, queryFields).generate;
    assert.throws(methodCall, Error, 'error thrown');
  });

  it('should generate a simple query with params', () => {
    const mutationName = 'test';
    const mutationParams = [{
      name: 'id',
      type: 'String'
    }];
    const queryFields = ['name'];

    const generatedQuery = new GraphQLMutationRequest(mutationName, mutationParams, queryFields).generate();
    assert.equal(generatedQuery, 'mutation($id:String){test(id:$id){name}}');
  });

  it('should generate a query with multiple params', () => {
    const mutationName = 'test';
    const mutationParams = [{
      name: 'id',
      type: 'String'
    }, {
      name: 'name',
      type: 'String'
    }];
    const queryFields = ['name'];

    const generatedQuery = new GraphQLMutationRequest(mutationName, mutationParams, queryFields).generate();
    assert.equal(generatedQuery, 'mutation($id:String,$name:String){test(id:$id,name:$name){name}}');
  });

  it('should generate a query with nested fields', () => {
    const mutationName = 'test';
    const mutationParams = [];
    const queryFields = [{foo: ['bar', 'baz']}];

    const generatedQuery = new GraphQLMutationRequest(mutationName, mutationParams, queryFields).generate();
    assert.equal(generatedQuery, 'mutation{test{foo{bar baz}}}');
  });

  it('should generate a query with mixed fields', () => {
    const mutationName = 'test';
    const mutationParams = [];
    const queryFields = [
      {foo: ['bar', 'baz']},
      'let'
    ];

    const generatedQuery = new GraphQLMutationRequest(mutationName, mutationParams, queryFields).generate();
    assert.equal(generatedQuery, 'mutation{test{foo{bar baz} let}}');
  });

  it('should generate a query with mixed fields and params', () => {
    const mutationName = 'test';
    const mutationParams = [{
      name: 'id',
      type: 'String'
    }];
    const queryFields = [
      'let', {
        foo: ['bar', 'baz']
      },
    ];

    const generatedQuery = new GraphQLMutationRequest(mutationName, mutationParams, queryFields).generate();
    assert.equal(generatedQuery, 'mutation($id:String){test(id:$id){let foo{bar baz}}}');
  });

  it('should generate a query with multiple subfields', () => {
    const mutationName = 'test';
    const mutationParams = [];
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

    const generatedQuery = new GraphQLMutationRequest(mutationName, mutationParams, queryFields).generate();
    assert.equal(generatedQuery, 'mutation{test{id name foo{id name bar{baz nolgo{id}}}}}');
  })
});
