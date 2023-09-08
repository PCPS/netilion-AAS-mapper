import https from 'https';
import axios, {
    AxiosError,
    AxiosResponse,
    CreateAxiosDefaults,
    AxiosInstance
} from 'axios';
import { logger } from './logger';
import {
    AssetAdministrationShell,
    Submodel
} from '../oi4_definitions/aas_components';

if (process.env.NODE_ENV !== 'production') {
    const dotenv = require('dotenv');
    // Use dev dependency
    dotenv.config();
}

const makeBase64 = (str: string, encodeing: BufferEncoding = 'utf8') => {
    const buffer = Buffer.from(str, encodeing);
    return buffer.toString('base64');
};

export class OI4Client {
    private api: AxiosInstance;
    public constructor() {
        const apiConfig: CreateAxiosDefaults = {
            baseURL: process.env.OI4_REPO_API_URL,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: process.env.OI4_REPO_AUTH_TOKEN
            },
            // TODO: REMOVE THE FOLLOWING HACK
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        };
        this.api = axios.create(apiConfig);
        this.api.interceptors.request.use((config) => {
            logger.info(
                `request ready with URL[${config.baseURL! + config.url!}]`
            );
            return config;
        });
        this.api.interceptors.response.use(
            (res) => res,
            (error: AxiosError) => {
                const { data, status } = error.response!;
                switch (status) {
                    //TODO: make this logs with logger and display more relevant information
                    case 400:
                        console.error(error);
                        break;

                    case 401:
                        console.error('unauthorised');
                        break;

                    case 404:
                        console.error('/not-found');
                        break;

                    case 409:
                        console.error('/conflict');
                        break;

                    case 500:
                        console.error('/server-error');
                        break;
                }
                return Promise.reject(error);
            }
        );
    }

    public getAllShells<T = any, R = AxiosResponse<T>>(
        page: number = 1
    ): Promise<R> {
        return this.api.get('/shells');
    }

    public getShell<T = any, R = AxiosResponse<T>>(aas_id: string): Promise<R> {
        return this.api.get('/shells/' + aas_id);
    }

    public deleteShell<T = any, R = AxiosResponse<T>>(
        aas_id: string
    ): Promise<R> {
        return this.api.delete('/shells/' + aas_id);
    }

    public postShell<T = any, R = AxiosResponse<T>>(
        shell: AssetAdministrationShell
    ): Promise<R> {
        return this.api.post('/shells', shell);
    }

    public updateShell<T = any, R = AxiosResponse<T>>(
        shell: AssetAdministrationShell
    ): Promise<R> {
        return this.api.put('/shells/' + makeBase64(shell.id), shell);
    }

    public getAllSubmodels<T = any, R = AxiosResponse<T>>(
        page: number = 1
    ): Promise<R> {
        return this.api.get('/submodels');
    }

    public getSubmodel<T = any, R = AxiosResponse<T>>(
        submodel_id: string
    ): Promise<R> {
        return this.api.get('/submodels/' + submodel_id);
    }

    public deleteSubmodel<T = any, R = AxiosResponse<T>>(
        submodel_id: string
    ): Promise<R> {
        return this.api.delete('/submodels/' + submodel_id);
    }

    public postSubmodel<T = any, R = AxiosResponse<T>>(
        submodel: Submodel
    ): Promise<R> {
        return this.api.post('/submodels', submodel);
    }

    public updateSubmodel<T = any, R = AxiosResponse<T>>(
        submodel: Submodel
    ): Promise<R> {
        return this.api.put('/submodels/' + makeBase64(submodel.id), submodel);
    }
}
