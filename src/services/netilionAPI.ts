import axios, {
    AxiosError,
    AxiosResponse,
    CreateAxiosDefaults,
    AxiosInstance
} from 'axios';
import { logger } from './logger';
import { makeBase64 } from './oi4_helpers';

if (process.env.NODE_ENV !== 'production') {
    const dotenv = require('dotenv');
    // Use dev dependency
    dotenv.config();
}

interface OAUTH_PASSWORD {
    client_id: string;
    client_secret: string;
    grant_type: 'password';
    username: string;
    password: string;
}

interface OAUTH_REFRESH {
    client_id: string;
    client_secret: string;
    grant_type: 'refresh_token';
    refresh_token: string;
}

interface OAUTH_RESPONSE {
    access_token: string;
    token_type: 'Bearer';
    expires_in: number;
    refresh_token: string;
    created_at: number;
}

class AuthToken {
    authType: 'Bearer' | 'Basic';
    value: string;
    public constructor() {
        switch (process.env.NETILION_AUTH_TYPE) {
            case 'Basic':
                this.authType = 'Basic';
                this.value = makeBase64(
                    process.env.NETILION_USERNAME +
                        ':' +
                        process.env.NETILION_PASSWORD
                );
                logger.info(
                    `Basic token generatad form usr: ${process.env.NETILION_USERNAME}, \
                    pwd: ${process.env.NETILION_PASSWORD} with value [ ${this.value} ]`
                );
                break;
            case 'Bearer':
                this.authType = 'Bearer';
                this.value = '';
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
                this.authType = 'Basic';
                this.value = 'ERROR_NETILION_AUTH_TYPE_UNDEFINED';
                logger.error(
                    'AUTHTYPE [' +
                        process.env.NETILION_AUTH_TYPE +
                        '] not found or not recognized'
                );
                break;
        }
    }
    private async requestOAuth2(body: OAUTH_PASSWORD | OAUTH_REFRESH) {
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
                const data: OAUTH_RESPONSE = await resp.data;
                this.value = data.access_token;
                console.log('AUTH VALUE RETIEVED: ' + data);
                console.log(data);
                const time_to_next_req =
                    data.expires_in * 1000 -
                    (Date.now() - data.created_at * 1000 + 2000);
                setTimeout(() => {
                    this.requestOAuth2({
                        client_id: body.client_id,
                        client_secret: body.client_secret,
                        grant_type: 'refresh_token',
                        refresh_token: data.refresh_token
                    });
                }, time_to_next_req);
            } catch (error: any) {
                if (error.status) {
                    logger.error(
                        'Authentication error ' + error.status + ': ' + error
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

const token = new AuthToken();

export class NetelionClient {
    private api: AxiosInstance;
    public constructor() {
        const apiConfig: CreateAxiosDefaults = {
            baseURL:
                process.env.NETILION_API_URL +
                '/' +
                process.env.NETILION_API_VERSION,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Api-Key': process.env.NETILION_API_KEY
            }
        };
        this.api = axios.create(apiConfig);
        this.api.interceptors.request.use((config) => {
            config.headers.Authorization = token.authType + ' ' + token.value;
            logger.info(
                `request ready with URL[${config.baseURL! + config.url!}]`
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
        page: number = 1
    ): Promise<R> {
        return this.api.get(
            '/document/categories?page=' + page + '&standard_id=1'
        );
    }

    public getAllAssets<T = any, R = AxiosResponse<T>>(
        page: number = 1
    ): Promise<R> {
        return this.api.get('/assets?page=' + page);
    }

    public getAsset<T = any, R = AxiosResponse<T>>(
        asset_id: string
    ): Promise<R> {
        return this.api.get('/assets/' + asset_id);
    }

    public getAssetSpecs<T = any, R = AxiosResponse<T>>(
        asset_id: string
    ): Promise<R> {
        return this.api.get('/assets/' + asset_id + '/specifications');
    }

    public getAssetSoftwares<T = any, R = AxiosResponse<T>>(
        asset_id: string,
        page: number = 1
    ): Promise<R> {
        return this.api.get('/assets/' + asset_id + '/softwares?page=' + page);
    }

    public getProduct<T = any, R = AxiosResponse<T>>(
        product_id: string
    ): Promise<R> {
        return this.api.get('/products/' + product_id);
    }

    public getProductCategories<T = any, R = AxiosResponse<T>>(
        product_id: string,
        page: number = 1
    ): Promise<R> {
        return this.api.get(
            '/products/' + product_id + '/categories?page=' + page
        );
    }

    public getManufacturer<T = any, R = AxiosResponse<T>>(
        manufacturer_id: string
    ): Promise<R> {
        return this.api.get('/companies/' + manufacturer_id);
    }

    public getAssetDocs<T = any, R = AxiosResponse<T>>(
        asset_id: string,
        page: number = 1
    ): Promise<R> {
        return this.api.get('/assets/' + asset_id + '/documents?page=' + page);
    }

    public getProductDocs<T = any, R = AxiosResponse<T>>(
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
                '/products/' + product_id + '/documents?page=' + page
            );
        }
    }
}
