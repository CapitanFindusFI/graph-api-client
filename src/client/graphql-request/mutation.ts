import Helper from '../../helper';
import { IGraphQLParam } from '../../interfaces';
import { GraphQLField } from '../../types';
import GraphQLRequest from './index';

class GraphQLMutationRequest extends GraphQLRequest {
  constructor(
    mutationName: string,
    mutationParameters: IGraphQLParam[],
    queryFields: GraphQLField[],
    mutationValues: { [key: string]: any } = {},
  ) {
    if (!Array.isArray(mutationParameters)) {
      throw new Error('Mutation must provide parameters');
    }

    if (!Helper.isObject(mutationValues)) {
      throw new Error('Mutation values must be a map of field/value');
    }

    super(mutationName, mutationParameters, queryFields, mutationValues);
    return this;
  }

  public generateHeader(): string {
    let queryString = 'mutation';
    if (this.requestParams.length) {
      const headerParams = this.requestParams.map(this.generateHeaderField.bind(this));
      queryString += `(${headerParams})`;
    }

    queryString += '{';
    return queryString;
  }

  public generateFragment(): string {
    let fragmentField = this.requestName;
    if (this.requestParams.length) {
      const fragmentParams = this.requestParams.map(this.generateFragmentField.bind(this));
      fragmentField += `(${fragmentParams})`;
    }

    fragmentField += '{';

    return fragmentField;
  }

  public generateBody(): string {
    return this.resultFields.map(this.generateQueryField.bind(this)).join(' ');
  }
}

export default GraphQLMutationRequest;
