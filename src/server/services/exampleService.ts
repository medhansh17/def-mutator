export class ExampleService {
  public postExample(value?: string): string {
    if (!value) {
      return "DEFAULT";
    }
    return value;
  }
}

export const exampleService = new ExampleService();
