import http from 'http';
import express from 'express';
import { logger } from './services/logger';
import bodyParser from 'body-parser';
import netilionRoutes from './routes/netilion_routes';
import authRoutes from './routes/auth';
import oi4Routes from './routes/oi4_routes';
import auto_update from './services/auto_update';
import { OAUTH_TOKEN } from './interfaces/Mapper';
import { decodeBase64 } from './services/oi4_helpers';
import netilion_agent from './services/netilion_agent';

if (process.env.NODE_ENV !== 'production') {
    const dotenv = require('dotenv');
    // Use dev dependency
    dotenv.config();
}

const router = express();

router.use(async (req, res, next) => {
    logger.info(
        `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`
    );
    if (process.env.MAPPER_AUTH_MODE === 'BY_USER') {
        const authorization = decodeBase64(
            req.headers.authorization?.split(' ')[1] || ''
        );
        let user_token: OAUTH_TOKEN | undefined;
        if (authorization) {
            const [username, password]: string[] = authorization.split(':');
            user_token = await netilion_agent.get_auth_token(
                username,
                password
            );
        } else {
            const cookies: any = req.headers.cookie
                ?.split(';')
                .reduce((res: Object, item: string) => {
                    const [key, vaue]: string[] = item.trim().split('=');
                    return { ...res, [key]: vaue };
                }, {});
            if (cookies) {
                if (cookies.access_token && cookies.token_type) {
                    const exp =
                        Date.now() -
                        (Number(cookies.expires_in) * 1000 +
                            cookies.created_at * 1000);
                    if (exp > 0) {
                        return res.status(401).json({
                            message: 'Session has expired'
                        });
                    }
                    user_token = {
                        access_token: cookies.access_token,
                        token_type: cookies.token_type,
                        expires_in: Number(cookies?.expires_in),
                        refresh_token: cookies?.refresh_token || undefined,
                        created_at: Number(cookies?.created_at)
                    };
                }
            } else {
                return res.status(401).json({
                    message: 'No authorization information found'
                });
            }
            // console.log(cookies ? cookies : 'no coookie :(');
        }
        res.locals.token = user_token;
    } else if (process.env.MAPPER_AUTH_MODE === 'INTERNAL') {
        // token generation will be handled by the assetSource client, this is a place holder.
        res.locals.token = {
            access_token: '',
            token_type: '',
            expires_in: NaN,
            refresh_token: undefined,
            created_at: NaN
        };
    }
    res.on('finish', () => {
        logger.info(
            `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`
        );
    });
    next();
});

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST PUT');
    }
    next();
});

// Routes
router.use('/' + process.env.SERVER_API_VERSION + '/mapper', netilionRoutes);
router.use('/auth', authRoutes);
router.use('/' + process.env.SERVER_API_VERSION + '/oi4-repo', oi4Routes);

// Error Handling
router.use((req, res, next) => {
    const error = new Error('not found');
    return res.status(404).json({
        message: error.message
    });
});

// Tasks
// auto_update.postAAS();
// auto_update.postSubmodels();
// auto_update.updateConfigurationsAsBuilt();

// Server
const httpServer = http.createServer(router);
httpServer.listen(process.env.PORT, () =>
    logger.info(
        `Server running on ${process.env.SERVER_URL}:${process.env.PORT}`
    )
);
