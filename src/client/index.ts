import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { GraphQLOperationType } from '../enums';
import { IGraphClientConfig } from '../interfaces';
import { GraphQLGenerator } from './graphql-generator';
import { GraphQLRequest } from './graphql-request';

const defaultClientConfig: IGraphClientConfig = {
  queryPayloadName: 'query',
  variablesPayloadName: 'variables',
};

export class GraphAPIClient {
  private axios: AxiosInstance;
  private config: IGraphClientConfig;

  constructor(axiosRequestConfig: AxiosRequestConfig = {}, clientConfig: IGraphClientConfig = defaultClientConfig) {
    this.axios = axios.create(axiosRequestConfig);
    this.config = Object.assign({}, defaultClientConfig, clientConfig);
  }

  public get<T>(path: string, config: AxiosRequestConfig = {}): Promise<T> {
    return this.axios.get(path, { ...config });
  }

  public post<T>(path: string, body: any, config: AxiosRequestConfig = {}): Promise<T> {
    return this.axios.post(path, body, { ...config });
  }

  public collectRequestBody(operationType: GraphQLOperationType, ...requests: GraphQLRequest[]): { [p: string]: any } {
    const generator = new GraphQLGenerator(operationType, ...requests);

    const queryKeyName: string = this.config.queryPayloadName;
    const variablesKeyName: string = this.config.variablesPayloadName;

    return {
      [queryKeyName]: generator.generateQueryString(),
      [variablesKeyName]: generator.generateQueryValues(),
    };
  }

  public query<T>(
    path: string = '/graphql',
    config: AxiosRequestConfig = {},
    ...requests: GraphQLRequest[]
  ): Promise<T> {
    const body = this.collectRequestBody(GraphQLOperationType.QUERY, ...requests);
    return this.post(path, body, config);
  }

  public mutate<T>(
    path: string = '/graphql',
    config: AxiosRequestConfig = {},
    ...requests: GraphQLRequest[]
  ): Promise<T> {
    const body = this.collectRequestBody(GraphQLOperationType.MUTATION, ...requests);
    return this.post(path, body, config);
  }
}
