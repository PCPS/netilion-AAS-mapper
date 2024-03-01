import https from 'https';
import axios, {
    AxiosError,
    AxiosResponse,
    CreateAxiosDefaults,
    AxiosInstance
} from 'axios';
import { logger } from '../services/logger';
import {
    AssetAdministrationShell,
    Submodel
} from '../oi4_definitions/aas_components';
import { makeBase64 } from '../oi4_definitions/oi4_helpers';

if (process.env.NODE_ENV !== 'production') {
    const dotenv = require('dotenv');
    // Use dev dependency
    dotenv.config();
}

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
                    case 400:
                        logger.error(
                            error.request.method +
                                ' request with path ' +
                                error.request.path +
                                ' failed: bad request'
                        );
                        break;

                    case 401:
                        logger.error(
                            error.request.method +
                                ' request with path ' +
                                error.request.path +
                                ' failed: unauthorised'
                        );
                        break;

                    case 404:
                        logger.error(
                            error.request.method +
                                ' request with path ' +
                                error.request.path +
                                ' failed: not found'
                        );
                        break;

                    case 409:
                        logger.error(
                            error.request.method +
                                ' request with path ' +
                                error.request.path +
                                ' failed: conflict'
                        );
                        break;

                    case 500:
                        logger.error(
                            error.request.method +
                                ' request with path ' +
                                error.request.path +
                                ' failed: server error'
                        );
                        break;
                }
                return Promise.reject(error);
            }
        );
    }

    public getAllShells<T = any, R = AxiosResponse<T>>(
        cursor: string = ''
    ): Promise<R> {
        const cursor_url_ext = cursor ? '?cursor=' + cursor : '';
        return this.api.get('/shells' + cursor_url_ext);
    }

    public getShell<T = any, R = AxiosResponse<T>>(aas_id: string): Promise<R> {
        return this.api.get('/shells/' + makeBase64(aas_id));
    }

    public deleteShell<T = any, R = AxiosResponse<T>>(
        aas_id: string
    ): Promise<R> {
        return this.api.delete('/shells/' + makeBase64(aas_id));
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
        aas_id: string,
        cursor: string = ''
    ): Promise<R> {
        const cursor_url_ext = cursor ? '?cursor=' + cursor : '';
        return this.api.get(
            '/shells/' + makeBase64(aas_id) + '/submodels' + cursor_url_ext
        );
    }

    public getSubmodel<T = any, R = AxiosResponse<T>>(
        aas_id: string,
        submodel_id: string
    ): Promise<R> {
        return this.api.get(
            '/shells/' +
                makeBase64(aas_id) +
                '/submodels/' +
                makeBase64(submodel_id)
        );
    }

    public deleteSubmodel<T = any, R = AxiosResponse<T>>(
        aas_id: string,
        submodel_id: string
    ): Promise<R> {
        return this.api.delete(
            '/shells/' +
                makeBase64(aas_id) +
                '/submodels/' +
                makeBase64(submodel_id)
        );
    }

    public postSubmodel<T = any, R = AxiosResponse<T>>(
        aas_id: string,
        submodel: Submodel
    ): Promise<R> {
        return this.api.post(
            '/shells/' + makeBase64(aas_id) + '/submodels',
            submodel
        );
    }

    public updateSubmodel<T = any, R = AxiosResponse<T>>(
        aas_id: string,
        submodel: Submodel
    ): Promise<R> {
        return this.api.put(
            '/shells/' +
                makeBase64(aas_id) +
                '/submodels/' +
                makeBase64(submodel.id),
            submodel
        );
    }

    public direct<T = any, R = AxiosResponse<T>>(
        query: string,
        params: Record<string, any>
    ): Promise<R> {
        return axios.get(query + '?' + new URLSearchParams(params), {
            baseURL: process.env.OI4_REPO_API_URL,
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*',
                Authorization: process.env.OI4_REPO_AUTH_TOKEN
            },
            responseType: 'arraybuffer',
            // TODO: REMOVE THE FOLLOWING HACK
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        });
    }
}
