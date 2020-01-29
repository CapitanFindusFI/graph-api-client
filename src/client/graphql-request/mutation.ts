import { IGraphQLParam } from "../../interfaces";
import { GraphQLRequest } from "./index";

class GraphQLMutationRequest extends GraphQLRequest {

  constructor(requestName: string,
              resultFields: string[],
              requestParms: IGraphQLParam[],
              requestValues: Map<string, any>) {
    super(requestName, resultFields, requestParms, requestValues);
  }
}

export default GraphQLMutationRequest;
