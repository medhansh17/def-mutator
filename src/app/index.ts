import { AppConfig } from "../config";
import { ENodeErrorType, ENodeSignal } from "../enums";
import { AppServer } from "../server";

export class App {
    public async start(): Promise<void>{
        const appConfig = new AppConfig();
        const server = new AppServer(appConfig.getConfig());

    server.start();

        this._handleNodeSignals(server);
        this._handleNodeErrorTypes(server);
    }

    private _handleNodeSignals(server: AppServer): void{
        const signals: ENodeSignal[] = Object.values(ENodeSignal);
        signals.forEach((signal: ENodeSignal) => {
            process.on(signal, async () => {
                server.close();
            });
        });
    }

    private _handleNodeErrorTypes(server: AppServer): void{
        const errorTypes: ENodeErrorType[] = Object.values(ENodeErrorType);
        errorTypes.map((type) => {
            process.on(type, async (e) => {
                try {
                    console.log(`Error in process.on ${type}`)
                    console.error(e)
                    server.close()
                    process.exit(0)
                } catch (_) {
                    process.exit(1)
                }
            })
        })
    }
}