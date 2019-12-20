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
    const mutationValues = {
      turnId: '123'
    };

    const generatedQuery = new GraphQLMutationRequest(mutationName, mutationParams, queryFields, mutationValues).generate();
    assert.equal(generatedQuery, 'mutation($turnId:String){test(turnId:$turnId){id name}}')
  });

  it('should generate a simple query with params', () => {
    const mutationName = 'test';
    const mutationParams = [{
      name: 'id',
      type: 'String'
    }];
    const queryFields = ['name'];
    const mutationValues = {
      id: '123'
    };

    const generatedQuery = new GraphQLMutationRequest(mutationName, mutationParams, queryFields, mutationValues).generate();
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
    const mutationValues = {
      id: '123',
      name: 'nolgo'
    };

    const generatedQuery = new GraphQLMutationRequest(mutationName, mutationParams, queryFields, mutationValues).generate();
    assert.equal(generatedQuery, 'mutation($id:String,$name:String){test(id:$id,name:$name){name}}');
  });

  it('should generate a query with nested fields', () => {
    const mutationName = 'test';
    const mutationParams = [];
    const queryFields = [{foo: ['bar', 'baz']}];
    const mutationValues = {};

    const generatedQuery = new GraphQLMutationRequest(mutationName, mutationParams, queryFields, mutationValues).generate();
    assert.equal(generatedQuery, 'mutation{test{foo{bar baz}}}');
  });

  it('should generate a query with mixed fields', () => {
    const mutationName = 'test';
    const mutationParams = [{
      name: 'turn',
      type: 'String',
      alias: 'nolgo'
    }];
    const queryFields = [
      {foo: ['bar', 'baz']},
      'let'
    ];
    const mutationValues = {
      nolgo: '123'
    };

    const generatedQuery = new GraphQLMutationRequest(mutationName, mutationParams, queryFields, mutationValues).generate();
    assert.equal(generatedQuery, 'mutation($nolgo:String){test(nolgo:$nolgo){foo{bar baz} let}}');
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
    const mutationValues = {
      id: '123'
    };

    const generatedQuery = new GraphQLMutationRequest(mutationName, mutationParams, queryFields, mutationValues).generate();
    assert.equal(generatedQuery, 'mutation($id:String){test(id:$id){let foo{bar baz}}}');
  });

  it('should generate a mutation with multiple subfields', () => {
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
    const mutationValues = {};

    const generatedQuery = new GraphQLMutationRequest(mutationName, mutationParams, queryFields, mutationValues).generate();
    assert.equal(generatedQuery, 'mutation{test{id name foo{id name bar{baz nolgo{id}}}}}');
  })
});
