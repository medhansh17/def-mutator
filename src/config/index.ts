import dotenv from 'dotenv';
import Joi from 'joi';
import { EEnvironment } from '../enums';
import { IConfigParam, IEnvironmentParam } from './interfaces';

dotenv.config();

export class AppConfig {
    private config: IConfigParam | undefined;
    private readonly DEFAULT_PORT = 3000;

    constructor(){
        this._setUp();
    }
    
    public getConfig(): IConfigParam{
        if(!this.config){
            throw new Error();
        }
        return this.config;
    }

    private _setUp(): void{
        const appConfig = Joi.object<IEnvironmentParam>({
            ENVIRONMENT: Joi.string().valid(...Object.values(EEnvironment)).required(),
            PORT: Joi.number().default(this.DEFAULT_PORT),
        });

        const { value, error } = appConfig.validate(process.env, { allowUnknown: true });

        if (error){
            throw Error();
        }

        this.config = {
            environment: value.ENVIRONMENT,
            port: value.PORT
        } as IConfigParam
    }
}