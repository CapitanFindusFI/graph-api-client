import { isObject, set } from "lodash";
import { IGraphQLParam } from "../../interfaces";

export class GraphQLGenerator {

  public static generateWrapper(operationType: string, params: IGraphQLParam[]): string {
    let queryString = operationType;
    if (params.length) {
      const headerParams: string = params.map(GraphQLGenerator.generateWrapperItem.bind(this)).join(",");
      queryString += `(${headerParams})`;
    }

    return queryString;
  }

  public static generateFragment(name: string, params: IGraphQLParam[], fields: string[]): string {
    return [
      GraphQLGenerator.generateHeader(name, params),
      GraphQLGenerator.generateFields(fields)
    ].join("");
  }

  public static generateHeader(name: string, params: IGraphQLParam[]): string {
    let headerParams = "";
    if (params.length) {
      const queryString = params.map((param: IGraphQLParam) => {
        const fieldName = GraphQLGenerator.getParamQueryName(param);
        return [fieldName, `$${fieldName}`].join(":");
      });

      headerParams = `(${queryString})`;
    }

    return `${name}${headerParams}`;
  }

  public static generateFields(fields: string[]): string {
    const queryObject = {};
    fields.map((field: string) => set(queryObject, field, true));

    const unwrapItem = (item: any): string[] => {
      let unwrappedQuery: string[] = [];
      Object.keys(item).forEach((key: string) => {
        const itemValue: any = item[key];
        if (isObject(itemValue)) {
          unwrappedQuery = unwrappedQuery.concat(key, "{", unwrapItem(itemValue), "}");
        } else {
          unwrappedQuery.push(key);
        }
      });
      return unwrappedQuery;
    };

    const queryStrings = ["{", ...unwrapItem(queryObject), "}"];
    return queryStrings.join(" ");
  }

  private static generateWrapperItem(param: IGraphQLParam) {
    const fieldName = `$${GraphQLGenerator.getParamQueryName(param)}`;

    if (!param.type) {
      throw new Error(`Header param: ${param.name} is missing its type`);
    }

    const fieldType = param.isArray ? `[${param.type}]` : param.type;

    return [fieldName, fieldType].join(":");
  }

  private static getParamQueryName(param: IGraphQLParam): string {
    if (!param.name) {
      throw new Error("GraphQL param is missing its name");
    }

    let paramName;
    if (param.alias) {
      const paramString = param.alias.split("$");
      paramName = paramString[paramString.length - 1];
    } else {
      paramName = `${param.name}`;
    }

    return paramName;
  }
}
