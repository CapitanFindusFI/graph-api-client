import GraphQLMutationRequest from '../client/graphql-request/mutation';
import { IGraphQLParam } from '../interfaces';

describe('it should handle graph mutation request', () => {
  it('should generate a simple mutation', () => {
    const mutationName = 'test';
    const mutationParams = [
      {
        alias: '$turnId',
        name: 'id',
        type: 'String',
      },
    ];
    const queryFields = ['id', 'name'];
    const mutationValues = {
      turnId: '123',
    };

    const generatedQuery = new GraphQLMutationRequest(
      mutationName,
      mutationParams,
      queryFields,
      mutationValues,
    ).generate();
    expect(generatedQuery).toBe('mutation($turnId:String){test(turnId:$turnId){id name}}');
  });

  it('should generate a simple query with params', () => {
    const mutationName = 'test';
    const mutationParams = [
      {
        name: 'id',
        type: 'String',
      },
    ];
    const queryFields = ['name'];
    const mutationValues = {
      id: '123',
    };

    const generatedQuery = new GraphQLMutationRequest(
      mutationName,
      mutationParams,
      queryFields,
      mutationValues,
    ).generate();
    expect(generatedQuery).toBe('mutation($id:String){test(id:$id){name}}');
  });

  it('should generate a query with multiple params', () => {
    const mutationName = 'test';
    const mutationParams = [
      {
        name: 'id',
        type: 'String',
      },
      {
        name: 'name',
        type: 'String',
      },
    ];
    const queryFields = ['name'];
    const mutationValues = {
      id: '123',
      name: 'nolgo',
    };

    const generatedQuery = new GraphQLMutationRequest(
      mutationName,
      mutationParams,
      queryFields,
      mutationValues,
    ).generate();
    expect(generatedQuery).toBe('mutation($id:String,$name:String){test(id:$id,name:$name){name}}');
  });

  it('should generate a query with nested fields', () => {
    const mutationName = 'test';
    const mutationParams: IGraphQLParam[] = [];
    const queryFields = [{ foo: ['bar', 'baz'] }];
    const mutationValues = {};

    const generatedQuery = new GraphQLMutationRequest(
      mutationName,
      mutationParams,
      queryFields,
      mutationValues,
    ).generate();
    expect(generatedQuery).toBe('mutation{test{foo{bar baz}}}');
  });

  it('should generate a query with mixed fields', () => {
    const mutationName = 'test';
    const mutationParams = [
      {
        alias: 'nolgo',
        name: 'turn',
        type: 'String',
      },
    ];
    const queryFields = [{ foo: ['bar', 'baz'] }, 'let'];
    const mutationValues = {
      nolgo: '123',
    };

    const generatedQuery = new GraphQLMutationRequest(
      mutationName,
      mutationParams,
      queryFields,
      mutationValues,
    ).generate();
    expect(generatedQuery).toBe('mutation($nolgo:String){test(nolgo:$nolgo){foo{bar baz} let}}');
  });

  it('should generate a query with mixed fields and params', () => {
    const mutationName = 'test';
    const mutationParams = [
      {
        name: 'id',
        type: 'String',
      },
    ];
    const queryFields = [
      'let',
      {
        foo: ['bar', 'baz'],
      },
    ];
    const mutationValues = {
      id: '123',
    };

    const generatedQuery = new GraphQLMutationRequest(
      mutationName,
      mutationParams,
      queryFields,
      mutationValues,
    ).generate();
    expect(generatedQuery).toBe('mutation($id:String){test(id:$id){let foo{bar baz}}}');
  });

  it('should generate a mutation with multiple subfields', () => {
    const mutationName = 'test';
    const mutationParams: IGraphQLParam[] = [];
    const queryFields = [
      'id',
      'name',
      {
        foo: [
          'id',
          'name',
          {
            bar: [
              'baz',
              {
                nolgo: ['id'],
              },
            ],
          },
        ],
      },
    ];
    const mutationValues = {};

    const generatedQuery = new GraphQLMutationRequest(
      mutationName,
      mutationParams,
      queryFields,
      mutationValues,
    ).generate();
    expect(generatedQuery).toBe('mutation{test{id name foo{id name bar{baz nolgo{id}}}}}');
  });
});
