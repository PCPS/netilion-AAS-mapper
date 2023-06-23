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
    private aas_repo: string;
    private sm_repo: string;
    public constructor() {
        this.aas_repo = process.env.OI4_AAS_REPO_SUBDIR || 'aas-repo';
        this.sm_repo = process.env.OI4_SM_REPO_SUBDIR || 'sm-repo';
        const apiConfig: CreateAxiosDefaults = {
            baseURL: process.env.OI4_REPO_API_URL,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
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
        return this.api.get('/' + this.aas_repo + '/shells');
    }

    public getShell<T = any, R = AxiosResponse<T>>(aas_id: string): Promise<R> {
        return this.api.get('/' + this.aas_repo + '/shells/' + aas_id);
    }

    public postShell<T = any, R = AxiosResponse<T>>(
        shell: AssetAdministrationShell
    ): Promise<R> {
        return this.api.post('/' + this.aas_repo + '/shells', shell);
    }

    public updateShell<T = any, R = AxiosResponse<T>>(
        shell: AssetAdministrationShell
    ): Promise<R> {
        return this.api.put(
            '/' + this.aas_repo + '/shells/' + makeBase64(shell.id),
            shell
        );
    }

    public getAllSubmodels<T = any, R = AxiosResponse<T>>(
        page: number = 1
    ): Promise<R> {
        return this.api.get('/' + this.sm_repo + '/submodels');
    }

    public getSubmodel<T = any, R = AxiosResponse<T>>(
        submodel_id: string
    ): Promise<R> {
        return this.api.get('/' + this.sm_repo + '/submodels/' + submodel_id);
    }

    public postSubmodel<T = any, R = AxiosResponse<T>>(
        submodel: Submodel
    ): Promise<R> {
        return this.api.post('/' + this.sm_repo + '/submodels', submodel);
    }

    public updateSubmodel<T = any, R = AxiosResponse<T>>(
        submodel: Submodel
    ): Promise<R> {
        return this.api.put(
            '/' + this.sm_repo + '/submodels/' + makeBase64(submodel.id),
            submodel
        );
    }
}
