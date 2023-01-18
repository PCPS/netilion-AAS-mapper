import axios, {
    AxiosError,
    AxiosRequestConfig,
    AxiosResponse,
    CreateAxiosDefaults,
    AxiosInstance
} from 'axios';
import dotenv, { config } from 'dotenv';
import { logger } from '../services/logger';

dotenv.config();

const makeBase64 = (str: string, encodeing: BufferEncoding = 'utf8') => {
    const buffer = Buffer.from(str, encodeing);
    return buffer.toString('base64');
};

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
                `Basic token generatad form usr: ${process.env.USERNAME},
                 pwd: ${process.env.PASSWORD} with value [ ${token.value} ]`
            );
            break;
        default:
            logger.error('AUTHTYPE not found or not recognized');
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
    }

    public getAllProducts<T, R = AxiosResponse<T>>(): Promise<R> {
        return this.api.get(`/products`);
    }
}
axios.interceptors.request.use((config) => {
    //TODO: add support for OAUTH
    switch (token.authType) {
        case 'Basic':
            config.headers.Authorization = 'Basic ' + token.value;
            break;
        default:
            logger.error(
                `Authorization method ${token.authType} is not supported for interception`
            );
    }
    return config;
});

axios.interceptors.response.use(
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

const request = {};
