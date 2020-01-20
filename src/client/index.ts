import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';
import GraphQLQueryRequest from "./graphql-request/query";
import GraphQLMutationRequest from "./graphql-request/mutation";
import {GraphQLParam} from "../interfaces";

class GraphAPIClient {
    private axios: AxiosInstance;

    constructor(axiosRequestConfig: AxiosRequestConfig) {
        this.axios = axios.create(axiosRequestConfig)
    }

    get<T>(path: string, params = {}, headers = {}): Promise<T> {
        return this.axios.get(path, {
            ...params,
            ...headers
        })
    }

    post<T>(path: string, body: any, params = {}, headers = {}): Promise<T> {
        return this.axios.post(path, body, {
            ...params,
            ...headers
        })
    }

    collectRequestBody(query: string, variables: object): { query: string, variables: object } {
        return {
            query, variables
        }
    }

    query<T>(queryName: string,
             queryParams: GraphQLParam[],
             queryFields: string[],
             queryValues: { [name: string]: any } = {},
             path: string = '/graphql'): Promise<T> {
        const graphQLPayload = new GraphQLQueryRequest(queryName, queryParams, queryFields, queryValues).generate();
        const requestBody = this.collectRequestBody(graphQLPayload, queryValues);

        return this.post<T>(path, requestBody);
    }

    mutate<T>(mutationName: string,
              mutationParams: GraphQLParam[],
              queryFields: string[],
              mutationValues: { [name: string]: any } = {},
              path: string = '/graphql'): Promise<T> {
        const graphQLPayload = new GraphQLMutationRequest(mutationName, mutationParams, queryFields, mutationValues).generate();
        const requestBody = this.collectRequestBody(graphQLPayload, mutationValues);

        return this.post<T>(path, requestBody);
    }
}

export default GraphAPIClient;
