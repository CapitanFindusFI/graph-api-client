import { IGraphQLParam } from "../../interfaces";
import { GraphQLRequest } from "./index";

class GraphQLQueryRequest extends GraphQLRequest {
  constructor(
    requestName: string,
    resultFields: string[],
    requestParams: IGraphQLParam[] = [],
    requestValues: { [p: string]: any } = {}
  ) {
    super(requestName, resultFields, requestParams, requestValues);
  }
}

export default GraphQLQueryRequest;
