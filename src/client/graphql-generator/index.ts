/* tslint:disable:variable-name */
import { isEmpty, isObject, set } from "lodash";
import { GraphQLOperationType } from "../../enums";
import { IGraphQLParam } from "../../interfaces";
import { GraphQLRequest } from "../graphql-request";

export class GraphQLGenerator {
  get parameters(): { [p: string]: string } {
    return this._parameters;
  }

  get values(): { [p: string]: any } {
    return this._values;
  }

  public static generateWrapper(operationType: string, params: { [p: string]: string }): string {
    let queryString = operationType;
    if (Object.keys(params).length) {
      const headerParams: string = Object.keys(params)
        .map((key: string) => {
          return `$${key}:${params[key]}`;
        })
        .join(",");
      queryString += `(${headerParams})`;
    }

    return queryString;
  }

  public static generateFragment(name: string, params: IGraphQLParam[], fields: string[]): string {
    return [GraphQLGenerator.generateHeader(name, params), GraphQLGenerator.generateFields(fields)].join("");
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
    if (!fields.length) return "";

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
    return GraphQLGenerator.generateFragment(request.requestName, request.requestParams, request.resultFields);
  }

  private readonly requests: GraphQLRequest[];
  private readonly operationType: GraphQLOperationType;
  private readonly _parameters: { [p: string]: string };
  private readonly _values: { [p: string]: any };

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

    return this;
  }

  public generateQueryString(): string {
    const queryWrapper = GraphQLGenerator.generateWrapper(this.operationType, this._parameters);
    const queryFragments = this.requests.map(GraphQLGenerator.generateRequestQuery).join(" ");

    return `${queryWrapper}{${queryFragments}}`;
  }

  public generateQueryValues(): { [p: string]: any } {
    return Object.keys(this._values).reduce((obj: { [p: string]: any }, key: string) => {
      obj[key] = this._values[key];
      return obj;
    }, {});
  }

  private collectRequestParameters(): { [p: string]: string } {
    return this.requests.reduce((obj: { [p: string]: string }, request: GraphQLRequest) => {
      request.requestParams
        .map(p => {
          return {
            name: GraphQLGenerator.getParamQueryName(p),
            type: p.type
          };
        })
        .forEach(item => {
          if (obj.hasOwnProperty(item.name)) {
            const itemType: string | undefined = obj[item.name];
            if (itemType !== item.type) {
              throw new Error(
                `Param ${item.name} can't be duplicated with a different type. current type: ${itemType}, trying to set: ${item.type}`
              );
            }
          } else {
            obj[item.name] = item.type;
          }
        });
      return obj;
    }, {});
  }

  private collectRequestValues(): { [p: string]: any } {
    return this.requests.reduce((obj: { [p: string]: any }, request: GraphQLRequest) => {
      const values = request.requestValues;
      if (!isEmpty(values)) {
        Object.keys(values).forEach((key: string) => {
          if (!obj.hasOwnProperty(key)) {
            obj[key] = values[key];
          }
        });
      }

      return obj;
    }, {});
  }
}
