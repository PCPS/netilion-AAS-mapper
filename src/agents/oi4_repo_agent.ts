import { logger } from '../services/logger';
import {
    AssetAdministrationShell,
    Reference,
    Submodel,
    SubmodelElement
} from '../oi4_definitions/aas_components';
import { decodeBase64 } from '../oi4_definitions/oi4_helpers';
import source_agent from './netilion_agent';
import { SubmodelName, AssetId } from './netilion_agent';
import { OI4Client } from '../clients/oi4r_repo_api';
import { OAUTH_TOKEN } from '../interfaces/Auth';
import { AGENT_OP_RESULT } from '../interfaces/Agent';
import { Generate_SM_Nameplate } from '../oi4_definitions/submodels/nameplate_sm';
import crypto from 'crypto';
import { Asset } from '../interfaces/BDIH';

function GenerateAasDummies(
    count: number
): Array<{ shell: AssetAdministrationShell; submodels: Array<Submodel> }> {
    const padded_length = count.toString().length;
    const batch_id = crypto.randomUUID();
    const result: Array<{
        shell: AssetAdministrationShell;
        submodels: Array<Submodel>;
    }> = [];
    for (let index = 0; index < count; index++) {
        console.log('latest result: ');
        const index_str = index.toString().padStart(padded_length, '0');
        const shell = new AssetAdministrationShell({
            idShort: 'DummyShell' + batch_id.split('-')[0] + '_' + index_str,
            description: [
                {
                    language: 'en-EN',
                    text: 'Dummy asset administration shell created for testing purposes. Deleted when no longer needed.'
                },
                {
                    language: 'de-DE',
                    text: 'Zu Testzwecken erstellte Dummy-Asset-Verwaltungsshell. Gelöscht, wenn nicht mehr benötigt.'
                }
            ],
            id: 'http://testshells.io/' + batch_id + '/shells/' + index_str,
            assetInformation: {
                assetKind: 'Instance',
                globalAssetId:
                    'urn:conplement:aas:type:' + index_str + '_' + batch_id,
                specificAssetIds: [
                    {
                        name: 'somedatabase',
                        value:
                            'somedatabaseid-' +
                            batch_id +
                            '-' +
                            index_str +
                            '-' +
                            0
                    },
                    {
                        name: 'otherdatabase',
                        value:
                            'otherdatabaseid-' +
                            batch_id +
                            '-' +
                            index_str +
                            '-' +
                            1
                    }
                ]
            },
            submodels: []
        });

        const submodels: Array<Submodel> = [
            new Submodel(
                Generate_SM_Nameplate(
                    {
                        URIOfTheProduct:
                            'de.endress.com/en/ABCDETEST' + index_str,
                        ManufacturerName: [
                            { language: 'en', text: 'Endress+Hauser' }
                        ],
                        ManufacturerProductDesignation: [
                            { language: 'en', text: 'Custom Test Product' }
                        ],
                        YearOfConstruction: '2024',
                        ContactInformation: {
                            NationalCode: [{ language: 'en', text: 'de' }],
                            CityTown: [
                                { language: 'de', text: 'Weil am Rhein' }
                            ],
                            Street: [
                                {
                                    language: 'de',
                                    text: 'Colmarer Straße 6'
                                }
                            ],
                            Zipcode: [{ language: 'en', text: '79576' }]
                        }
                    },
                    'http://testshells.io/' +
                        batch_id +
                        '/shells/' +
                        index_str +
                        '/submodels/nameplate'
                )
            )
        ];
        shell.submodels = submodels.map((item) => {
            return {
                type: 'ModelReference',
                keys: [{ type: 'Submodel', value: item.id }]
            };
        });
        result.push({ shell, submodels });
    }
    console.log('generated ' + result.length + ' dummies:');
    console.log(result);

    return result;
}

const oi4Client = new OI4Client();

// update AssetAdministrationShell in OI4 repo
async function post_aas(
    shell: AssetAdministrationShell
): Promise<AGENT_OP_RESULT> {
    try {
        const resp = await oi4Client.postShell(shell);
        const data = await resp.data;
        return { status: 200, json: data };
    } catch (error: any) {
        logger.error(`failed to post aas [${shell.id}] in oi4 repo: ${error}`);
        const resp = error.response || { status: 500, data: {} };
        return {
            status: resp.status,
            json: {
                message:
                    'Failed to post AssetAdministrationShell [' +
                    shell.id +
                    '] to OI4 Repo'
            }
        };
    }
}

// Update AssetAdministrationShell in OI4 repo
async function update_aas(
    shell: AssetAdministrationShell
): Promise<AGENT_OP_RESULT> {
    try {
        const resp = await oi4Client.updateShell(shell);

        return { status: 200, json: shell };
    } catch (error: any) {
        logger.error(`failed to post aas [${shell.id}] in oi4 repo: ${error}`);
        const resp = error.response || { status: 500, data: {} };
        return {
            status: resp.status,
            json: {
                message:
                    'Failed to update AssetAdministrationShell [' +
                    shell.id +
                    '] in OI4 Repo'
            }
        };
    }
}

// Post submodel to OI4 Repo
// This function no longer works with the new AASphere API, as Submodels cannot be requested independantly from a Shell.
/*
async function post_submodel(
    submodel: Submodel
): Promise<AGENT_OP_RESULT> {
    try {
        const resp = await oi4Client.postSubmodel(submodel);
        const data = await resp.data;

        return {
            status: resp.status,
            json: data
        };
    } catch (error: any) {
        logger.error(
            `failed to post ${submodel.idShort || 'UNKNOWN'} submodel with ID ${
                submodel.id
            } to oi4 repo: ${error}`
        );
        const resp = error.response || { status: 500, data: {} };
        return {
            status: resp.status,
            json: {
                message: resp.data.error_description || error.message
            }
        };
    }
}
*/

// Post submodel for specific shell to OI4 Repo
async function post_submodel_of_aas(
    aas_id: string,
    submodel: Submodel
): Promise<AGENT_OP_RESULT> {
    try {
        const resp = await oi4Client.postSubmodel(aas_id, submodel);
        const data = await resp.data;

        return {
            status: resp.status,
            json: data
        };
    } catch (error: any) {
        logger.error(
            `failed to post ${submodel.idShort || 'UNKNOWN'} submodel with ID ${
                submodel.id
            } to oi4 repo: ${error}`
        );
        const resp = error.response || { status: 500, data: {} };
        return {
            status: resp.status,
            json: {
                message: resp.data.error_description || error.message
            }
        };
    }
}

// Update submodel in OI4 Repo
// This function no longer works with the new AASphere API, as Submodels cannot be requested independantly from a Shell.
/*
async function update_submodel(
    aas_id: string,
    submodel: Submodel
): Promise<AGENT_OP_RESULT> {
    try {
        const resp = await oi4Client.updateSubmodel(aas_id, submodel);

        return {
            status: 200,
            json: submodel
        };
    } catch (error: any) {
        logger.error(
            `failed to update ${
                submodel.idShort || 'UNKNOWN'
            } submodel with ID ${submodel.id} in oi4 repo: ${error}`
        );
        const resp = error.response || { status: 500, data: {} };
        return {
            status: resp.status,
            json: {
                message: resp.data.error_description || error.message
            }
        };
    }
}
*/

// Update submodel for specific shell in OI4 Repo
async function update_submodel_of_aas(
    aas_id: string,
    submodel: Submodel
): Promise<AGENT_OP_RESULT> {
    try {
        const resp = await oi4Client.updateSubmodel(aas_id, submodel);

        return {
            status: 200,
            json: submodel
        };
    } catch (error: any) {
        logger.error(
            `failed to update ${
                submodel.idShort || 'UNKNOWN'
            } submodel with ID ${submodel.id} in oi4 repo: ${error}`
        );
        const resp = error.response || { status: 500, data: {} };
        return {
            status: resp.status,
            json: {
                message: resp.data.error_description || error.message
            }
        };
    }
}

// Retrieve all AssetAdministrationShells from OI4 Repo
async function get_all_aas(): Promise<AGENT_OP_RESULT> {
    const page: { page_number: number; page_cursor: string } = {
        page_number: 0,
        page_cursor: ''
    };

    async function get_all_aas_recursive(cursor?: string): Promise<{
        status: number;
        data: Promise<{ result: Array<AssetAdministrationShell> }>;
    }> {
        page.page_cursor = cursor || '';
        page.page_number++;
        console.log('loading page:');
        console.log(page);
        let shells: Array<AssetAdministrationShell> = [];
        let res_status: number;
        return oi4Client
            .getAllShells(cursor)
            .then((page_res) => {
                res_status = page_res.status;
                return page_res.data;
            })
            .then((page_data) => {
                if (page_data.paging_metadata.cursor) {
                    shells = page_data.result;
                    return get_all_aas_recursive(
                        page_data.paging_metadata.cursor
                    );
                } else {
                    return Promise.resolve({
                        status: res_status,
                        data: Promise.resolve({ result: [] })
                    });
                }
            })
            .then((final) => {
                res_status = final.status;
                return final.data;
            })
            .then((final_data) => {
                shells = shells.concat(final_data.result);
                return Promise.resolve({
                    status: res_status,
                    data: Promise.resolve({ result: shells })
                });
            });
    }
    try {
        const resp = await get_all_aas_recursive();
        const shells = (await resp.data).result;
        return {
            status: 200,
            json: {
                shells
            }
        };
    } catch (error: any) {
        logger.error(`failed to retrieve aas from oi4 repo: ${error}`);
        const resp = error.response || { status: 500, data: {} };
        return {
            status: resp.status,
            json: {
                message:
                    'Failed to retrieve Asset Administrations Shells from OI4 Repo'
            }
        };
    }
}

// Retrieve specific AssetAdministrationShell from OI4 Repo using decoded id.
async function get_aas(aas_id: string): Promise<AGENT_OP_RESULT> {
    try {
        const resp = await oi4Client.getShell(aas_id);
        const shell = await resp.data;
        return { status: resp.status, json: shell };
    } catch (error: any) {
        logger.error(
            `failed to get AAS [id: ` + aas_id + `] from OI4: ${error}`
        );
        const resp = error.response || { status: 500, data: {} };
        return {
            status: resp.status,
            json: {
                message:
                    'Failed to retrieve AssetAdministrationShell [' +
                    aas_id +
                    '] in OI4 Repo'
            }
        };
    }
}

// Delete specific AssetAdministrationShell from OI4 Repo using decoded id.
async function delete_aas(aas_id: string): Promise<AGENT_OP_RESULT> {
    try {
        const resp = await oi4Client.deleteShell(aas_id);
        const shell = await resp.data;
        return { status: resp.status, json: shell };
    } catch (error: any) {
        logger.error(
            `failed to get AAS [id: ` + aas_id + `] from OI4: ${error}`
        );
        const resp = error.response || { status: 500, data: {} };
        return {
            status: resp.status,
            json: {
                message:
                    'Failed to delete AssetAdministrationShell [' +
                    aas_id +
                    '] in OI4 Repo'
            }
        };
    }
}

// Retrieve all submodels from OI4 Repo (old)
// This version does not work with the new AASphere API due to unavailability of the /submodels/ endpoint.
// Other version below works on both APIs albeit with slower performance.
/* 
async function get_all_submodels(): Promise<AGENT_OP_RESULT> {
    try {
        const resp = await oi4Client.getAllSubmodels();
        const submodels = (await resp.data).result;
        return {
            status: 200,
            json: {
                submodels
            }
        };
    } catch (error: any) {
        logger.error(`failed to retrieve submodels from oi4 repo: ${error}`);
        const resp = error.response || { status: 500, data: {} };
        return {
            status: resp.status,
            json: {
                message: 'Failed to retrieve Submodels from OI4 Repo'
            }
        };
    }
}
*/

// Retrieve all submodels from OI4 Repo (new)
async function get_all_submodels(): Promise<AGENT_OP_RESULT> {
    try {
        const shells_op_res = await get_all_aas();
        const shells = shells_op_res.json.shells;
        const aas_sm_ids: Array<{ shell_id: string; sm_id: string }> = [];
        shells.forEach((shell: AssetAdministrationShell) => {
            shell.submodels?.forEach((ref: Reference) => {
                aas_sm_ids.push({
                    shell_id: shell.id,
                    sm_id: ref.keys[0].value
                });
            });
        });
        const submodel_resp_promises = aas_sm_ids.map((item) => {
            return oi4Client.getSubmodel(item.shell_id, item.sm_id);
        });

        const submodel_resp_reslolutions = await Promise.allSettled(
            submodel_resp_promises
        );

        submodel_resp_reslolutions.forEach((item, index) => {
            if (item.status == 'rejected') {
                logger.error(
                    'failed to retirieve submodel ' +
                        aas_sm_ids[index].sm_id +
                        ' for shell ' +
                        aas_sm_ids[index].shell_id +
                        ' from OI4 repo: ' +
                        item.reason
                );
            }
        });

        const submodel_promises = submodel_resp_reslolutions
            .filter((item) => item.status == 'fulfilled')
            .map((item: any) => item.value.data);

        const submodels = await Promise.all(submodel_promises);

        return {
            status: 200,
            json: {
                submodels
            }
        };
    } catch (error: any) {
        logger.error(`failed to retrieve submodels from oi4 repo: ${error}`);
        const resp = error.response || { status: 500, data: {} };
        return {
            status: resp.status,
            json: {
                message: 'Failed to retrieve Submodels from OI4 Repo'
            }
        };
    }
}

// Retrieve all submodels for specific shell from OI4 Repo using decoded aas id
async function get_all_submodels_of_aas(
    aas_id: string
): Promise<AGENT_OP_RESULT> {
    try {
        const resp = await oi4Client.getAllSubmodels(aas_id);
        const submodels = (await resp.data).result;
        return {
            status: 200,
            json: {
                submodels
            }
        };
    } catch (error: any) {
        logger.error(`failed to retrieve submodels from oi4 repo: ${error}`);
        const resp = error.response || { status: 500, data: {} };
        return {
            status: resp.status,
            json: {
                message: 'Failed to retrieve Submodels from OI4 Repo'
            }
        };
    }
}

// This function no longer works with the new AASphere API, as Submodels cannot be requested independantly from a Shell.
// Retrieve specific submodel from OI4 Repo using decoded id.
/*
async function get_submodel(submodel_id: string): Promise<AGENT_OP_RESULT> {
    try {
        const resp = await oi4Client.getSubmodel(submodel_id);
        const submodel = await resp.data;
        return { status: resp.status, json: submodel };
    } catch (error: any) {
        logger.error(
            `failed to get Submodel [id: ` +
                submodel_id +
                `] from OI4: ${error}`
        );
        const resp = error.response || { status: 500, data: {} };
        return {
            status: resp.status,
            json: {
                message:
                    'Failed to retrieve Submodel [' +
                    submodel_id +
                    '] in OI4 Repo'
            }
        };
    }
}
*/

// Retrieve specific submodel for specific shell from OI4 Repo using decoded id.
async function get_submodel_of_aas(
    aas_id: string,
    submodel_id: string
): Promise<AGENT_OP_RESULT> {
    try {
        const resp = await oi4Client.getSubmodel(aas_id, submodel_id);
        const submodel = await resp.data;
        return { status: resp.status, json: submodel };
    } catch (error: any) {
        logger.error(
            `failed to get Submodel [id: ` +
                submodel_id +
                `] from OI4: ${error}`
        );
        const resp = error.response || { status: 500, data: {} };
        return {
            status: resp.status,
            json: {
                message:
                    'Failed to retrieve Submodel [' +
                    submodel_id +
                    '] in OI4 Repo'
            }
        };
    }
}

// This function no longer works with the new AASphere API, as Submodels cannot be deleted independantly from a Shell.
// Delete specific submodel from OI4 Repo using decoded id.
/*
async function delete_submodel(submodel_id: string): Promise<AGENT_OP_RESULT> {
    try {
        const resp = await oi4Client.deleteSubmodel(submodel_id);
        const submodel = await resp.data;
        return { status: resp.status, json: submodel };
    } catch (error: any) {
        logger.error(
            `failed to delete Submodel [id: ` +
                submodel_id +
                `] from OI4: ${error}`
        );
        const resp = error.response || { status: 500, data: {} };
        return {
            status: resp.status,
            json: {
                message:
                    'Failed to delete Submodel [' +
                    submodel_id +
                    '] in OI4 Repo'
            }
        };
    }
}
*/

// Delete specific submodel for specific shell from OI4 Repo using decoded id.
async function delete_submodel_of_aas(
    aas_id: string,
    submodel_id: string
): Promise<AGENT_OP_RESULT> {
    try {
        const resp = await oi4Client.deleteSubmodel(aas_id, submodel_id);
        const submodel = await resp.data;
        return { status: resp.status, json: submodel };
    } catch (error: any) {
        logger.error(
            `failed to delete Submodel [id: ` +
                submodel_id +
                `] from OI4: ${error}`
        );
        const resp = error.response || { status: 500, data: {} };
        return {
            status: resp.status,
            json: {
                message:
                    'Failed to delete Submodel [' +
                    submodel_id +
                    '] in OI4 Repo'
            }
        };
    }
}

// This function no longer works with the new AASphere API, as Submodels cannot be deleted independantly from a Shell.
// Submit (post, if unsuccessful then put) specific submodel from OI4 Repo using decoded id.
/*
async function submit_submodel(sm: Submodel) {
    const post_result = await post_submodel(sm);
    if (post_result.status === 409) {
        const update_result = await update_submodel(sm);
        return { status: update_result.status, json: update_result.json };
    } else {
        return { status: post_result.status, json: post_result.json };
    }
}
*/

// Submit (post, if unsuccessful then put) specific submodel for specific shell from OI4 Repo using decoded id.
async function submit_submodel_of_aas(aas_id: string, sm: Submodel) {
    const post_result = await post_submodel_of_aas(aas_id, sm);
    if (post_result.status === 409) {
        const update_result = await update_submodel_of_aas(aas_id, sm);
        return { status: update_result.status, json: update_result.json };
    } else {
        return { status: post_result.status, json: post_result.json };
    }
}

async function submit_aas(aas: AssetAdministrationShell) {
    const post_result = await post_aas(aas);
    if (post_result.status === 409) {
        const update_result = await update_aas(aas);
        return { status: update_result.status, json: update_result.json };
    } else {
        return { status: post_result.status, json: post_result.json };
    }
}

export async function multi_submit<T>(
    array_name: string,
    item_array: Array<T>,
    submit_function: (item: T) => Promise<AGENT_OP_RESULT>
): Promise<AGENT_OP_RESULT> {
    let fail_found: boolean = false;
    let success_found: boolean = false;

    const results = await Promise.all(
        item_array.map(async (item: T) => {
            const resp = await submit_function(item);
            if (resp.status >= 200 && resp.status < 300) {
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

export async function passthrough(q: string, p: Record<string, any>) {
    try {
        const resp = await oi4Client.direct(q, p);
        const result = await resp.data;
        return { status: resp.status, headers: resp.headers, raw: result };
    } catch (error: any) {
        logger.error(`passthrough failed [query: ` + q + `] to OI4: ${error}`);
        const resp = error.response || { status: 500, data: {} };
        console.log(resp);
        return {
            status: resp.status,
            json: {
                message: 'Failed to pass [' + q + '] through to OI4 Repo'
            }
        };
    }
}

export async function submit_dummies(count: number) {
    const dummies = GenerateAasDummies(count);
    const shell_result_promises = dummies.map((dummy) => {
        return submit_aas(dummy.shell);
    });
    const sm_result_promises = shell_result_promises.map((prom, index) => {
        return prom.then((shell_res) => {
            return Promise.all(
                dummies[index].submodels.map((sm) => {
                    return submit_submodel_of_aas(shell_res.json.id, sm);
                })
            );
        });
    });
    return Promise.all(shell_result_promises).then((shells_result) => {
        return Promise.all(sm_result_promises).then((sms_result) => {
            return {
                status: 207,
                json: shells_result.map((shell_res, idx) => {
                    return [shell_res].concat(sms_result[idx]);
                })
            };
        });
    });
}

export default {
    post_aas,
    post_submodel_of_aas,
    update_aas,
    update_submodel_of_aas,
    get_aas,
    get_all_aas,
    get_submodel_of_aas,
    get_all_submodels,
    get_all_submodels_of_aas,
    submit_aas,
    submit_submodel_of_aas,
    delete_submodel_of_aas,
    delete_aas,
    multi_submit,
    passthrough,
    submit_dummies
};
