import Router from "koa-router";
import { ExampleController, HealthController } from "../controllers";
import { EEndpoint } from "./enum";

export class AppRouter {
    loadRoutes = (router: Router): Router => {
        const healthCtrl = new HealthController();
        const exampleCtrl = new ExampleController();

        router.get(EEndpoint.Health, healthCtrl.getHealth);
        router.post(EEndpoint.Example, exampleCtrl.postExample);

        return router;
    }
}
