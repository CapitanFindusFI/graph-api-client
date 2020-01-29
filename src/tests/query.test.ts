import { GraphAPIClient } from '../client';
import GraphQLQueryRequest from '../client/graphql-request/query';
import { GraphQLOperationType } from '../enums';

const graphClient = new GraphAPIClient();
const queryRequest = GraphQLQueryRequest;

describe('it should correctly generate GraphQL request bodies', () => {
  it('should generate a simple query', () => {
    const r = new queryRequest('test', ['id', 'name']);
    const { query, variables } = graphClient.collectRequestBody(GraphQLOperationType.QUERY, r);

    expect(query).toBe('query{test{ id name }}');
    expect(variables).toMatchObject({});
  });

  it('should generate a simple query with parameters', () => {
    const values = new Map<string, any>();
    values.set('foo', '123');
    const r = new queryRequest(
      'test',
      ['id', 'name'],
      [
        {
          name: 'foo',
          type: 'bar',
        },
      ],
      values,
    );

    const { query, variables } = graphClient.collectRequestBody(GraphQLOperationType.QUERY, r);
    expect(query).toBe('query($foo:bar){test(foo:$foo){ id name }}');
    expect(variables).toMatchObject({ foo: '123' });
  });

  it('should generate a multiple query without parameters', () => {
    const r1 = new queryRequest('test', ['id', 'name']);
    const r2 = new queryRequest('foo', ['id', 'name']);

    const { query, variables } = graphClient.collectRequestBody(GraphQLOperationType.QUERY, r1, r2);
    expect(query).toBe('query{test{ id name } foo{ id name }}');
    expect(variables).toMatchObject({});
  });

  it('should generate a multiple query with parameters', () => {
    const r1 = new queryRequest(
      'test',
      ['id', 'name'],
      [
        {
          name: 'foo',
          type: 'bar',
        },
      ],
    );
    const r2 = new queryRequest(
      'foo',
      ['id', 'name'],
      [
        {
          name: 'bar',
          type: 'foo',
        },
      ],
    );

    const { query, variables } = graphClient.collectRequestBody(GraphQLOperationType.QUERY, r1, r2);
    expect(query).toBe('query($foo:bar,$bar:foo){test(foo:$foo){ id name } foo(bar:$bar){ id name }}');
    expect(variables).toMatchObject({});
  });

  it('should throw an error for repeated different parameters', () => {
    const r1 = new queryRequest(
      'test',
      ['id', 'name'],
      [
        {
          name: 'foo',
          type: 'bar',
        },
      ],
    );
    const r2 = new queryRequest(
      'foo',
      ['id', 'name'],
      [
        {
          name: 'foo',
          type: 'baz',
        },
      ],
    );

    expect(() => {
      graphClient.collectRequestBody(GraphQLOperationType.QUERY, r1, r2);
    }).toThrowError();
  });
});
