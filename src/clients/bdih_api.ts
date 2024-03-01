import axios, {
    AxiosError,
    AxiosResponse,
    CreateAxiosDefaults,
    AxiosInstance
} from 'axios';
import { logger } from '../services/logger';
import { makeBase64 } from '../oi4_definitions/oi4_helpers';
import { AuthType, OAUTH_TOKEN, OAUTH_REQUEST_BODY } from '../interfaces/Auth';
import * as BDIH from '../interfaces/BDIH';

if (process.env.NODE_ENV !== 'production') {
    const dotenv = require('dotenv');
    // Use dev dependency
    dotenv.config();
}

export class BDIHClient {
    private api: AxiosInstance;
    public constructor() {
        const apiConfig: CreateAxiosDefaults = {
            baseURL: process.env.BDIH_API_URL,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                APIKey: process.env.BDIH_API_KEY
            }
        };
        this.api = axios.create(apiConfig);
        this.api.interceptors.request.use((config) => {
            logger.info(
                config.method +
                    ' request ready with URL [' +
                    config.baseURL +
                    config.url +
                    '] and headers [' +
                    config.headers +
                    ']'
            );
            return config;
        });
        this.api.interceptors.response.use(
            (res) => res,
            (error: AxiosError) => {
                if (error.response) {
                    const { data, status, config } = error.response;
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
            }
        );
    }

    public getAssetShortBySerialNumber<
        T = BDIH.AssetShort,
        R = AxiosResponse<T>
    >(serial_number: string): Promise<R> {
        return this.api.get('/assets?serialnumber=' + serial_number);
    }

    public getAssetByAssetId<T = BDIH.Asset, R = AxiosResponse<T>>(
        asset_id: BDIH.AssetIdType
    ): Promise<R> {
        return this.api.get('/assets/' + asset_id);
    }

    public getOrderCodebyOrderCode<T = BDIH.OrderCode, R = AxiosResponse<T>>(
        order_code: string
    ): Promise<R> {
        return this.api.get('/ordercodes/' + order_code);
    }

    public getProductByProductId<T = BDIH.Product, R = AxiosResponse<T>>(
        product_id: string
    ): Promise<R> {
        return this.api.get('/products/' + product_id);
    }
}
