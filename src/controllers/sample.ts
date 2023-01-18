import http from 'http';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../services/logger';
import dotenv from 'dotenv';
import { NetelionClient } from '../services/netelionAPI';

dotenv.config();

const sampleHealthCheck = (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Sample healthcheck route called.`);

    return res.status(200).json({
        message: 'pong'
    });
};

const getAllEHProducts = (
    req: Request,
    res: Response,
    next: NextFunction
) => {};

export default { sampleHealthCheck };
