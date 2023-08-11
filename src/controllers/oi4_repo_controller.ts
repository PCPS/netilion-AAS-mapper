import { Request, Response, NextFunction } from 'express';
import oi4 from '../services/oi4_repo_agent';
import { Submodel } from '../oi4_definitions/aas_components';
import { SubmodelName } from '../services/netilion_agent';

const submodel_name_map: { [key: string]: SubmodelName | undefined } = {
    nameplate: 'Nameplate',
    configuration_as_built: 'ConfigurationAsBuilt',
    configuration_as_documented: 'ConfigurationAsDocumented'
};

async function post_aas(req: Request, res: Response, next: NextFunction) {
    const result = await oi4.post_aas(res.locals.token, Number(req.params.id));
    res.status(result.status).json(result.json);
}

async function post_all_aas(req: Request, res: Response, next: NextFunction) {
    const result = await oi4.post_all_aas(res.locals.token);
    res.status(result.status).json(result.json);
}

async function update_aas(req: Request, res: Response, next: NextFunction) {
    const result = await oi4.update_aas(
        res.locals.token,
        Number(req.params.id)
    );
    res.status(result.status).json(result.json);
}

async function update_all_aas(req: Request, res: Response, next: NextFunction) {
    const result = await oi4.update_all_aas(res.locals.token);
    res.status(result.status).json(result.json);
}

async function post_submodel(req: Request, res: Response, next: NextFunction) {
    const submodel_name = submodel_name_map[req.params.sm_name];
    if (submodel_name) {
        const result = await oi4.post_submodel(
            res.locals.token,
            Number(req.params.id),
            submodel_name
        );
        res.status(result.status).json(result.json);
    } else {
        res.status(404).json({
            message: "No Submodel '" + req.params.sm_name + "'"
        });
    }
}

async function post_submodel_for_all_assets(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const submodel_name = submodel_name_map[req.params.sm_name];
    if (submodel_name) {
        const result = await oi4.post_submodel_for_all_assets(
            res.locals.token,
            submodel_name
        );
        res.status(result.status).json(result.json);
    } else {
        res.status(404).json({
            message: "No Submodel '" + req.params.sm_name + "'"
        });
    }
}

async function update_submodel(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const submodel_name = submodel_name_map[req.params.sm_name];
    if (submodel_name) {
        const result = await oi4.update_submodel(
            res.locals.token,
            Number(req.params.id),
            submodel_name
        );
        res.status(result.status).json(result.json);
    } else {
        message: "No Submodel '" + req.params.sm_name + "'";
    }
}

async function update_submodel_for_all_assets(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const submodel_name = submodel_name_map[req.params.sm_name];
    if (submodel_name) {
        const result = await oi4.update_submodel_for_all_assets(
            res.locals.token,
            submodel_name
        );
        res.status(result.status).json(result.json);
    } else {
        res.status(404).json({
            message: "No Submodel '" + req.params.sm_name + "'"
        });
    }
}

async function get_all_aas(req: Request, res: Response, next: NextFunction) {
    const result = await oi4.get_all_aas();
    res.status(result.status).json(result.json);
}

async function get_aas(req: Request, res: Response, next: NextFunction) {
    const result = await oi4.get_aas(req.params.id);
    res.status(result.status).json(result.json);
}

async function get_submodel_for_all_assets(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const result = await oi4.get_all_submodels();
    res.status(result.status).json(result.json);
}

async function get_submodel(req: Request, res: Response, next: NextFunction) {
    const result = await oi4.get_submodel(req.params.id);
    res.status(result.status).json(result.json);
}

export default {
    post_aas,
    post_all_aas,
    update_aas,
    update_all_aas,
    get_all_aas,
    get_aas,
    post_submodel,
    post_submodel_for_all_assets,
    update_submodel,
    update_submodel_for_all_assets,
    get_submodel_for_all_assets,
    get_submodel
};
