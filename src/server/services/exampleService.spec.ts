import { ExampleService } from "./exampleService"

describe('Example Service', () => {
    let service: ExampleService;

    beforeEach(() => {
        service = new ExampleService();
    });

    it('send valid parameter', () => {
        const param = 'EXAMPLE_TEST';

        const result = service.postExample(param);

        expect(result).toEqual(param);
    });

    it('send invalid parameter', () => {
        const result = service.postExample();

        expect(result).toEqual('DEFAULT');
    });
})
