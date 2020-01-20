import GraphQLRequest from "./index";
import {GraphQLParam} from "../../interfaces/graphql-param";

class GraphQLQueryRequest extends GraphQLRequest {
    constructor(queryName: string,
                queryParameters: [GraphQLParam],
                queryFields: [string],
                queryValues: { [name: string]: any }
    ) {
        super(queryName, queryParameters, queryFields, queryValues);
        return this;
    }

    generateHeader(): string {
        let queryString = 'query';
        if (this.requestParams.length) {
            const headerParams = this.requestParams.map(this.generateHeaderField.bind(this));
            queryString += `(${headerParams})`
        }

        queryString += '{';
        return queryString;
    }

    generateFragment(): string {
        let fragmentField = this.requestName;
        if (this.requestParams.length) {
            const fragmentParams = this.requestParams.map(this.generateFragmentField.bind(this));
            fragmentField += `(${fragmentParams})`;
        }

        fragmentField += '{';

        return fragmentField;
    }

    generateBody(): string {
        return this.resultFields.map(this.generateQueryField.bind(this)).join(' ');
    }
}

export default GraphQLQueryRequest;
