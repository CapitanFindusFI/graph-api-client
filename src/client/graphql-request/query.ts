import { IGraphQLParam } from "../../interfaces";
import { GraphQLRequest } from "./index";

class GraphQLQueryRequest extends GraphQLRequest {
  constructor(
    queryNames: string[],
    queryParameters: IGraphQLParam[][],
    queryFields: string[][],
    queryValues: { [key: string]: any } = {}
  ) {
    super(queryNames, queryParameters, queryFields, queryValues);

    this.requestHeader = "query";
    return this;
  }
}

export default GraphQLQueryRequest;
