import { Middleware, ParameterizedContext } from "koa";
import { HealthService } from "../services";

export class HealthController {
    constructor(private service: HealthService = new HealthService()){}

    getHealth: Middleware = (ctx: ParameterizedContext) => {
        ctx.body = this.service.getHealth();
    }
}
