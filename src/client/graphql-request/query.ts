import { IGraphQLParam } from "../../interfaces";
import { GraphQLRequest } from "./index";

class GraphQLQueryRequest extends GraphQLRequest {

  constructor(requestName: string,
              resultFields: string[],
              requestParms: IGraphQLParam[] = [],
              requestValues: Map<string, any> = new Map()) {
    super(requestName, resultFields, requestParms, requestValues);
  }
}

export default GraphQLQueryRequest;
