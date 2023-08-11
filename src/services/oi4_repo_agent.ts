import { logger } from './logger';
import {
    AssetAdministrationShell,
    Submodel,
    SubmodelElement
} from '../oi4_definitions/aas_components';
import { decodeBase64 } from './oi4_helpers';
import source_agent from './netilion_agent';
import { SubmodelName, AssetId } from './netilion_agent';
import { OI4Client } from './oi4RepoAPI';
import { OAUTH_TOKEN } from '../interfaces/Mapper';
import { AGENT_OP_RESULT } from '../interfaces/Agent';

const oi4Client = new OI4Client();

async function handle_multi_post<T extends { id: string | number }>(
    array_name: string,
    item_array: Array<T> | undefined,
    post_function: (item: T) => any,
    error_message_function: (item: T, error: any) => string,
    error_404_message: string
) {
    if (item_array && item_array.length) {
        let fail_found: boolean = false;
        let success_found: boolean = false;

        const results = item_array.map(async (item: T) => {
            try {
                const resp = await (await post_function(item)).data;
                success_found = true;
                return { status: 'success', item: resp };
            } catch (error: any) {
                logger.error(error_message_function(item, error));
                const resp = error.response || { status: 500 };
                fail_found = true;
                return {
                    status: 'failed',
                    details: {
                        id: item.id,
                        status: resp.status,
                        error: resp.error_description || error.message
                    }
                };
            }
        });

        const RESPS = await Promise.all(results);
        let successful: Array<T> = [];
        let failed: Array<{ id: string | number; error: string } | undefined> =
            [];
        RESPS.forEach((element) => {
            if (element.status == 'success') {
                successful.push(element.item);
            } else {
                failed.push(element.details);
            }
        });
        const status = success_found
            ? fail_found
                ? 207
                : 200
            : fail_found
            ? 400
            : 500;
        return {
            status,
            json:
                status === 207
                    ? {
                          successful,
                          failed
                      }
                    : status === 200
                    ? {
                          [array_name]: successful
                      }
                    : status === 400
                    ? {
                          message: 'All failed',
                          resoponses: failed
                      }
                    : {
                          message: 'Something went wrong.'
                      }
        };
    } else {
        return {
            status: 404,
            json: {
                message: error_404_message
            }
        };
    }
}

// update AssetAdministrationShell in OI4 repo using source assets
async function post_aas(
    source_auth: OAUTH_TOKEN,
    asset_id: AssetId
): Promise<AGENT_OP_RESULT> {
    const shell_resp = await source_agent.get_aas(source_auth, asset_id);
    const shell = shell_resp.json;
    const shell_status = shell_resp.status;

    if (shell_status === 200) {
        try {
            const resp = await (await oi4Client.postShell(shell)).data;
            return { status: 200, json: resp };
        } catch (error: any) {
            logger.error(
                `failed to post aas [${shell.id}] in oi4 repo: ${error}`
            );
            const resp = error.response || { status: 500 };
            return {
                status: resp.status,
                json: {
                    message:
                        'Failed to post Asset Administration Shell [' +
                        shell.id +
                        '] in OI4 Repo'
                }
            };
        }
    } else {
        return {
            status: shell_status,
            json: {
                message:
                    'Failed to retrieve Asset Administration Shell for Asset [' +
                    asset_id +
                    '] from source',
                error: shell_resp.json
            }
        };
    }
}

// Post all AssetAdministrationSells created from asset source to OI4 Repo
async function post_all_aas(
    source_auth: OAUTH_TOKEN
): Promise<AGENT_OP_RESULT> {
    const shells = (await source_agent.get_all_aas(source_auth)).json.shells;
    return await handle_multi_post(
        'shells',
        shells,
        (shell: AssetAdministrationShell) => {
            return oi4Client.postShell(shell);
        },
        (shell, error) => {
            return `failed to post shell [${shell.idShort}] to oi4 repo: ${
                error.response
                    ? error.response.data.error_description ||
                      error.response.data.title
                    : error
            }`;
        },
        'Failed to retrieve Asset Administration Shells from source.'
    );
}

// update AssetAdministrationShell in OI4 repo using source assets
async function update_aas(
    source_auth: OAUTH_TOKEN,
    asset_id: AssetId
): Promise<AGENT_OP_RESULT> {
    const shell_resp = await source_agent.get_aas(source_auth, asset_id);
    const shell = shell_resp.json;
    const shell_status = shell_resp.status;

    if (shell_status === 200) {
        try {
            const resp = await (await oi4Client.updateShell(shell)).data;
            return { status: 200, json: resp };
        } catch (error: any) {
            logger.error(
                `failed to update aas [${shell.id}] in oi4 repo: ${error}`
            );
            const resp = error.response || { status: 500 };
            return {
                status: resp.status,
                json: {
                    message:
                        'Failed to update Asset Administration Shell [' +
                        shell.id +
                        '] in OI4 Repo'
                }
            };
        }
    } else {
        return {
            status: shell_status,
            json: {
                message:
                    'Failed to retrieve Asset Administration Shell for Asset [' +
                    asset_id +
                    '] from source.',
                error: shell_resp.json
            }
        };
    }
}

// update all AssetAdministrationShells in OI4 repo using source assets
async function update_all_aas(source_auth: OAUTH_TOKEN) {
    const old_shells = (await get_all_aas()).json.shells;

    if (old_shells && old_shells.length) {
        const sourceAssetIds = old_shells.map((item: Submodel) => {
            return source_agent.aas_id_short_to_source_asset_id(
                item.idShort || ''
            );
        });
        const shells_mixed = await Promise.all(
            sourceAssetIds.map(async (id: AssetId) => {
                const shell_resp = await source_agent.get_aas(source_auth, id);
                if (shell_resp.status !== 200) {
                    logger.warn('Asset [' + id + '] no longer in source');
                    return undefined;
                }
                return shell_resp.json;
            })
        );
        const shells = new Array<AssetAdministrationShell>();
        shells_mixed.forEach((item) => {
            if (item !== undefined) {
                shells.push(item);
            }
        });
        return await handle_multi_post(
            'shells',
            shells,
            (shell: AssetAdministrationShell) => {
                return oi4Client.updateShell(shell);
            },
            (shell, error) => {
                return `failed to update shell [${
                    shell.idShort
                }] in oi4 repo: ${
                    error.response
                        ? error.response.data.error_description ||
                          error.response.data.title
                        : error
                }`;
            },
            'Failed to retrieve Asset Administration Shells from source.'
        );
    } else {
        return {
            status: 404,
            json: {
                message: 'No AssetAdministrationShells found on OI4 Repo.'
            }
        };
    }
}

// Post submodel for specific asset created from asset source to OI4 Repo
async function post_submodel(
    source_auth: OAUTH_TOKEN,
    asset_id: AssetId,
    submodel_name: SubmodelName
): Promise<AGENT_OP_RESULT> {
    const submodel_resp = await source_agent.get_submodel(
        source_auth,
        asset_id,
        submodel_name
    );
    const submodel = submodel_resp.json;
    const submodel_status = submodel_resp.status;
    if (submodel_status === 200) {
        try {
            const resp = await (await oi4Client.postSubmodel(submodel)).data;
            return {
                status: resp.status,
                json: resp
            };
        } catch (error: any) {
            logger.error(
                `failed to post ${submodel_name} submodel for asset ${asset_id} in oi4 repo: ${error}`
            );
            const resp = error.response || { status: 500 };
            return {
                status: resp.status,
                json: {
                    message: resp.error_description || error.message
                }
            };
        }
    } else {
        return {
            status: submodel_status,
            json: {
                message:
                    'Failed to retrieve ' +
                    submodel_name +
                    ' Submodel for Asset [' +
                    asset_id +
                    '] from source.',
                error: submodel_resp.json
            }
        };
    }
}

// Post submodel for all assets created from asset source to OI4 Repo
async function post_submodel_for_all_assets(
    source_auth: OAUTH_TOKEN,
    submodel_name: SubmodelName
): Promise<AGENT_OP_RESULT> {
    const submodels = (
        await source_agent.get_submodel_for_all_assets(
            source_auth,
            submodel_name
        )
    ).json.submodels;
    return await handle_multi_post(
        'submodels',
        submodels,
        (submodel: Submodel) => {
            return oi4Client.postSubmodel(submodel);
        },
        (submodel, error) => {
            return `failed to post submodel [${submodel.id}] to oi4 repo: ${
                error.response
                    ? error.response.data.error_description ||
                      error.response.data.title
                    : error
            }`;
        },
        'Failed to retrieve ' + submodel_name + ' Submodels from asset source.'
    );
}

// update submodel for all assets in OI4 repo using source assets
async function update_submodel_for_all_assets(
    source_auth: OAUTH_TOKEN,
    submodel_name: SubmodelName
): Promise<AGENT_OP_RESULT> {
    const all_submodels = (await get_all_submodels()).json.submodels;

    if (all_submodels && all_submodels.length) {
        const old_submodels = all_submodels.filter((item: Submodel) => {
            return item.idShort == submodel_name;
        });
        if (old_submodels && old_submodels.length) {
            const sourceAssetIds = old_submodels.map((item: Submodel) => {
                return source_agent.submodel_id_to_source_asset_id(item.id);
            });
            const submodels_mixed = await Promise.all(
                sourceAssetIds.map(async (id: AssetId) => {
                    const submodel_resp = await source_agent.get_submodel(
                        source_auth,
                        id,
                        submodel_name
                    );
                    if (submodel_resp.status !== 200) {
                        logger.warn('Asset [' + id + '] no longer in source');
                        return undefined;
                    }
                    return submodel_resp.json;
                })
            );
            const submodels = new Array<Submodel>();
            submodels_mixed.forEach((item) => {
                if (item !== undefined) {
                    submodels.push(item);
                }
            });
            return await handle_multi_post(
                'submodels',
                submodels,
                (submodel: Submodel) => {
                    return oi4Client.updateSubmodel(submodel);
                },
                (submodel, error) => {
                    return `failed to update submodel [${
                        submodel.id
                    }] in oi4 repo: ${
                        error.response
                            ? error.response.data.error_description ||
                              error.response.data.title
                            : error
                    }`;
                },
                'Failed to retrieve ' +
                    submodel_name +
                    ' Submodels from asset source.'
            );
        } else {
            return {
                status: 404,
                json: {
                    message:
                        'No ' + submodel_name + ' Submodels found on OI4 Repo.'
                }
            };
        }
    } else {
        return {
            status: 404,
            json: {
                message: 'No Submodels found on OI4 Repo.'
            }
        };
    }
}

// update submodel for specific asset in OI4 repo using source assets
async function update_submodel(
    source_auth: OAUTH_TOKEN,
    asset_id: AssetId,
    submodel_name: SubmodelName
): Promise<AGENT_OP_RESULT> {
    const submodel_resp = await source_agent.get_submodel(
        source_auth,
        asset_id,
        submodel_name
    );
    const submodel = submodel_resp.json;
    const submodel_status = submodel_resp.status;

    if (submodel_status === 200) {
        try {
            const resp = await (await oi4Client.updateSubmodel(submodel)).data;
            return { status: 200, json: resp };
        } catch (error: any) {
            logger.error(
                `failed to update submodel [${submodel.id}] in oi4 repo: ${error}`
            );
            const resp = error.response || { status: 500 };
            return {
                status: resp.status,
                json: {
                    message: `Failed to update Submodel [${submodel.id}] in OI4 Repo`
                }
            };
        }
    } else {
        return {
            status: submodel_status,
            json: {
                message:
                    'Failed to retrieve ' +
                    submodel_name +
                    'Submodel for Asset [' +
                    asset_id +
                    '] from asset source.',
                error: submodel_resp.json
            }
        };
    }
}

// Retrieve all AssetAdministrationShells from OI4 Repo
async function get_all_aas(): Promise<AGENT_OP_RESULT> {
    try {
        const resp = await oi4Client.getAllShells();
        const shells = (await resp.data).result;
        return {
            status: resp.status,
            json: {
                shells
            }
        };
    } catch (error: any) {
        logger.error(`failed to retrieve aas from oi4 repo: ${error}`);
        const resp = error.response || { status: 500 };
        return {
            status: resp.status,
            json: {
                message:
                    'Failed to retrieve Asset Administrations Shells from OI4 Repo'
            }
        };
    }
}

// Retrieve specific AssetAdministrationShell from ÖI4 Repo using Base64 encoded id.
async function get_aas(aas_id: string): Promise<AGENT_OP_RESULT> {
    try {
        const resp = await oi4Client.getShell(aas_id);
        const shell = await resp.data;
        return { status: resp.status, json: shell };
    } catch (error: any) {
        logger.error(
            `failed to get AAS [id: ` +
                decodeBase64(aas_id) +
                `] from OI4: ${error}`
        );
        const resp = error.response || { status: 500 };
        return {
            status: resp.status,
            json: {
                message:
                    'Failed to retrieve Asset Administration Shell [' +
                    decodeBase64(aas_id) +
                    '] in OI4 Repo'
            }
        };
    }
}

// Retrieve all submodels from ÖI4 Repo
async function get_all_submodels(): Promise<AGENT_OP_RESULT> {
    try {
        const resp = await oi4Client.getAllSubmodels();
        const submodels = (await resp.data).result;
        return {
            status: resp.status,
            json: {
                submodels
            }
        };
    } catch (error: any) {
        logger.error(`failed to retrieve submodels from oi4 repo: ${error}`);
        const resp = error.respone || { status: 500 };
        return {
            status: resp.status,
            json: {
                message: 'Failed to retrieve Submodels from OI4 Repo'
            }
        };
    }
}

// Retrieve specific submodel from ÖI4 Repo using Base64 encoded id.
async function get_submodel(submodel_id: string): Promise<AGENT_OP_RESULT> {
    try {
        const resp = await oi4Client.getShell(submodel_id);
        const submodel = await resp.data;
        return { status: resp.status, json: submodel };
    } catch (error: any) {
        logger.error(
            `failed to get Submodel [id: ` +
                decodeBase64(submodel_id) +
                `] from OI4: ${error}`
        );
        const resp = error.response || { status: 500 };
        return {
            status: resp.status,
            json: {
                message:
                    'Failed to retreive Submodel [' +
                    decodeBase64(submodel_id) +
                    '] in OI4 Repo'
            }
        };
    }
}

export default {
    post_aas,
    post_all_aas,
    post_submodel,
    post_submodel_for_all_assets,
    update_aas,
    update_all_aas,
    update_submodel,
    update_submodel_for_all_assets,
    get_aas,
    get_all_aas,
    get_submodel,
    get_all_submodels
};
