import { IGraphQLParam } from '../../interfaces';
import { GraphQLRequest } from './index';

class GraphQLQueryRequest extends GraphQLRequest {
  constructor(
    requestName: string,
    resultFields: string[],
    requestParams: IGraphQLParam[] = [],
    requestValues: Map<string, any> = new Map(),
  ) {
    super(requestName, resultFields, requestParams, requestValues);
  }
}

export default GraphQLQueryRequest;
