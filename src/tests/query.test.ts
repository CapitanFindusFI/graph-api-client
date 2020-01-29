import { GraphAPIClient } from "../client";
import GraphQLQueryRequest from "../client/graphql-request/query";

const graphClient = new GraphAPIClient();
const queryRequest = GraphQLQueryRequest;

describe("it should correctly generate GraphQL request bodies", () => {
  it("should generate a simple query", () => {
    const r = new queryRequest("test", ["id", "name"]);
    const { query, variables } = graphClient.collectRequestBody(r);

    expect(query).toBe("test{ id name }");
    expect(variables).toEqual(new Map());
  });

  it("should generate a simple query with parameters", () => {
    const values = new Map<string, any>();
    values.set("foo", "123");
    const r = new queryRequest("test", ["id", "name"], [{
      name: "foo",
      type: "bar"
    }], values);

    const { query, variables } = graphClient.collectRequestBody(r);
    expect(query).toBe("($foo: bar){ test(foo:$foo){ id name }}");
  });
});
