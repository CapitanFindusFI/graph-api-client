import GraphQLQueryRequest from "../client/graphql-request/query";
import {GraphQLParam} from "../interfaces";
import {GraphQLField} from "../types";

describe('it should correctly throw library errors', () => {
    it('should throw an error for missing query fields', () => {
        const queryName = 'test';
        const queryParams: GraphQLParam[] = [];
        const queryFields: GraphQLField[] = [];
        const queryValues = {foo: 'bar'};

        expect(() => {
            new GraphQLQueryRequest(queryName, queryParams, queryFields, queryValues).generate()
        }).toThrow();
    });

    it('should throw an error for uncongruent query params', () => {
        const queryName = 'test';
        const queryParams = [{
            name: 'id',
            type: 'String'
        }];
        const queryFields = ['name'];
        const queryValues = {i: '123'};

        expect(() => {
            new GraphQLQueryRequest(queryName, queryParams, queryFields, queryValues).generate()
        }).toThrow();
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

        expect(() => {
            new GraphQLQueryRequest(queryName, queryParams, queryFields, queryValues).generate();
        }).toThrow();
    });
});
