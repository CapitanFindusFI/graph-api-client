import {GraphQLRequest} from "graphql-request-generator/lib/interfaces/graphql-request.interface";
import GraphAPIClient from "../src/client/GraphAPIClient";

const client = new GraphAPIClient();

describe('client queries generation test suite', () => {
    it('should correctly generate a query request payload', () => {
        const requests: GraphQLRequest[] = [{
            fragmentName: 'time'
        }];

        const payload = client.collectRequestBody("query", requests);
        expect(Object.keys(payload)).toEqual(['query', 'variables']);

        const {query, variables} = payload;

        expect(query).toBe('query{\ntime}');
        expect(Object.keys(variables)).toEqual([]);
    });

    it('should correctly generate a query request payload with fields', () => {
        const requests: GraphQLRequest[] = [{
            fragmentFields: ['id', 'name', 'surname'],
            fragmentName: 'users'
        }];

        const payload = client.collectRequestBody("query", requests);
        const {query, variables} = payload;

        expect(query).toBe('query{\nusers{id name surname}}');
        expect(Object.keys(variables)).toEqual([]);
    });

    it('should correctly generate a query request payload with params', () => {
        const requests: GraphQLRequest[] = [{
            fragmentFields: ['name', 'surname'],
            fragmentName: 'user',
            fragmentParams: [{
                alias: '$id',
                name: 'id',
                type: 'String'
            }]
        }];

        const payload = client.collectRequestBody("query", requests);
        const {query, variables} = payload;

        expect(query).toBe('query($id:String){\nuser(id:$id){name surname}}')
    });

    it('should correctly generate a query request payload with multiple fragments', () => {
        const requests: GraphQLRequest[] = [{
            fragmentFields: ['id', 'name', 'surname'],
            fragmentName: 'users'
        }, {
            fragmentFields: ['id', 'createdAt'],
            fragmentName: 'accounts'
        }];

        const payload = client.collectRequestBody("query", requests);
        const {query, variables} = payload;

        expect(query).toBe('query{\nusers{id name surname}\naccounts{id createdAt}}');
    });

    it('should correctly generate a query request payload with multiple fragments and params', () => {
        const requests: GraphQLRequest[] = [{
            fragmentFields: ['name', 'surname'],
            fragmentName: 'user',
            fragmentParams: [{
                alias: '$id',
                name: 'id',
                type: 'String'
            }]
        }, {
            fragmentFields: ['roles.name'],
            fragmentName: 'accounts',
            fragmentParams: [{
                alias: '$userId',
                name: 'userId',
                type: 'String'
            }]
        }];

        const payload = client.collectRequestBody("query", requests);
        const {query, variables} = payload;

        expect(query).toBe('query($id:String,$userId:String){\nuser(id:$id){name surname}\naccounts(userId:$userId){roles { name }}}');
    });
});
