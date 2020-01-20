import GraphQLQueryRequest from "../client/graphql-request/query";
import {GraphQLField} from "../types";
import {GraphQLParam} from "../interfaces";

describe('it should handle graph query request', () => {
    it('should generate a simple query', () => {
        const queryName = 'test';
        const queryParams: GraphQLParam[] = [];
        const queryFields = ['id', 'name'];

        const generatedQuery = new GraphQLQueryRequest(queryName, queryParams, queryFields).generate();
        expect(generatedQuery).toBe('query{test{id name}}');
    });

    it('should generate a simple query with params', () => {
        const queryName = 'test';
        const queryParams: GraphQLParam[] = [{
            name: 'id',
            type: 'String'
        }];
        const queryFields = ['name'];

        const generatedQuery = new GraphQLQueryRequest(queryName, queryParams, queryFields).generate();
        expect(generatedQuery).toBe('query($id:String){test(id:$id){name}}');
    });

    it('should generate a query with multiple params', () => {
        const queryName = 'test';
        const queryParams: GraphQLParam[] = [{
            name: 'id',
            type: 'String'
        }, {
            name: 'name',
            type: 'String'
        }];
        const queryFields = ['name'];

        const generatedQuery = new GraphQLQueryRequest(queryName, queryParams, queryFields).generate();
        expect(generatedQuery).toBe('query($id:String,$name:String){test(id:$id,name:$name){name}}');
    });

    it('should generate a query with nested fields', () => {
        const queryName = 'test';
        const queryParams: GraphQLParam[] = [];
        const queryFields = [{foo: ['bar', 'baz']}];

        const generatedQuery = new GraphQLQueryRequest(queryName, queryParams, queryFields).generate();
        expect(generatedQuery).toBe('query{test{foo{bar baz}}}');
    });

    it('should generate a query with mixed fields', () => {
        const queryName = 'test';
        const queryParams: GraphQLParam[] = [];
        const queryFields = [
            {foo: ['bar', 'baz']},
            'let'
        ];

        const generatedQuery = new GraphQLQueryRequest(queryName, queryParams, queryFields).generate();
        expect(generatedQuery).toBe('query{test{foo{bar baz} let}}');
    });

    it('should generate a query with mixed fields and params', () => {
        const queryName = 'test';
        const queryParams: GraphQLParam[] = [{
            name: 'id',
            type: 'String'
        }];
        const queryFields: GraphQLField[] = [
            'let', {
                foo: ['bar', 'baz']
            },
        ];

        const generatedQuery = new GraphQLQueryRequest(queryName, queryParams, queryFields).generate();
        expect(generatedQuery).toBe('query($id:String){test(id:$id){let foo{bar baz}}}');
    });

    it('should generate a query with multiple subfields', () => {
        const queryName = 'test';
        const queryParams: GraphQLParam[] = [];
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
        expect(generatedQuery).toBe('query{test{id name foo{id name bar{baz nolgo{id}}}}}');
    });

    it('should generate a query with correct parameters', () => {
        const queryName = 'test';
        const queryParams: GraphQLParam[] = [{
            name: 'input',
            type: 'TypeName'
        }];
        const queryFields = ['id'];
        const queryValues = {
            input: 'foo'
        };

        const generatedQuery = new GraphQLQueryRequest(queryName, queryParams, queryFields, queryValues).generate();
        expect(generatedQuery).toBe('query($input:TypeName){test(input:$input){id}}')
    })
});
