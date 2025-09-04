import { Middleware, Next, ParameterizedContext } from "koa";
import { EHttpStatus } from "../../enums";

export class ErrorHandler {
    handle: Middleware = async (ctx: ParameterizedContext, next: Next) => {
        try {
            await next();
        } catch (error) {
            const { statusCode, message } = error as any;
            ctx.status = statusCode ? statusCode : EHttpStatus.INTERNAL_SERVER_ERROR;
            ctx.body = {
                statusCode: ctx.status,
                message: message || 'INTERNAL_SERVER_ERROR',
                error: error ? JSON.stringify(error) : {},
            };
        }
    }
}
