import GraphQLQueryRequest from "../client/graphql-request/query";

const request = GraphQLQueryRequest;

describe("it should correctly generate GraphQL queries", () => {
  it("should generate a simple query", () => {
    const r = new request([
      "test"
    ], [
      [{ name: "foo", type: "bar" }]
    ], [
      ["id"]
    ], {
      foo: "abc"
    });

    const query = r.generate(false);

    expect(query).toBe("query($foo:bar){test(foo:$foo){ id }}");
  });

  it("should generate a multiple query", () => {
    const r = new request([
      "test", "test2"
    ], [
      [{ name: "foo", type: "bar" }],
      [{ name: "foo", type: "bar" }]
    ], [
      ["id"],
      ["name"],
    ], {
      foo: "abc"
    });

    const query = r.generate(false);

    expect(query).toBe("query($foo:bar,$foo:bar){test(foo:$foo){ id }test2(foo:$foo){ name }}");
  });
});
