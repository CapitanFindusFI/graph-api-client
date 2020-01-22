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

    this.validateParameters();
    this.validateValues();

    return this;
  }

  public generate(newlines: boolean = true): string {
    const requestHeader: string = GraphQLGenerator.generateWrapper(this.requestHeader, flatten(this.requestParams));
    const generatedFragments: string[] = this.requestNames.map((name, index) => {
      return GraphQLGenerator.generateFragment(name, this.requestParams[index], this.resultFields[index]);
    });

    const separator = newlines ? "\n" : "";

    return [
      requestHeader, "{", generatedFragments.join(separator), "}"
    ].join(separator);
  }

  private validateParameters(): void {
    flatten(this.requestParams).reduce((list: IGraphQLParam[], param: IGraphQLParam) => {
      const existingIndex = list.findIndex(p => p.name === param.name);
      if (existingIndex !== -1) {
        throw new Error(`Duplicate parameter ${param.name}`);
      }

      return list.concat(param);
    }, []);
  }

  private validateValues(): void {
    const requestValueKeys: string[] = Object.keys(this.requestValues);
    const requestFields = flatten(this.requestParams).map(GraphQLGenerator.getParamQueryName);

    const wrongValues = requestFields.filter((fieldName) => requestValueKeys.indexOf(fieldName.toString()) === -1);
    if (wrongValues.length > 0) {
      throw new Error(
        `GraphQL Request is missing following fields: ${wrongValues.join(",")}, double check your aliases if present`
      );
    }
  }
}
