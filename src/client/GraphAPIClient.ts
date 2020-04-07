import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { GraphQLRequest } from 'graphql-request-generator/lib/src/interfaces/graphql-request.interface';
import { IGraphClientConfig } from '../interfaces';
import { GraphQLRequestType } from '../types/GraphQLRequestType';
import GeneratorFactory from './GeneratorFactory';

const defaultClientConfig: IGraphClientConfig = {
  queryPayloadName: 'query',
  variablesPayloadName: 'variables',
};

class GraphAPIClient {
  public static collectRequestValues(requests: GraphQLRequest[]): object {
    const requestValues = Object.create({});

    requests.forEach((request: GraphQLRequest) => {
      const { fragmentValues } = request;
      if (fragmentValues) {
        const valueKeys = Object.keys(fragmentValues);
        if (valueKeys.length) {
          valueKeys.forEach((key: string) => {
            Object.assign(requestValues, {
              [key]: fragmentValues[key],
            });
          });
        }
      }
    });

    return requestValues;
  }

  private axios: AxiosInstance;
  private config: IGraphClientConfig;

  constructor(axiosRequestConfig: AxiosRequestConfig = {}, clientConfig: IGraphClientConfig = defaultClientConfig) {
    this.axios = axios.create(axiosRequestConfig);
    this.config = Object.assign({}, defaultClientConfig, clientConfig);
  }

  public post<T>(path: string, body: any, config: AxiosRequestConfig = {}): Promise<T> {
    return this.axios.post(path, body, { ...config });
  }

  public collectRequestBody(operationType: GraphQLRequestType, requests: GraphQLRequest[]): { [p: string]: any } {
    const generator = GeneratorFactory.getGenerator(operationType);

    const queryKeyName: string = this.config.queryPayloadName;
    const variablesKeyName: string = this.config.variablesPayloadName;

    const queryString: string = generator.generateRequestString(requests);
    const queryValues: object = GraphAPIClient.collectRequestValues(requests);

    return {
      [queryKeyName]: queryString,
      [variablesKeyName]: queryValues,
    };
  }

  public query<T>(path: string = '/graphql', requests: GraphQLRequest[], config: AxiosRequestConfig = {}): Promise<T> {
    const body = this.collectRequestBody('query', requests);
    return this.post<T>(path, body, config);
  }

  public mutate<T>(path: string = '/graphql', requests: GraphQLRequest[], config: AxiosRequestConfig = {}): Promise<T> {
    const body = this.collectRequestBody('mutation', requests);
    return this.post<T>(path, body, config);
  }
}

export default GraphAPIClient;
