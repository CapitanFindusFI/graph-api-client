import GraphQLQueryRequest from "../client/graphql-request/query";

const queryRequest = GraphQLQueryRequest;

describe("it should correctly generate GraphQL queries", () => {
  it("should generate a simple query", () => {
    const r = new queryRequest([
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
    const r = new queryRequest([
      "test", "test2"
    ], [
      [{ name: "foo", type: "bar" }],
      [{ name: "bar", type: "baz" }]
    ], [
      ["id"],
      ["name"]
    ], {
      bar: "def",
      foo: "abc"
    });

    const query = r.generate(false);

    expect(query).toBe("query($foo:bar,$bar:baz){test(foo:$foo){ id }test2(bar:$bar){ name }}");
  });

  it("should throw an error for duplicate parameters", () => {
    expect(() => {
      const r = new queryRequest([
        "test", "test2"
      ], [
        [{ name: "foo", type: "bar" }],
        [{ name: "foo", type: "baz" }]
      ], [
        ["id"],
        ["name"]
      ], {
        bar: "def",
        foo: "abc"
      });
    }).toThrowError();
  });
});
