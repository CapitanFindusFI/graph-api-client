export interface IGraphQLParam {
  alias?: string;
  name: string;
  isArray?: boolean;
  type: string;
}

export interface IGraphClientConfig {
  queryPayloadName: string;
  variablesPayloadName: string
}
