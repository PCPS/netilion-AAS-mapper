import { Request, Response, NextFunction } from 'express';
import netilion, { SubmodelName } from '../services/netilion_agent';
import { decodeBase64 } from '../services/oi4_helpers';
import { logger } from '../services/logger';
import { OAUTH_TOKEN } from '../interfaces/Mapper';
import { AGENT_OP_RESULT } from '../interfaces/Agent';
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

async function multi_submit<T>(
    array_name: string,
    item_array: Array<T>,
    submit_function: (item: T) => Promise<AGENT_OP_RESULT>
): Promise<AGENT_OP_RESULT> {
    let fail_found: boolean = false;
    let success_found: boolean = false;

    const results = await Promise.all(
        item_array.map(async (item: T) => {
            const resp = await submit_function(item);
            if (resp.status === 200) {
                success_found = true;
                return { status: 'success', item: resp };
            } else {
                fail_found = true;
                return {
                    status: 'failed',
                    item: resp
                };
            }
        })
    );

    let successful: Array<T> = [];
    let failed: Array<AGENT_OP_RESULT> = [];
    results.forEach((element) => {
        if (element.status == 'success') {
            successful.push(element.item.json);
        } else {
            failed.push(element.item);
        }
    });
    const status = success_found
        ? fail_found
            ? 207
            : 200
        : fail_found
        ? 404
        : 500;
    switch (status) {
        case 200:
            return {
                status: 200,
                json: {
                    [array_name]: successful
                }
            };
        case 404:
            return {
                status,
                json: {
                    message: 'All failed',
                    error: failed
                }
            };
        default:
            return {
                status,
                json: {
                    message: 'Something went wrong'
                }
            };
    }
}

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
        res.status(404).json({
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
    res.status(result.status).json({ submodels: result.json.submodels });
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
        res.status(404).json({
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
    res.status(result.status).json({ submodels: result.json.submodels });
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

async function getAuthToken(req: Request, res: Response, next: NextFunction) {
    const encoded_userpass = req.headers.authorization?.match(/Basic (.*)/);
    const userpass = encoded_userpass?.length
        ? encoded_userpass.length > 1
            ? decodeBase64(encoded_userpass[1])
            : undefined
        : undefined;

    const [user, pass] = userpass ? userpass.split(':') : [];
    const auth_response = await netilion.get_auth_token(user, pass);
    if (auth_response) {
        const auth_keys = Object.keys(auth_response);
        auth_keys.forEach((key) => {
            res.cookie(key, auth_response[key as keyof OAUTH_TOKEN]);
        });
        return res.status(200).json({ message: 'Authentication Successful' });
    } else {
        return res.status(401).json({
            message: 'Authentication With Netilion Failed.'
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
        res.status(404).json({
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
    if (status === 200) {
        const submit_results = await multi_submit(
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
        if (status === 200) {
            const submit_results = await multi_submit(
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
        res.status(404).json({
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
    if (status === 200) {
        const submit_results = await multi_submit(
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
    if (status === 200) {
        const submit_results = await multi_submit(
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
    // getEHHandoverDocuments,
    getAuthToken
};
