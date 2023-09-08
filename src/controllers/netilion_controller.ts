import { Request, Response, NextFunction } from 'express';
import netilion, { SubmodelName } from '../services/netilion_agent';
import { decodeBase64, makeBase64 } from '../services/oi4_helpers';
import { logger } from '../services/logger';
import { OAUTH_TOKEN } from '../interfaces/Mapper';
import oi4_repo_agent from '../services/oi4_repo_agent';
import {
    AssetAdministrationShell,
    Submodel
} from '../oi4_definitions/aas_components';
import { log } from 'winston';
if (process.env.NODE_ENV !== 'production') {
    const dotenv = require('dotenv');
    // Use dev dependency
    dotenv.config();
}

const submodel_name_map: { [key: string]: SubmodelName | undefined } = {
    nameplate: 'Nameplate',
    configuration_as_built: 'ConfigurationAsBuilt',
    configuration_as_documented: 'ConfigurationAsDocumented'
};

async function get_aas(req: Request, res: Response, next: NextFunction) {
    const result = await netilion.get_aas(
        res.locals.token,
        netilion.string_id_to_asset_id(req.params.id)
    );
    res.status(result.status).json(result.json);
}

async function get_all_aas(req: Request, res: Response, next: NextFunction) {
    const result = await netilion.get_all_aas(res.locals.token);
    res.status(result.status).json(result.json);
}

async function get_submodel_for_asset(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const submodel_name = submodel_name_map[req.params.sm_name];
    if (submodel_name) {
        const result = await netilion.get_submodel_for_asset(
            res.locals.token,
            netilion.string_id_to_asset_id(req.params.id),
            submodel_name
        );
        res.status(result.status).json(result.json);
    } else {
        res.status(501).json({
            message: "No Submodel '" + req.params.sm_name + "'"
        });
    }
}

async function get_all_submodels_for_asset(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const result = await netilion.get_all_submodels_for_asset(
        res.locals.token,
        netilion.string_id_to_asset_id(req.params.id)
    );
    res.status(result.status).json(result.json);
}

async function get_submodel_for_all_assets(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const submodel_name = submodel_name_map[req.params.sm_name];
    if (submodel_name) {
        const result = await netilion.get_submodel_for_all_assets(
            res.locals.token,
            submodel_name
        );
        res.status(result.status).json(result.json);
    } else {
        res.status(501).json({
            message: "No Submodel '" + req.params.sm_name + "'"
        });
    }
}

async function get_all_submodels_for_all_assets(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const result = await netilion.get_all_submodels_for_all_assets(
        res.locals.token
    );
    res.status(result.status).json(result.json);
}

// async function getEHHandoverDocuments(
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) {
//     let asset;
//     try {
//         asset = (await netilionClient.getAsset(req.params.id)).data;
//     } catch (error: any) {
//         logger.error(
//             `failed to get asset [id: ` +
//                 req.params.id +
//                 `] from netilion: ${error}`
//         );
//         return res.status(404).json({
//             message: 'Asset ' + req.params.id + ' Not Found.'
//         });
//     }
//     const vdi_categories = await grabber.getEHVDICategories();
//     const vdi_category_ids = await Promise.all(vdi_categories.map((e) => e.id));
//     const docs = (await grabber.getEHAssetDocumnets(asset.id)).concat(
//         await grabber.getEHProductDocumnets(asset.product.id, vdi_category_ids)
//     );
//     if (docs && docs.length) {
//         return res.status(200).json({
//             documents: docs
//         });
//     } else {
//         return res.status(404).json({
//             message:
//                 'Handover Documents for Asset [' +
//                 req.params.id +
//                 '] Not Found.'
//         });
//     }
// }

async function get_auth_token(req: Request, res: Response, next: NextFunction) {
    const encoded_userpass = req.headers.authorization?.match(/Basic (.*)/);
    const userpass = encoded_userpass?.length
        ? encoded_userpass.length > 1
            ? decodeBase64(encoded_userpass[1])
            : undefined
        : undefined;

    const [user, pass] = userpass ? userpass.split(':') : [];
    const auth_response = await netilion.get_auth_token(user, pass);
    if (auth_response.status >= 200 && auth_response.status < 300) {
        const auth_token = auth_response.json as OAUTH_TOKEN;
        const auth_keys = Object.keys(auth_token);
        auth_keys.forEach((key) => {
            res.cookie(key, auth_token[key as keyof OAUTH_TOKEN]);
        });
        return res
            .status(auth_response.status)
            .json({ message: 'Authentication Successful' });
    } else {
        return res.status(401).json({
            message: 'Authentication With Netilion Failed.',
            error: auth_response
        });
    }
}

async function submit_submodel_for_asset(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const submodel_name = submodel_name_map[req.params.sm_name];
    if (submodel_name) {
        const result = await netilion.get_submodel_for_asset(
            res.locals.token,
            netilion.string_id_to_asset_id(req.params.id),
            submodel_name
        );
        if (result.status === 200) {
            const submit_result = await oi4_repo_agent.submit_submodel(
                result.json
            );
            res.status(submit_result.status).json(submit_result.json);
        } else {
            res.status(result.status).json(result.json);
        }
    } else {
        res.status(501).json({
            message: "No Submodel '" + req.params.sm_name + "'"
        });
    }
}

async function submit_all_submodels_for_asset(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const resp = await netilion.get_all_submodels_for_asset(
        res.locals.token,
        netilion.string_id_to_asset_id(req.params.id)
    );
    const submodels = resp.json.submodels;
    const status = resp.status;
    if (status >= 200 && status < 300) {
        const submit_results = await oi4_repo_agent.multi_submit(
            'submodels',
            submodels as Submodel[],
            async (sm: Submodel) => {
                const resp = await oi4_repo_agent.submit_submodel(sm);
                return resp;
            }
        );
        res.status(submit_results.status).json(submit_results.json);
    } else {
        res.status(resp.status).json(resp.json);
    }
}

async function submit_submodel_for_all_assets(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const submodel_name = submodel_name_map[req.params.sm_name];
    if (submodel_name) {
        const resp = await netilion.get_submodel_for_all_assets(
            res.locals.token,
            submodel_name
        );
        const submodels = resp.json.submodels;
        const status = resp.status;
        if (status >= 200 && status < 300) {
            const submit_results = await oi4_repo_agent.multi_submit(
                'submodels',
                submodels as Submodel[],
                async (sm: Submodel) => {
                    const resp = await oi4_repo_agent.submit_submodel(sm);
                    return resp;
                }
            );
            res.status(submit_results.status).json(submit_results.json);
        } else {
            res.status(resp.status).json(resp.json);
        }
    } else {
        res.status(501).json({
            message: "No Submodel '" + req.params.sm_name + "'"
        });
    }
}

async function submit_all_submodels_for_all_assets(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const resp = await netilion.get_all_submodels_for_all_assets(
        res.locals.token
    );
    const submodels = resp.json.submodels;
    const status = resp.status;
    if (status >= 200 && status < 300) {
        const submit_results = await oi4_repo_agent.multi_submit(
            'submodels',
            submodels as Submodel[],
            async (sm: Submodel) => {
                const resp = await oi4_repo_agent.submit_submodel(sm);
                return resp;
            }
        );
        res.status(submit_results.status).json(submit_results.json);
    } else {
        res.status(resp.status).json(resp.json);
    }
}

async function submit_all_aas(req: Request, res: Response, next: NextFunction) {
    const resp = await netilion.get_all_aas(res.locals.token);
    const shells = resp.json.shells;
    const status = resp.status;
    if (status >= 200 && status < 300) {
        const submit_results = await oi4_repo_agent.multi_submit(
            'shells',
            shells as AssetAdministrationShell[],
            async (aas: AssetAdministrationShell) => {
                const resp = await oi4_repo_agent.submit_aas(aas);
                return resp;
            }
        );
        res.status(submit_results.status).json(submit_results.json);
    } else {
        res.status(resp.status).json(resp.json);
    }
}

async function submit_aas(req: Request, res: Response, next: NextFunction) {
    const result = await netilion.get_aas(
        res.locals.token,
        netilion.string_id_to_asset_id(req.params.id)
    );
    if (result.status === 200) {
        const submit_result = await oi4_repo_agent.submit_aas(result.json);
        res.status(submit_result.status).json(submit_result.json);
    } else {
        res.status(result.status).json(result.json);
    }
}

async function flush_oi4(req: Request, res: Response, next: NextFunction) {
    const shells_resp = await oi4_repo_agent.get_all_aas();
    const shells_status = shells_resp.status;
    const submodels_resp = await oi4_repo_agent.get_all_submodels();
    const submodels_status = submodels_resp.status;
    try {
        if (!(shells_status >= 200 && shells_status < 300)) {
            let error: any = new Error(
                'failed to retieve shells frome the OI4 Repository'
            );
            error.response = shells_resp;
            logger.error(error);
            throw error;
        }
        if (!(submodels_status >= 200 && submodels_status < 300)) {
            let error: any = new Error(
                'failed to retieve submodels frome the OI4 Repository'
            );
            error.response = submodels_resp;
            logger.error(error);
            throw error;
        }
        const shells = shells_resp.json.shells;
        const submodels = submodels_resp.json.submodels;
        const deleted_shell_ids = await Promise.all(
            shells.map(async (shell: AssetAdministrationShell) => {
                if (shell.id.match(/^http:\/\/127\.0\.0\.1(:.*|)\/v1\/.+$/)) {
                    const shell_delete_resp = await oi4_repo_agent.delete_aas(
                        makeBase64(shell.id)
                    );
                    const shell_delete_status = shell_delete_resp.status;
                    if (
                        !(
                            shell_delete_status >= 200 &&
                            shell_delete_status < 300
                        )
                    ) {
                        let error: any = new Error(
                            'failed to delete shell [' +
                                shell.id +
                                '] frome the OI4 Repository'
                        );
                        error.response = shell_delete_resp;
                        logger.error(error);
                        throw error;
                    }
                    return shell.id;
                }
            })
        );
        const deleted_submodel_ids = await Promise.all(
            submodels.map(async (submodel: Submodel) => {
                if (
                    submodel.id.match(/^http:\/\/127\.0\.0\.1(:.*|)\/v1\/.+$/)
                ) {
                    const submodel_delete_resp =
                        await oi4_repo_agent.delete_submodel(
                            makeBase64(submodel.id)
                        );
                    const submodel_delete_status = submodel_delete_resp.status;
                    if (
                        !(
                            submodel_delete_status >= 200 &&
                            submodel_delete_status < 300
                        )
                    ) {
                        let error: any = new Error(
                            'failed to delete submodel [' +
                                submodel.id +
                                '] frome the OI4 Repository'
                        );
                        error.response = submodel_delete_resp;
                        logger.error(error);
                        throw error;
                    }
                    return submodel.id;
                }
            })
        );
        res.status(200).json({ deleted_shell_ids, deleted_submodel_ids });
    } catch (error: any) {
        logger.error(error);
        error.response = error.response || { status: 500, data: {} };
        res.status(error.response.status).json(error.response.json);
    }
}

export default {
    get_submodel_for_asset,
    get_all_submodels_for_asset,
    get_submodel_for_all_assets,
    get_all_submodels_for_all_assets,
    get_all_aas,
    get_aas,
    submit_submodel_for_asset,
    submit_all_submodels_for_asset,
    submit_submodel_for_all_assets,
    submit_all_submodels_for_all_assets,
    submit_all_aas,
    submit_aas,
    flush_oi4,
    // getEHHandoverDocuments,
    get_auth_token
};
