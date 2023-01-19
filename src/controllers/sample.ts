import { Request, Response, NextFunction } from 'express';
import { logger } from '../services/logger';
import dotenv from 'dotenv';
import { NetelionClient } from '../services/netelionAPI';

dotenv.config();

const netilionClient = new NetelionClient();

const sampleHealthCheck = (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Sample healthcheck route called.`);

    return res.status(200).json({
        message: 'pong'
    });
};

const getAllEHProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let response: any = {};
    try {
        response = (await netilionClient.getAllProducts()).data;
    } catch (error: any) {
        logger.error(`failed to get products from netilion: ${error}`);
    }
    return res.status(200).json({
        message: await response
    });
};

export default {
    sampleHealthCheck,
    getAllEHProducts
};
