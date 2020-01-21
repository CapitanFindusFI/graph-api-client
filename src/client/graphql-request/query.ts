import { IGraphQLParam } from '../../interfaces';
import { GraphQLField } from '../../types';
import { GraphQLRequest } from './index';

class GraphQLQueryRequest extends GraphQLRequest {
  constructor(
    queryName: string,
    queryParameters: IGraphQLParam[],
    queryFields: GraphQLField[],
    queryValues: { [key: string]: any } = {},
  ) {
    super(queryName, queryParameters, queryFields, queryValues);
    return this;
  }

  public generateHeader(): string {
    let queryString = 'query';
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

export default GraphQLQueryRequest;
