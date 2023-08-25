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
        const resp = error.response || { status: 500 };
        return {
            status: resp.status,
            json: {
                message:
                    'Failed to post Asset Administration Shell [' +
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
}

// Post submodel to OI4 Repo
async function post_submodel(submodel: Submodel): Promise<AGENT_OP_RESULT> {
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
        const resp = error.response || { status: 500 };
        return {
            status: resp.status,
            json: {
                message: resp.error_description || error.message
            }
        };
    }
}

// Update submodel in OI4 Repo
async function update_submodel(submodel: Submodel): Promise<AGENT_OP_RESULT> {
    try {
        const resp = await oi4Client.updateSubmodel(submodel);

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
        const resp = error.response || { status: 500 };
        return {
            status: resp.status,
            json: {
                message: resp.error_description || error.message
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
            status: 200,
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
            status: 200,
            json: {
                submodels
            }
        };
    } catch (error: any) {
        logger.error(`failed to retrieve submodels from oi4 repo: ${error}`);
        const resp = error.response || { status: 500 };
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
        const resp = await oi4Client.getSubmodel(submodel_id);
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

async function submit_submodel(sm: Submodel) {
    const post_result = await post_submodel(sm);
    if (post_result.status === 409) {
        const update_result = await update_submodel(sm);
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

export default {
    post_aas,
    post_submodel,
    update_aas,
    update_submodel,
    get_aas,
    get_all_aas,
    get_submodel,
    get_all_submodels,
    submit_aas,
    submit_submodel
};
