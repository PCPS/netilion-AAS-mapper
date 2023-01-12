import { Request, Response, NextFunction } from 'express';
import { logger } from '../services/logger';

const sampleHealthCheck = (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Sample healthcheck route called.`);

    return res.status(200).json({
        message: 'pong'
    });
};

export default { sampleHealthCheck };
