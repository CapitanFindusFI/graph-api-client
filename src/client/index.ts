import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { GraphQLOperationType } from "../enums";
import { GraphQLGenerator } from "./graphql-generator";
import { GraphQLRequest } from "./graphql-request";

export class GraphAPIClient {
  private axios: AxiosInstance;

  constructor(axiosRequestConfig: AxiosRequestConfig = {}) {
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

  public collectRequestBody(
    operationType: GraphQLOperationType,
    ...requests: GraphQLRequest[]
  ): { query: string; variables: Map<string, any> } {
    const generator = new GraphQLGenerator(operationType, ...requests);
    const query = generator.generateQueryString();
    const variables = generator.values;
    return {
      query,
      variables
    };
  }

  public query<T>(path: string = "/graphql", ...requests: GraphQLRequest[]): Promise<T> {
    const body = this.collectRequestBody(GraphQLOperationType.QUERY, ...requests);
    return this.post(path, body);
  }

  public mutate<T>(path: string = "/graphql", ...requests: GraphQLRequest[]): Promise<T> {
    const body = this.collectRequestBody(GraphQLOperationType.MUTATION, ...requests);
    return this.post(path, body);
  }
}
