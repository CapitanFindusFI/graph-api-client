import { isObject, set } from "lodash";
import { GraphQLOperationType } from "../../enums";
import { IGraphQLParam } from "../../interfaces";
import { GraphQLRequest } from "../graphql-request";

export class GraphQLGenerator {
  get parameters(): Map<string, string> {
    return this._parameters;
  }

  get values(): Map<string, any> {
    return this._values;
  }

  public static generateWrapper(operationType: string, params: Map<string, string>): string {
    let queryString = operationType;
    if (params.size) {
      const headerParams: string = Array.from(params.entries()).map(([key, type]) => {
        return `$${key}:${type}`;
      }).join(",");
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
    const queryObject = fields.reduce((object, field: string) => {
      set(object, field, true);
      return object;
    }, {});

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

  private static generateRequestQuery(request: GraphQLRequest): string {
    return GraphQLGenerator.generateFragment(
      request.requestName,
      request.requestParams,
      request.resultFields
    );
  }

  private readonly requests: GraphQLRequest[];
  private readonly operationType: GraphQLOperationType;
  private readonly _parameters: Map<string, string>;
  private readonly _values: Map<string, any>;

  constructor(operationType: GraphQLOperationType, ...requests: GraphQLRequest[]) {
    if (!operationType) {
      throw new Error("No operation type provided");
    }
    if (!requests.length) {
      throw new Error("No requests provided");
    }

    this.operationType = operationType;
    this.requests = requests;

    this._parameters = this.collectRequestParameters();
    this._values = this.collectRequestValues();
  }

  public generateQueryString(): string {
    const queryWrapper = GraphQLGenerator.generateWrapper(this.operationType, this._parameters);
    const queryFragments = this.requests.map(GraphQLGenerator.generateRequestQuery).join(" ");

    return `${queryWrapper}{${queryFragments}}`;
  }

  private collectRequestParameters(): Map<string, string> {
    return this.requests.reduce((map: Map<string, string>, request: GraphQLRequest) => {
      request.requestParams.map(p => {
        return {
          name: GraphQLGenerator.getParamQueryName(p),
          type: p.type
        };
      }).forEach((item) => {
        if (map.has(item.name)) {
          const itemType: string | undefined = map.get(item.name);
          if (itemType !== item.type) {
            throw new Error(`Param ${item.name} can't be duplicated with a different type. current type: ${itemType}, trying to set: ${item.type}`);
          }
        } else {
          map.set(item.name, item.type);
        }
      });
      return map;
    }, new Map<string, string>());
  }

  private collectRequestValues(): Map<string, any> {
    return this.requests.reduce((map: Map<string, any>, request: GraphQLRequest) => {
      const values: Map<string, any> = request.requestValues;
      Array.from(values.keys()).forEach((key: string) => {
        if (!map.has(key)) {
          map.set(key, values.get(key));
        }
      });

      return map;
    }, new Map<string, any>());
  }
}
