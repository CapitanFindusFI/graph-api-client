import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { IGraphQLParam } from "../interfaces";
import GraphQLMutationRequest from "./graphql-request/mutation";
import GraphQLQueryRequest from "./graphql-request/query";

export class GraphAPIClient {
  private axios: AxiosInstance;

  constructor(axiosRequestConfig: AxiosRequestConfig) {
    this.axios = axios.create(axiosRequestConfig);
  }

  public get<T>(path: string, params = {}, headers = {}): Promise<T> {
    return this.axios.get(path, {
      ...params,
      ...headers
    });
  }

  public post<T>(path: string, body: any, params = {}, headers = {}): Promise<T> {
    return this.axios.post(path, body, {
      ...params,
      ...headers
    });
  }

  public collectRequestBody(query: string, variables: object): { query: string; variables: object } {
    return {
      query,
      variables
    };
  }

  public query<T>(
    queryName: string,
    queryParams: IGraphQLParam[],
    queryFields: string[],
    queryValues: { [name: string]: any } = {},
    path: string = "/graphql"
  ): Promise<T> {
    const graphQLPayload = new GraphQLQueryRequest(queryName, queryParams, queryFields, queryValues).generate();
    const requestBody = this.collectRequestBody(graphQLPayload, queryValues);

    return this.post<T>(path, requestBody);
  }

  public mutate<T>(
    mutationName: string,
    mutationParams: IGraphQLParam[],
    queryFields: string[],
    mutationValues: { [name: string]: any } = {},
    path: string = "/graphql"
  ): Promise<T> {
    const graphQLPayload = new GraphQLMutationRequest(
      mutationName,
      mutationParams,
      queryFields,
      mutationValues
    ).generate();
    const requestBody = this.collectRequestBody(graphQLPayload, mutationValues);

    return this.post<T>(path, requestBody);
  }
}
