import { logger } from './logger';
import {
    AssetAdministrationShell,
    Submodel,
    SubmodelElement
} from '../oi4_definitions/aas_components';
import { decodeBase64 } from './oi4_helpers';
import netilion from './netilion_agent';
import { OI4Client } from './oi4RepoAPI';
import { Property } from '../oi4_definitions/submodel_elements';

const oi4Client = new OI4Client();

interface agent_op_result {
    status: number;
    json: any;
}

// Post all AssetAdministrationSells created from Netilion assets to OI4 Repo
async function postAllEHAASToOI4(): Promise<agent_op_result> {
    const shells = await netilion.allEHAAS();

    if (shells) {
        const results = shells.map(async (shell: AssetAdministrationShell) => {
            try {
                const resp = await (await oi4Client.postShell(shell)).data;
                return { status: 'success', shell: resp };
            } catch (error: any) {
                logger.error(
                    `failed to post shell [${shell.idShort}] to oi4 repo: ${error}`
                );
                const resp = error.respone || { status: 500 };
                return {
                    status: 'failed',
                    details: {
                        id: shell.id,
                        status: resp.status,
                        error: error.message
                    }
                };
            }
        });

        const RESPS = await Promise.all(results);
        let successful: Array<AssetAdministrationShell> = [];
        let failed: Array<{ id: string; error: string } | undefined> = [];
        RESPS.forEach((item) => {
            if (item.status == 'success') {
                successful.push(item.shell);
            } else {
                failed.push(item.details);
            }
        });

        return {
            status: 200,
            json: {
                successful,
                failed
            }
        };
    } else {
        return {
            status: 404,
            json: {
                message:
                    'Failed to retrieve Asset Administration Shells from Netilion.'
            }
        };
    }
}

// update all AssetAdministrationShells in OI4 repo using Netilion assets
async function updateEHAASInOI4(asset_id: string): Promise<agent_op_result> {
    const shell = await netilion.EHAAS(asset_id);

    if (shell) {
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
            status: 404,
            json: {
                message:
                    'Failed to retrieve Asset Administration Shell for Asset [' +
                    asset_id +
                    '] from Netilion.'
            }
        };
    }
}

// Post all Nameplate submodels created from Netilion assets to OI4 Repo
async function postAllEHNameplatesToOI4(): Promise<agent_op_result> {
    const nameplates = await netilion.allEHNameplates();

    if (nameplates) {
        const results = nameplates.map(async (nameplate: Submodel) => {
            try {
                const resp = await (
                    await oi4Client.postSubmodel(nameplate)
                ).data;
                return { status: 'success', nameplate: resp };
            } catch (error: any) {
                logger.error(
                    `failed to post submodel [${nameplate.id}] to oi4 repo: ${error}`
                );

                const resp = error.respone || { status: 500 };
                return {
                    status: 'failed',
                    details: {
                        id: nameplate.id,
                        status: resp.status,
                        error: error.message
                    }
                };
            }
        });

        const RESPS = await Promise.all(results);
        let successful: Array<Submodel> = [];
        let failed: Array<{ id: string; error: string } | undefined> = [];
        RESPS.forEach((item) => {
            if (item.status == 'success') {
                successful.push(item.nameplate);
            } else {
                failed.push(item.details);
            }
        });

        return {
            status: 200,
            json: {
                successful,
                failed
            }
        };
    } else {
        return {
            status: 404,
            json: {
                message: 'Failed to retrieve Nameplate Submodels from Netilion.'
            }
        };
    }
}

// update all Nameplate submodels in OI4 repo using Netilion assets
async function updateEHNameplatesInOI4(
    asset_id: string
): Promise<agent_op_result> {
    const nameplate = await netilion.EHNameplate(asset_id);

    if (nameplate) {
        try {
            const resp = await (await oi4Client.updateSubmodel(nameplate)).data;
            return { status: 200, json: resp };
        } catch (error: any) {
            logger.error(
                `failed to update submodel [${nameplate.id}] in oi4 repo: ${error}`
            );
            const resp = error.response || { status: 500 };
            return {
                status: resp.status,
                json: {
                    message: `Failed to update Submodel [${nameplate.id}] in OI4 Repo`
                }
            };
        }
    } else {
        return {
            status: 404,
            json: {
                message:
                    'Failed to retrieve Nameplate Submodel for Asset [' +
                    asset_id +
                    '] from Netilion.'
            }
        };
    }
}

// Post all ConfigurationAsBuilt submodels created from Netilion assets to OI4 Repo
async function postAllEHConfigurationsAsBuiltToOI4(): Promise<agent_op_result> {
    const configurations_as_built = await netilion.allEHConfigurationsAsBuilt();

    if (configurations_as_built) {
        const results = configurations_as_built.map(
            async (configurations_as_built: Submodel) => {
                try {
                    const resp = await (
                        await oi4Client.postSubmodel(configurations_as_built)
                    ).data;
                    return {
                        status: 'success',
                        configurations_as_built: resp
                    };
                } catch (error: any) {
                    logger.error(
                        `failed to post submodel [${configurations_as_built.id}] to oi4 repo: ${error}`
                    );

                    const resp = error.respone || { status: 500 };
                    return {
                        status: 'failed',
                        details: {
                            id: configurations_as_built.id,
                            status: resp.status,
                            error: error.message
                        }
                    };
                }
            }
        );

        const RESPS = await Promise.all(results);
        let successful: Array<Submodel> = [];
        let failed: Array<
            { id: string; status: string; error: string } | undefined
        > = [];
        RESPS.forEach((item) => {
            if (item.status == 'success') {
                successful.push(item.configurations_as_built);
            } else {
                failed.push(item.details);
            }
        });

        return {
            status: 200,
            json: {
                successful,
                failed
            }
        };
    } else {
        return {
            status: 404,
            json: {
                message:
                    'Failed to retrieve ConfigurationAsBuilt Submodels from Netilion.'
            }
        };
    }
}

// update specific ConfigurationAsBuilt submodel in OI4 repo using Netilion asset
async function updateEHConfigurationsAsBuiltInOI4(
    asset_id: string
): Promise<agent_op_result> {
    const configuration_as_built = await netilion.EHConfigurationAsBuilt(
        asset_id
    );

    if (configuration_as_built) {
        try {
            const resp = await (
                await oi4Client.updateSubmodel(configuration_as_built)
            ).data;
            return { status: 200, json: resp };
        } catch (error: any) {
            logger.error(
                `failed to update submodel [${configuration_as_built.id}] in oi4 repo: ${error}`
            );
            const resp = error.respone || { status: 500 };
            return {
                status: resp.status,
                json: {
                    message: `Failed to update Submodel [${configuration_as_built.id}] in OI4 Repo`
                }
            };
        }
    } else {
        return {
            status: 404,
            json: {
                message:
                    'Failed to retrieve ConfigurationAsBuilt Submodel for Asset [' +
                    asset_id +
                    '] from Netilion.'
            }
        };
    }
}

// update all ConfigurationAsBuilt submodels in OI4 repo using Netilion assets
async function updateAllEHConfigurationsAsBuiltInOI4(): Promise<agent_op_result> {
    const submodels = (await getAllSubmodelsFromOI4()).json.submodels;
    if (submodels && submodels.length) {
        const configurations_as_built = submodels.filter((item: Submodel) => {
            return item.idShort == 'ConfigurationAsBuilt';
        });
        if (configurations_as_built && configurations_as_built.length) {
            const netilionAssetIds = configurations_as_built.map(
                (item: Submodel) => {
                    return item.submodelElements?.find(
                        (element: SubmodelElement) => {
                            return element.idShort == 'NetilionAssetId';
                        }
                    );
                }
            );
            const results = netilionAssetIds.map(async (item: Property) => {
                try {
                    const resp = await updateEHConfigurationsAsBuiltInOI4(
                        item.value
                    );
                    if (resp.status >= 200 && resp.status < 300) {
                        return {
                            id: item.value,
                            status: 'success',
                            response: resp.json
                        };
                    } else {
                        return {
                            id: item.value,
                            status: 'failed',
                            details: resp.json.message
                        };
                    }
                } catch (error: any) {
                    logger.error(
                        `failed to update ConfigurationAs planned submodels in oi4 repo: ${error}`
                    );

                    const resp = error.respone || { status: 500 };
                    return {
                        status: 'failed',
                        details: {
                            id: item.value,
                            status: resp.status,
                            error: error.message
                        }
                    };
                }
            });
            const RESPS = await Promise.all(results);
            let successful: Array<{
                id: string;
                configuration_as_built: any;
            }> = [];
            let failed: Array<
                { id: string; status: string; error: string } | undefined
            > = [];
            RESPS.forEach((item) => {
                if (item.status == 'success') {
                    successful.push({
                        id: item.id,
                        configuration_as_built: item.configuration_as_built
                    });
                } else {
                    failed.push(item.details);
                }
            });

            return {
                status: 200,
                json: {
                    successful,
                    failed
                }
            };
        } else {
            return {
                status: 404,
                json: {
                    message:
                        'No ConfigurationAsBuilt Submodels found on OI4 Repo.'
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

// Post all ConfigurationAsDocumented submodels created from Netilion assets to OI4 Repo
async function postAllEHConfigurationsAsDocumentedToOI4(): Promise<agent_op_result> {
    const configurations_as_documented =
        await netilion.allEHConfigurationsAsDocumented();

    if (configurations_as_documented) {
        const results = configurations_as_documented.map(
            async (configurations_as_documented: Submodel) => {
                try {
                    const resp = await (
                        await oi4Client.postSubmodel(
                            configurations_as_documented
                        )
                    ).data;
                    return {
                        status: 'success',
                        configurations_as_documented: resp
                    };
                } catch (error: any) {
                    logger.error(
                        `failed to post submodel [${configurations_as_documented.id}] to oi4 repo: ${error}`
                    );

                    const resp = error.respone || { status: 500 };
                    return {
                        status: 'failed',
                        details: {
                            id: configurations_as_documented.id,
                            status: resp.status,
                            error: error.message
                        }
                    };
                }
            }
        );

        const RESPS = await Promise.all(results);
        let successful: Array<Submodel> = [];
        let failed: Array<
            { id: string; status: string; error: string } | undefined
        > = [];
        RESPS.forEach((item) => {
            if (item.status == 'success') {
                successful.push(item.configurations_as_documented);
            } else {
                failed.push(item.details);
            }
        });

        return {
            status: 200,
            json: {
                successful,
                failed
            }
        };
    } else {
        return {
            status: 404,
            json: {
                message:
                    'Failed to retrieve ConfigurationAsDocumented Submodels from Netilion.'
            }
        };
    }
}

// update specific ConfigurationAsDocumented submodel in OI4 repo using Netilion asset
async function updateEHConfigurationsAsDocumentedInOI4(
    asset_id: string
): Promise<agent_op_result> {
    const configuration_as_documented =
        await netilion.EHConfigurationAsDocumented(asset_id);

    if (configuration_as_documented) {
        try {
            const resp = await (
                await oi4Client.updateSubmodel(configuration_as_documented)
            ).data;
            return { status: 200, json: resp };
        } catch (error: any) {
            logger.error(
                `failed to update submodel [${configuration_as_documented.id}] in oi4 repo: ${error}`
            );
            const resp = error.respone || { status: 500 };
            return {
                status: resp.status,
                json: {
                    message: `Failed to update Submodel [${configuration_as_documented.id}] in OI4 Repo`
                }
            };
        }
    } else {
        return {
            status: 404,
            json: {
                message:
                    'Failed to retrieve ConfigurationAsDocumented Submodel for Asset [' +
                    asset_id +
                    '] from Netilion.'
            }
        };
    }
}

// update all ConfigurationAsDocumented submodels in OI4 repo using Netilion assets
async function updateAllEHConfigurationsAsDocumentedInOI4(): Promise<agent_op_result> {
    const submodels = (await getAllSubmodelsFromOI4()).json.submodels;
    if (submodels && submodels.length) {
        const configurations_as_documented = submodels.filter(
            (item: Submodel) => {
                return item.idShort == 'ConfigurationAsDocumented';
            }
        );
        if (
            configurations_as_documented &&
            configurations_as_documented.length
        ) {
            const netilionAssetIds = configurations_as_documented.map(
                (item: Submodel) => {
                    return item.submodelElements?.find(
                        (element: SubmodelElement) => {
                            return element.idShort == 'NetilionAssetId';
                        }
                    );
                }
            );
            const results = netilionAssetIds.map(async (item: Property) => {
                try {
                    const resp = await updateEHConfigurationsAsDocumentedInOI4(
                        item.value
                    );
                    if (resp.status >= 200 && resp.status < 300) {
                        return {
                            id: item.value,
                            status: 'success',
                            response: resp.json
                        };
                    } else {
                        return {
                            id: item.value,
                            status: 'failed',
                            details: resp.json.message
                        };
                    }
                } catch (error: any) {
                    logger.error(
                        `failed to update ConfigurationAs planned submodels in oi4 repo: ${error}`
                    );

                    const resp = error.respone || { status: 500 };
                    return {
                        status: 'failed',
                        details: {
                            id: item.value,
                            status: resp.status,
                            error: error.message
                        }
                    };
                }
            });
            const RESPS = await Promise.all(results);
            let successful: Array<{
                id: string;
                configuration_as_documented: any;
            }> = [];
            let failed: Array<
                { id: string; status: string; error: string } | undefined
            > = [];
            RESPS.forEach((item) => {
                if (item.status == 'success') {
                    successful.push({
                        id: item.id,
                        configuration_as_documented:
                            item.configuration_as_documented
                    });
                } else {
                    failed.push(item.details);
                }
            });

            return {
                status: 200,
                json: {
                    successful,
                    failed
                }
            };
        } else {
            return {
                status: 404,
                json: {
                    message:
                        'No ConfigurationAsDocumented Submodels found on OI4 Repo.'
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

// Retrieve all AssetAdministrationShells from ÖI4 Repo
async function getAllAASFromOI4(): Promise<agent_op_result> {
    try {
        const resp = await oi4Client.getAllShells();
        const shells = await resp.data;
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
async function getAASFromOI4(aas_id: string): Promise<agent_op_result> {
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
async function getAllSubmodelsFromOI4(): Promise<agent_op_result> {
    try {
        const resp = await oi4Client.getAllSubmodels();
        const submodels = await resp.data;
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
async function getSubmodelFromOI4(
    submodel_id: string
): Promise<agent_op_result> {
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
