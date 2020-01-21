import Helper from '../../helper';
import { IGraphQLParam } from '../../interfaces';
import { GraphQLField } from '../../types';

export abstract class GraphQLRequest {
  protected requestName: string;
  protected requestParams: IGraphQLParam[];
  protected resultFields: GraphQLField[];
  protected requestValues: { [key: string]: any };

  protected constructor(
    requestName: string,
    requestParams: IGraphQLParam[],
    resultFields: GraphQLField[],
    requestValues: { [key: string]: any } = {},
  ) {
    if (!Array.isArray(resultFields)) {
      throw new Error('Result fields must be an array');
    }

    if (!resultFields.length) {
      throw new Error('Must select a list of fields to retrieve');
    }

    this.requestName = requestName;
    this.requestParams = requestParams;
    this.resultFields = resultFields;
    this.requestValues = requestValues;

    return this;
  }

  public abstract generateHeader(): string;

  public abstract generateFragment(): string;

  public abstract generateBody(): string;

  public generate(): string {
    if (!this.areValuesValid()) {
      throw new Error('Passed values does not conform with query');
    }

    return [this.generateHeader(), this.generateFragment(), this.generateBody(), '}}'].join('');
  }

  protected getParamQueryName(graphQLParam: IGraphQLParam): string {
    if (!graphQLParam.name) {
      throw new Error('GraphQL param is missing its name');
    }

    let paramName;
    if (graphQLParam.alias) {
      const paramString = graphQLParam.alias.split('$');
      paramName = paramString[paramString.length - 1];
    } else {
      paramName = `${graphQLParam.name}`;
    }

    return paramName;
  }

  protected generateHeaderField(headerParam: IGraphQLParam): string {
    const fieldName = `$${this.getParamQueryName(headerParam)}`;

    if (!headerParam.type) {
      throw new Error(`Header param: ${headerParam.name} is missing its type`);
    }

    const fieldType = headerParam.isArray ? `[${headerParam.type}]` : headerParam.type;

    return [fieldName, fieldType].join(':');
  }

  protected generateFragmentField(fragmentField: IGraphQLParam): string {
    const fieldName = this.getParamQueryName(fragmentField);

    return [fieldName, `$${fieldName}`].join(':');
  }

  protected generateQueryField(queryField: any): string {
    if (Helper.isObject(queryField)) {
      const objectKeys = Object.keys(queryField);
      if (objectKeys.length > 1) {
        throw new Error('Query field object must have a single key');
      }

      const objectName = objectKeys[0];
      const objectValues = queryField[objectName];
      const nestedValues = objectValues.map(this.generateQueryField.bind(this)).join(' ');

      return `${objectName}{${nestedValues}}`;
    } else {
      return queryField.toString();
    }
  }

  private areValuesValid(): boolean {
    const valueKeys = Object.keys(this.requestValues);
    if (!valueKeys.length) {
      return true;
    }

    const mutationFields = this.requestParams.map(this.getParamQueryName.bind(this));

    const wrongValues = mutationFields.filter(key => valueKeys.indexOf(key.toString()) === -1);
    if (wrongValues.length > 0) {
      throw new Error(
        `GraphQL Request is missing following fields: ${wrongValues.join(',')}, double check your aliases if present`,
      );
    }

    return true;
  }
}
