import http from 'http';
import express from 'express';
import dotenv from 'dotenv';
import { logger } from './services/logger';
import bodyParser from 'body-parser';
import sampleRoutes from './routes/sample';

dotenv.config();

const router = express();

router.use((req, res, next) => {
    logger.info(
        `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`
    );
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

/** Routes */
router.use('/v1', sampleRoutes);

/** Error Handling */
router.use((req, res, next) => {
    const error = new Error('not found');
    return res.status(404).json({
        message: error.message
    });
});

/** Server */
const httpServer = http.createServer(router);
httpServer.listen(process.env.SERVER_PORT, () =>
    logger.info(
        `Server running on ${process.env.SERVER_URL}:${process.env.SERVER_PORT}`
    )
);
