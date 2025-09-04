import { Middleware, ParameterizedContext } from "koa";
import { ExampleService } from "../services";

export class ExampleController {
    constructor(private service: ExampleService = new ExampleService()){}

    postExample: Middleware = (ctx: ParameterizedContext) => {
        const { value } = ctx.request.body;
        ctx.body = this.service.postExample(value);
    }
}
