import GraphqlMutationGenerator from 'graphql-request-generator/lib/src/generator/graphql-mutation.generator';
import GraphqlQueryGenerator from 'graphql-request-generator/lib/src/generator/graphql-query.generator';
import { GraphQLRequestType } from '../types/GraphQLRequestType';

class GeneratorFactory {
  public static getGenerator(requestType: GraphQLRequestType) {
    switch (requestType) {
      case 'mutation':
        return new GraphqlMutationGenerator();
      case 'query':
        return new GraphqlQueryGenerator();
      default:
        throw new Error(`Unknown request type: ${requestType}`);
    }
  }
}

export default GeneratorFactory;
