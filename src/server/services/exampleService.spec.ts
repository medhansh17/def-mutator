import { ExampleService } from "./exampleService";

describe("ExampleService", () => {
  let service: ExampleService;

  beforeEach(() => {
    service = new ExampleService();
  });

  it("should return the provided parameter when valid", () => {
    const param = "EXAMPLE_TEST";
    const result = service.postExample(param);
    expect(result).toEqual(param);
  });

  it("should return DEFAULT when no parameter provided", () => {
    const result = service.postExample();
    expect(result).toEqual("DEFAULT");
  });

  it("should handle empty string parameter", () => {
    const result = service.postExample("");
    expect(result).toEqual("DEFAULT");
  });
});
