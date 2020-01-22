import { flatten } from "lodash";
import { IGraphQLParam } from "../../interfaces";
import { GraphQLGenerator } from "../graphql-generator";

export abstract class GraphQLRequest {
  protected requestNames: string[];
  protected requestParams: IGraphQLParam[][];
  protected resultFields: string[][];
  protected requestValues: { [key: string]: any };

  // @ts-ignore
  protected requestHeader: string;

  protected constructor(
    requestName: string[],
    requestParams: IGraphQLParam[][],
    resultFields: string[][],
    requestValues: { [key: string]: any } = {}
  ) {
    if (!Array.isArray(resultFields)) {
      throw new Error("Result fields must be an array");
    }

    if (!resultFields.length) {
      throw new Error("Must select a list of fields to retrieve");
    }

    this.requestNames = requestName;
    this.requestParams = requestParams;
    this.resultFields = resultFields;
    this.requestValues = requestValues;

    return this;
  }

  public generate(newlines: boolean = true): string {
    if (!this.areValuesValid()) {
      throw new Error("Passed values does not conform with query");
    }

    const requestHeader: string = GraphQLGenerator.generateWrapper(this.requestHeader, flatten(this.requestParams));
    const generatedFragments: string[] = this.requestNames.map((name, index) => {
      return GraphQLGenerator.generateFragment(name, this.requestParams[index], this.resultFields[index]);
    });

    const separator = newlines ? "\n" : "";

    return [
      requestHeader, "{", generatedFragments.join(separator), "}"
    ].join(separator);
  }

  private areValuesValid(): boolean {
    const valueKeys = Object.keys(this.requestValues);
    if (!valueKeys.length) {
      return true;
    }

    return true;
  }
}
