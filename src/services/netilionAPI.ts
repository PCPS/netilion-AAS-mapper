import axios, {
    AxiosError,
    AxiosResponse,
    CreateAxiosDefaults,
    AxiosInstance
} from 'axios';
import dotenv from 'dotenv';
import { logger } from './logger';
import { makeBase64 } from './oi4_helpers';

dotenv?.config();

interface AuthToken {
    authType: 'Basic';
    value: string;
}

const makeToken = () => {
    //TODO: add OAUTH authentication
    let token: AuthToken = { authType: 'Basic', value: '' };
    switch (process.env.NETILION_AUTH_TYPE) {
        case 'Basic':
            token.authType = 'Basic';
            token.value = makeBase64(
                process.env.NETILION_USERNAME +
                    ':' +
                    process.env.NETILION_PASSWORD
            );
            logger.info(
                `Basic token generatad form usr: ${process.env.NETILION_USERNAME}, \
                    pwd: ${process.env.NETILION_PASSWORD} with value [ ${token.value} ]`
            );
            break;
        default:
            logger.error(
                'AUTHTYPE [' +
                    process.env.NETILION_AUTH_TYPE +
                    '] not found or not recognized'
            );
            break;
    }
    return token;
};

const token = makeToken();

export class NetelionClient {
    //TODO: add support for OAUTH
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
            //TODO: add support for OAUTH
            switch (token.authType) {
                case 'Basic':
                    config.headers.Authorization = 'Basic ' + token.value;
                    break;
                default:
                    logger.error(
                        `Authorization method ${token.authType} is not supported for interception`
                    );
                    break;
            }
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
