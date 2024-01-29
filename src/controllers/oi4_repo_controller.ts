import { Request, Response, NextFunction } from 'express';
import oi4 from '../services/oi4_repo_agent';
import { SubmodelName } from '../services/netilion_agent';

const submodel_name_map: { [key: string]: SubmodelName | undefined } = {
    nameplate: 'Nameplate',
    configuration_as_built: 'ConfigurationAsBuilt',
    configuration_as_documented: 'ConfigurationAsDocumented'
};

async function get_aas(req: Request, res: Response, next: NextFunction) {
    const result = await oi4.get_aas(req.params.shell_id_b64);
    res.status(result.status).json(result.json);
}

async function get_all_aas(req: Request, res: Response, next: NextFunction) {
    const result = await oi4.get_all_aas();
    res.status(result.status).json(result.json);
}

async function get_submodel(req: Request, res: Response, next: NextFunction) {
    const result = await oi4.get_submodel(req.params.sm_id_b64);
    res.status(result.status).json(result.json);
}

async function get_all_submodels(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const result = await oi4.get_all_submodels();
    res.status(result.status).json(result.json);
}

async function passthrough(req: Request, res: Response, next: NextFunction) {
    const result = await oi4.passthrough(req.params[0]);
    res.status(result.status).json(result.json);
}

export default {
    get_aas,
    get_all_aas,
    get_submodel,
    get_all_submodels,
    passthrough
};
