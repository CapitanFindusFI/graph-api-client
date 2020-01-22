import Helper from "../../helper";
import { IGraphQLParam } from "../../interfaces";
import { GraphQLField } from "../../types";
import { GraphQLRequest } from "./index";

class GraphQLMutationRequest extends GraphQLRequest {
  constructor(
    mutationName: string[],
    mutationParameters: IGraphQLParam[][],
    queryFields: string[][],
    mutationValues: { [key: string]: any } = {}
  ) {
    if (!Array.isArray(mutationParameters)) {
      throw new Error("Mutation must provide parameters");
    }

    if (!Helper.isObject(mutationValues)) {
      throw new Error("Mutation values must be a map of field/value");
    }

    super(mutationName, mutationParameters, queryFields, mutationValues);

    this.requestHeader = "mutation";
    return this;
  }
}

export default GraphQLMutationRequest;
