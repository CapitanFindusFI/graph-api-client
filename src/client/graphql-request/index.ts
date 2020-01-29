/* tslint:disable:variable-name */
import { IGraphQLParam } from '../../interfaces';

export abstract class GraphQLRequest {
  get requestValues(): Map<string, any> {
    return this._requestValues;
  }

  get requestParams(): IGraphQLParam[] {
    return this._requestParams;
  }

  get resultFields(): string[] {
    return this._resultFields;
  }

  get requestName(): string {
    return this._requestName;
  }

  private readonly _requestName: string;
  private readonly _resultFields: string[];
  private readonly _requestParams: IGraphQLParam[];
  private readonly _requestValues: Map<string, any>;

  protected constructor(
    requestName: string,
    resultFields: string[],
    requestParams: IGraphQLParam[],
    requestValues: Map<string, any>,
  ) {
    this._requestName = requestName;
    this._resultFields = resultFields;
    this._requestParams = requestParams;
    this._requestValues = requestValues;
  }
}
