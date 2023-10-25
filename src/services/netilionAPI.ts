import axios, {
    AxiosError,
    AxiosResponse,
    CreateAxiosDefaults,
    AxiosInstance
} from 'axios';
import { logger } from './logger';
import { makeBase64 } from './oi4_helpers';
import { AuthType, OAUTH_TOKEN, OAUTH_REQUEST_BODY } from '../interfaces/Auth';

if (process.env.NODE_ENV !== 'production') {
    const dotenv = require('dotenv');
    // Use dev dependency
    dotenv.config();
}

class AutoAuthToken implements OAUTH_TOKEN {
    access_token: string;
    token_type: AuthType;
    expires_in?: number;
    refresh_token?: string;
    created_at?: number;
    public constructor() {
        switch (process.env.NETILION_AUTH_TYPE) {
            case 'Basic':
                this.token_type = 'Basic';
                this.access_token = makeBase64(
                    process.env.NETILION_USERNAME +
                        ':' +
                        process.env.NETILION_PASSWORD
                );
                logger.info(
                    `Basic token generatad form usr: ${process.env.NETILION_USERNAME}, \
                    pwd: ${process.env.NETILION_PASSWORD} with value [ ${this.access_token} ]`
                );
                break;
            case 'Bearer':
                this.token_type = 'Bearer';
                this.access_token = '';
                this.requestOAuth2({
                    client_id:
                        process.env.NETILION_API_KEY ||
                        'ERROR_NETILION_API_KEY_UNDEFINED',
                    client_secret:
                        process.env.NETILION_SECRET ||
                        'ERROR_NETILION_SECRET_UNDEFINED',
                    grant_type: 'password',
                    username:
                        process.env.NETILION_USERNAME ||
                        'ERROR_NETILION_USERNAME_UNDEFINED',
                    password:
                        process.env.NETILION_PASSWORD ||
                        'ERROR_NETILION_PASSWORD_UNDEFINED'
                });
                break;
            default:
                this.token_type = 'Basic';
                this.access_token = 'ERROR_NETILION_AUTH_TYPE_UNDEFINED';
                logger.error(
                    'AUTHTYPE [' +
                        process.env.NETILION_AUTH_TYPE +
                        '] is not supported.'
                );
                break;
        }
    }
    private async requestOAuth2(body: OAUTH_REQUEST_BODY) {
        if (process.env.NETILION_AUTH_SERVER !== undefined) {
            try {
                const resp = await axios.post(
                    process.env.NETILION_AUTH_SERVER,
                    body,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json'
                        }
                    }
                );
                const data: OAUTH_TOKEN = await resp.data;
                this.access_token = data.access_token;
                this.token_type = data.token_type;
                this.expires_in = data.expires_in;
                this.refresh_token = data.refresh_token;
                this.created_at = data.created_at;
                logger.info('Auth value retrieved for <add user info here>');
                const time_to_next_req =
                    (data.expires_in || 0) * 1000 -
                    (Date.now() - (data.created_at || 0) * 1000 + 2000);
                setTimeout(() => {
                    this.requestOAuth2({
                        client_id: body.client_id,
                        client_secret: body.client_secret,
                        grant_type: 'refresh_token',
                        refresh_token:
                            data.refresh_token || 'ERROR_MISSING_REFRESH_TOKEN'
                    });
                }, time_to_next_req);
            } catch (error: any) {
                if (error.response) {
                    logger.error(
                        'Authentication error ' +
                            error.response.status +
                            ': ' +
                            error.response.data.error_description
                    );
                } else {
                    logger.error(
                        'Unknown error while Authenticating: ' + error
                    );
                }
            }
        } else logger.error('NETILION_AUTH_SERVER not defined.');
    }
}

const token =
    process.env.MAPPER_AUTH_MODE === 'INTERNAL'
        ? new AutoAuthToken()
        : undefined;

export class NetelionClient {
    private token: OAUTH_TOKEN;
    private api: AxiosInstance;
    public constructor() {
        this.token = token || { access_token: '', token_type: 'Bearer' };
        const apiConfig: CreateAxiosDefaults = {
            baseURL: process.env.NETILION_API_URL,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Api-Key': process.env.NETILION_API_KEY
            }
        };
        this.api = axios.create(apiConfig);
        this.api.interceptors.request.use((config) => {
            logger.info(
                `request ready with URL[${
                    config.baseURL! + config.url!
                }] and headers[${config.headers}]`
            );
            return config;
        });
        this.api.interceptors.response.use(
            (res) => res,
            (error: AxiosError) => {
                const { data, status, config } = error.response!;
                switch (status) {
                    //TODO: make this logs with logger and display more relevant information
                    case 400:
                        console.error(data);
                        break;

                    case 401:
                        console.error('unauthorised');
                        break;

                    case 404:
                        console.error('/not-found');
                        break;

                    case 500:
                        console.error('/server-error');
                        break;
                }
                return Promise.reject(error);
            }
        );
    }

    public getVDICategories<T = any, R = AxiosResponse<T>>(
        auth: OAUTH_TOKEN,
        page: number = 1
    ): Promise<R> {
        return this.api.get(
            '/document/categories?page=' + page + '&standard_id=1',
            token
                ? {
                      headers: {
                          Authorization:
                              token.token_type + ' ' + token.access_token
                      }
                  }
                : {
                      headers: {
                          Authorization:
                              auth.token_type + ' ' + auth.access_token
                      }
                  }
        );
    }

    public getAllAssets<T = any, R = AxiosResponse<T>>(
        auth: OAUTH_TOKEN,
        page: number = 1
    ): Promise<R> {
        return this.api.get(
            '/assets?page=' + page,
            token
                ? {
                      headers: {
                          Authorization:
                              token.token_type + ' ' + token.access_token
                      }
                  }
                : {
                      headers: {
                          Authorization:
                              auth.token_type + ' ' + auth.access_token
                      }
                  }
        );
    }

    public getAsset<T = any, R = AxiosResponse<T>>(
        auth: OAUTH_TOKEN,
        asset_id: string
    ): Promise<R> {
        return this.api.get(
            '/assets/' + asset_id,
            token
                ? {
                      headers: {
                          Authorization:
                              token.token_type + ' ' + token.access_token
                      }
                  }
                : {
                      headers: {
                          Authorization:
                              auth.token_type + ' ' + auth.access_token
                      }
                  }
        );
    }

    public getAssetSpecs<T = any, R = AxiosResponse<T>>(
        auth: OAUTH_TOKEN,
        asset_id: string
    ): Promise<R> {
        return this.api.get(
            '/assets/' + asset_id + '/specifications',
            token
                ? {
                      headers: {
                          Authorization:
                              token.token_type + ' ' + token.access_token
                      }
                  }
                : {
                      headers: {
                          Authorization:
                              auth.token_type + ' ' + auth.access_token
                      }
                  }
        );
    }

    public getAssetSoftwares<T = any, R = AxiosResponse<T>>(
        auth: OAUTH_TOKEN,
        asset_id: string,
        page: number = 1
    ): Promise<R> {
        return this.api.get(
            '/assets/' + asset_id + '/softwares?page=' + page,
            token
                ? {
                      headers: {
                          Authorization:
                              token.token_type + ' ' + token.access_token
                      }
                  }
                : {
                      headers: {
                          Authorization:
                              auth.token_type + ' ' + auth.access_token
                      }
                  }
        );
    }

    public getProduct<T = any, R = AxiosResponse<T>>(
        auth: OAUTH_TOKEN,
        product_id: string
    ): Promise<R> {
        return this.api.get(
            '/products/' + product_id,
            token
                ? {
                      headers: {
                          Authorization:
                              token.token_type + ' ' + token.access_token
                      }
                  }
                : {
                      headers: {
                          Authorization:
                              auth.token_type + ' ' + auth.access_token
                      }
                  }
        );
    }

    public getProductCategories<T = any, R = AxiosResponse<T>>(
        auth: OAUTH_TOKEN,
        product_id: string,
        page: number = 1
    ): Promise<R> {
        return this.api.get(
            '/products/' + product_id + '/categories?page=' + page,
            token
                ? {
                      headers: {
                          Authorization:
                              token.token_type + ' ' + token.access_token
                      }
                  }
                : {
                      headers: {
                          Authorization:
                              auth.token_type + ' ' + auth.access_token
                      }
                  }
        );
    }

    public getManufacturer<T = any, R = AxiosResponse<T>>(
        auth: OAUTH_TOKEN,
        manufacturer_id: string
    ): Promise<R> {
        return this.api.get(
            '/companies/' + manufacturer_id,
            token
                ? {
                      headers: {
                          Authorization:
                              token.token_type + ' ' + token.access_token
                      }
                  }
                : {
                      headers: {
                          Authorization:
                              auth.token_type + ' ' + auth.access_token
                      }
                  }
        );
    }

    public getAssetDocs<T = any, R = AxiosResponse<T>>(
        auth: OAUTH_TOKEN,
        asset_id: string,
        page: number = 1
    ): Promise<R> {
        return this.api.get(
            '/assets/' + asset_id + '/documents?page=' + page,
            token
                ? {
                      headers: {
                          Authorization:
                              token.token_type + ' ' + token.access_token
                      }
                  }
                : {
                      headers: {
                          Authorization:
                              auth.token_type + ' ' + auth.access_token
                      }
                  }
        );
    }

    public getProductDocs<T = any, R = AxiosResponse<T>>(
        auth: OAUTH_TOKEN,
        product_id: string,
        page: number = 1,
        category_ids: Array<string> = []
    ): Promise<R> {
        if (category_ids.length) {
            return this.api.get(
                '/products/' +
                    product_id +
                    '/documents?page=' +
                    page +
                    '&category_id=' +
                    category_ids.join('+,') +
                    '+'
            );
        } else {
            return this.api.get(
                '/products/' + product_id + '/documents?page=' + page,
                token
                    ? {
                          headers: {
                              Authorization:
                                  token.token_type + ' ' + token.access_token
                          }
                      }
                    : {
                          headers: {
                              Authorization:
                                  auth.token_type + ' ' + auth.access_token
                          }
                      }
            );
        }
    }

    public getAuth<T = any, R = AxiosResponse<T>>(
        username: string,
        password: string
    ): Promise<R> {
        const body = {
            client_id:
                process.env.NETILION_API_KEY ||
                'ERROR_NETILION_API_KEY_UNDEFINED',
            client_secret:
                process.env.NETILION_SECRET ||
                'ERROR_NETILION_SECRET_UNDEFINED',
            grant_type: 'password',
            username,
            password
        };
        return axios.post(
            process.env.NETILION_AUTH_SERVER || 'ERROR_NO_AUTH_SERVER_DEFINED',
            body,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            }
        );
    }

    public refreshAuth<T = any, R = AxiosResponse<T>>(
        auth: OAUTH_TOKEN
    ): Promise<R> {
        const body = {
            client_id:
                process.env.NETILION_API_KEY ||
                'ERROR_NETILION_API_KEY_UNDEFINED',
            client_secret:
                process.env.NETILION_SECRET ||
                'ERROR_NETILION_SECRET_UNDEFINED',
            grant_type: 'refresh_token',
            refresh_token: auth.refresh_token
        };
        return axios.post(
            process.env.NETILION_AUTH_SERVER || 'ERROR_NO_AUTH_SERVER_DEFINED',
            body,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            }
        );
    }
}
