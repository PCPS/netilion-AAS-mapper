import { Request, Response, NextFunction } from 'express';
import oi4 from '../services/oi4_repo_agent';

async function postAllEHAASToOI4(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const result = await oi4.postAllEHAASToOI4();
    res.status(result.status).json(result.json);
}

async function updateEHAASInOI4(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const result = await oi4.updateEHAASInOI4(req.params.id);
    res.status(result.status).json(result.json);
}

async function postAllEHNameplatesToOI4(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const result = await oi4.postAllEHNameplatesToOI4();
    res.status(result.status).json(result.json);
}

async function updateEHNameplatesInOI4(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const result = await oi4.updateEHNameplatesInOI4(req.params.id);
    res.status(result.status).json(result.json);
}

async function postAllEHConfigurationsAsBuiltToOI4(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const result = await oi4.postAllEHConfigurationsAsBuiltToOI4();
    res.status(result.status).json(result.json);
}

async function updateEHConfigurationsAsBuiltInOI4(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const result = await oi4.updateEHConfigurationsAsBuiltInOI4(req.params.id);
    res.status(result.status).json(result.json);
}

async function updateAllEHConfigurationsAsBuiltInOI4(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const result = await oi4.updateAllEHConfigurationsAsBuiltInOI4();
    res.status(result.status).json(result.json);
}

async function postAllEHConfigurationsAsDocumentedToOI4(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const result = await oi4.postAllEHConfigurationsAsDocumentedToOI4();
    res.status(result.status).json(result.json);
}

async function updateEHConfigurationsAsDocumentedInOI4(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const result = await oi4.updateEHConfigurationsAsDocumentedInOI4(
        req.params.id
    );
    res.status(result.status).json(result.json);
}

async function updateAllEHConfigurationsAsDocumentedInOI4(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const result = await oi4.updateAllEHConfigurationsAsDocumentedInOI4();
    res.status(result.status).json(result.json);
}

async function getAllAASFromOI4(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const result = await oi4.getAllAASFromOI4();
    res.status(result.status).json(result.json);
}

async function getAASFromOI4(req: Request, res: Response, next: NextFunction) {
    const result = await oi4.getAASFromOI4(req.params.id);
    res.status(result.status).json(result.json);
}

async function getAllSubmodelsFromOI4(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const result = await oi4.getAllSubmodelsFromOI4();
    res.status(result.status).json(result.json);
}

async function getSubmodelFromOI4(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const result = await oi4.getSubmodelFromOI4(req.params.id);
    res.status(result.status).json(result.json);
}

export default {
    postAllEHAASToOI4,
    postAllEHNameplatesToOI4,
    postAllEHConfigurationsAsBuiltToOI4,
    postAllEHConfigurationsAsDocumentedToOI4,
    updateEHAASInOI4,
    updateEHNameplatesInOI4,
    updateEHConfigurationsAsBuiltInOI4,
    updateAllEHConfigurationsAsBuiltInOI4,
    updateEHConfigurationsAsDocumentedInOI4,
    updateAllEHConfigurationsAsDocumentedInOI4,
    getAllAASFromOI4,
    getAASFromOI4,
    getAllSubmodelsFromOI4,
    getSubmodelFromOI4
};
