import {GraphQLRequest} from 'graphql-request-generator/src/interfaces/graphql-request.interface'
import GraphAPIClient from "../src/client/GraphAPIClient";

const client = new GraphAPIClient();

describe('client mutation generation test suite', () => {
    it('should correctly generate a mutation request payload', () => {
        const requests: GraphQLRequest[] = [{
            fragmentName: 'time'
        }];

        const payload = client.collectRequestBody("mutation", requests);
        expect(Object.keys(payload)).toEqual(['query', 'variables']);

        const {query, variables} = payload;

        expect(query).toBe('mutation{\ntime}');
        expect(Object.keys(variables)).toEqual([]);
    });

    it('should correctly generate a mutation request payload with fields', () => {
        const requests: GraphQLRequest[] = [{
            fragmentFields: ['id', 'name', 'surname'],
            fragmentName: 'users'
        }];

        const payload = client.collectRequestBody("mutation", requests);
        const {query, variables} = payload;

        expect(query).toBe('mutation{\nusers{id name surname}}');
        expect(Object.keys(variables)).toEqual([]);
    });

    it('should correctly generate a mutation request payload with params', () => {
        const requests: GraphQLRequest[] = [{
            fragmentFields: ['name', 'surname'],
            fragmentName: 'user',
            fragmentParams: [{
                alias: '$id',
                name: 'id',
                type: 'String'
            }]
        }];

        const payload = client.collectRequestBody("mutation", requests);
        const {query, variables} = payload;

        expect(query).toBe('mutation($id:String){\nuser(id:$id){name surname}}')
    });

    it('should correctly generate a mutation request payload with multiple fragments', () => {
        const requests: GraphQLRequest[] = [{
            fragmentFields: ['id', 'name', 'surname'],
            fragmentName: 'users'
        }, {
            fragmentFields: ['id', 'createdAt'],
            fragmentName: 'accounts'
        }];

        const payload = client.collectRequestBody("mutation", requests);
        const {query} = payload;

        expect(query).toBe('mutation{\nusers{id name surname}\naccounts{id createdAt}}');
    });

    it('should correctly generate payload variables', () => {
        const requests: GraphQLRequest[] = [{
            fragmentFields: ['id', 'name', 'surname'],
            fragmentName: 'updateUser',
            fragmentParams: [{
                name: 'user',
                type: 'UpdateUserInput'
            }],
            fragmentValues: {
                user: {
                    id: 123,
                    name: 'foo',
                    surname: 'bar'
                }
            }
        }];

        const payload = client.collectRequestBody("mutation", requests);
        const {query, variables} = payload;
        expect(query).toBe('mutation($user:UpdateUserInput){\nupdateUser(user:$user){id name surname}}');

        const variableKeys = Object.keys(variables);
        expect(variableKeys).toEqual(['user']);

        const {user} = variables;
        expect(user).toEqual({
            id: 123,
            name: 'foo',
            surname: 'bar'
        })
    })
});
