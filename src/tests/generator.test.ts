import { GraphQLGenerator } from "../client/graphql-generator";

describe("it should correctly generate graphQL parts", () => {
  it("should correctly generate a simple query wrapper", () => {
    const generated = GraphQLGenerator.generateWrapper(
      "foo", []
    );
    expect(generated).toBe("foo");
  });

  it("should correctly generate a query wrapper with a parameter", () => {
    const generated = GraphQLGenerator.generateWrapper(
      "foo", [
        { name: "foo", type: "Bar" }
      ]
    );

    expect(generated).toBe("foo($foo:Bar)");
  });

  it("should correctly generate a query wrapper with a parameter alias", () => {
    const generated = GraphQLGenerator.generateWrapper(
      "foo", [
        { name: "foo", type: "Bar", alias: "bar" }
      ]
    );

    expect(generated).toBe("foo($bar:Bar)");
  });

  it("should correctly generate a query wrapper with multiple parameters", () => {
    const generated = GraphQLGenerator.generateWrapper(
      "foo", [
        { name: "foo", type: "Bar" },
        { name: "bar", type: "Baz" }
      ]
    );

    expect(generated).toBe("foo($foo:Bar,$bar:Baz)");
  });

  it("should correctly generate a query wrapper with multiple parameters and aliases", () => {
    const generated = GraphQLGenerator.generateWrapper(
      "foo", [
        { name: "foo", type: "Bar", alias: "zed" },
        { name: "bar", type: "Baz", alias: "asd" }
      ]
    );

    expect(generated).toBe("foo($zed:Bar,$asd:Baz)");
  });

  it("should correctly generate a query header", () => {
    const generated = GraphQLGenerator.generateHeader(
      "test", []
    );
    expect(generated).toBe("test");
  });

  it("should correctly generate a query header with a single param", () => {
    const generated = GraphQLGenerator.generateHeader(
      "test", [
        { name: "foo", type: "Bar" }
      ]
    );
    expect(generated).toBe("test(foo:$foo)");
  });

  it("should correctly generate a query header with multiple params", () => {
    const generated = GraphQLGenerator.generateHeader(
      "test", [
        { name: "foo", type: "Bar" },
        { name: "bar", type: "Baz" }
      ]
    );

    expect(generated).toBe("test(foo:$foo,bar:$bar)");
  });

  it("should correctly generate a query header with multiple params", () => {
    const generated = GraphQLGenerator.generateHeader(
      "test", [
        { name: "foo", type: "Bar" },
        { name: "bar", type: "Bar" },
        { name: "baz", type: "Bar" }
      ]
    );

    expect(generated).toBe("test(foo:$foo,bar:$bar,baz:$baz)");
  });

  it("should correctly generate a query fragment body", () => {
    const generated = GraphQLGenerator.generateFields([
      "id"
    ]);

    expect(generated).toBe("{ id }");
  });

  it("should correctly generate a query fragment body with nested fields", () => {
    const generated = GraphQLGenerator.generateFields([
      "id", "user.name", "user.surname"
    ]);

    expect(generated).toBe("{ id user { name surname } }");
  });

  it("should correctly generate a query fragment body with unordered nested fields", () => {
    const generated = GraphQLGenerator.generateFields([
      "id", "user.name", "country.id", "user.surname"
    ]);

    expect(generated).toBe("{ id user { name surname } country { id } }");
  });

  it("should correctly generate a query", () => {
    const generated = GraphQLGenerator.generateFragment(
      "test", [], ["id"]
    );

    expect(generated).toBe("test{ id }");
  });

  it("should correctly generate a query with a single param", () => {
    const generated = GraphQLGenerator.generateFragment(
      "test", [
        { name: "foo", type: "Bar" }
      ], ["id"]
    );

    expect(generated).toBe("test(foo:$foo){ id }");
  });

  it("should correctly generate a query with a single param and nested fields", () => {
    const generated = GraphQLGenerator.generateFragment(
      "test", [
        { name: "foo", type: "Bar" }
      ], ["id", "user.name", "user.surname"]
    );

    expect(generated).toBe("test(foo:$foo){ id user { name surname } }");
  });

  it("should correctly generate a query with multiple params and nested fields", () => {
    const generated = GraphQLGenerator.generateFragment(
      "test", [
        { name: "foo", type: "Bar" },
        { name: "bar", type: "Bar" }
      ], ["id", "user.name", "user.surname"]
    );

    expect(generated).toBe("test(foo:$foo,bar:$bar){ id user { name surname } }");
  });
});
