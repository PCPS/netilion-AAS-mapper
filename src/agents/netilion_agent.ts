import { Request, Response, NextFunction } from 'express';
import {
    Submodel,
    AssetAdministrationShell,
    Reference
} from '../oi4_definitions/aas_components';
import { Generate_SM_Nameplate } from '../oi4_definitions/submodels/nameplate_sm';
import { logger } from '../services/logger';
import {
    netilionAssetIdToShellId,
    netilionAssetIdToSubmodelId,
    netilionAssetToNameplateInput,
    netilionAssetToTechnicalDaataInput
} from '../services/mappers';
import { NetelionClient } from '../clients/netilion_api';
import { Generate_SM_ConfigurationAsBuilt } from '../oi4_definitions/submodels/configuration_as_built_sm';
import { Generate_SM_ConfigurationAsDocumented } from '../oi4_definitions/submodels/configuration_as_documented_sm';
import {
    NetilionAsset,
    NetilionAssetId,
    NetilionProduct,
    NetilionSpecification
} from '../interfaces/Netilion';
import { OAUTH_TOKEN } from '../interfaces/Auth';
import { AGENT_OP_RESULT } from '../interfaces/Agent';
import { json } from 'body-parser';
if (process.env.NODE_ENV !== 'production') {
    const dotenv = require('dotenv');
    // Use dev dependency
    dotenv.config();
}

const netilionClient = new NetelionClient();

export type SubmodelName =
    | 'Nameplate'
    // | 'ContactInformation'
    // | 'HandoverDucumentation'
    | 'ConfigurationAsBuilt'
    | 'ConfigurationAsDocumented';

export type submodel_name =
    | 'nameplate'
    // | 'ContactInformation'
    // | 'HandoverDucumentation'
    | 'configuration_as_built'
    | 'configuration_as_documented';

export type AssetId = NetilionAssetId;

function netilion_error_to_agent_error(
    error: any,
    message: string
): AGENT_OP_RESULT {
    const resp = error.response || { status: 500, data: {} };
    resp.data.errors = resp.data.errors || [];
    if (resp.data.errors.length) {
        const errors = resp.data.errors.map(
            (e: { type: string; message: string }) => {
                return {
                    status: resp.status,
                    json: {
                        message:
                            error.message +
                            ' (' +
                            (e.message || error.type) +
                            ').'
                    }
                };
            }
        );
        return {
            status: 502,
            json: {
                message,
                error: errors
            }
        };
    }
    return {
        status: 502,
        json: {
            message,
            error: {
                status: resp.status,
                json: {
                    message: resp.data.error_description || error.message
                }
            }
        }
    };
}

// Retrieve all document category IDs corresponding to the VDI standard within netilion
async function get_vdi_categories(auth: OAUTH_TOKEN): Promise<Array<any>> {
    //TODO: add category schema for return type
    try {
        let cats: Array<any> = [];
        let page_number = 1;
        let page = await (await netilionClient.getVDICategories(auth)).data;
        while (page.pagination.next) {
            page_number++;
            cats.push(page.categories);
            page = await (
                await netilionClient.getAllAssets(auth, page_number)
            ).data;
        }
        cats.push(page.categories);

        const CATS = (await Promise.all(cats)).reduce((a, b) => {
            a = a.concat(b);
            return a;
        });
        return CATS;
    } catch (error: any) {
        logger.error(`failed to get VDI categories from netilion: ${error}`);
        error.message += ': Failed to get VDI category IDs from Netilion';
        throw error;
    }
}

// Get names of idShort of all implemented submodels
function defined_submodel_names(): Array<SubmodelName> {
    return ['Nameplate', 'ConfigurationAsBuilt', 'ConfigurationAsDocumented'];
}

// Get list of valid submodels for asset
async function asset_submodel_names(
    auth: OAUTH_TOKEN,
    asset_id: AssetId
): Promise<Array<SubmodelName>> {
    const sm_names: Array<SubmodelName> = ['Nameplate'];
    try {
        const specs = await get_asset_specifications(auth, asset_id);
        if (
            specs['anfangswert_des_messbereiches'] &&
            specs['anfangswert_des_messbereiches']
        ) {
            return [
                'Nameplate',
                'ConfigurationAsBuilt',
                'ConfigurationAsDocumented'
            ];
        } else {
            return ['Nameplate'];
        }
    } catch (error: any) {
        logger.error(
            `failed to get specifications for asset ${asset_id} from netilion: ${error}`
        );
        error.message =
            'Failed to get submodel names for asset [' +
            asset_id +
            '] from Netilion: ' +
            error.message;
        error.response = error.response || { status: 500 };
        throw error;
    }
}

// Retrieve all assets in user's Netilion account
async function get_all_assets(
    auth: OAUTH_TOKEN
): Promise<Array<NetilionAsset>> {
    let assets: Array<any> = [];
    try {
        {
            let page_number = 1;
            let page = await (await netilionClient.getAllAssets(auth)).data;
            while (page.pagination.next) {
                page_number++;
                assets.push(page.assets);
                page = await (
                    await netilionClient.getAllAssets(auth, page_number)
                ).data;
            }
            assets.push(page.assets);
        }
        const ASSETS = (await Promise.all(assets)).reduce((a, b) => {
            a = a.concat(b);
            return a;
        });
        return ASSETS;
    } catch (error: any) {
        logger.error(`failed to get assets from netilion: ${error}`);
        error.message = 'Failed to get assets from Netilion: ' + error.message;
        error.response = error.response || { status: 500 };
        throw error;
    }
}

// Retrieve a product in user's Netilion account
async function get_product(
    auth: OAUTH_TOKEN,
    product_id: number
): Promise<NetilionProduct> {
    const str_product_id = product_id.toString();
    try {
        const product: NetilionProduct = await (
            await netilionClient.getProduct(auth, str_product_id)
        ).data;
        return product;
    } catch (error: any) {
        logger.error(
            `failed to get product ${str_product_id} from netilion: ${error}`
        );
        error.message =
            'Failed to get product [' +
            str_product_id +
            '] from Netilion: ' +
            error.message;
        error.response = error.response || { status: 500 };
        throw error;
    }
}

// Retrieve software information for an asset in user's Netilion account
async function get_asset_softwares(
    auth: OAUTH_TOKEN,
    asset_id: number
): Promise<Array<any>> {
    const str_asset_id = asset_id.toString();
    try {
        const softwares: Array<any> = [];
        let page_number = 1;
        let page = await (
            await netilionClient.getAssetSoftwares(auth, str_asset_id)
        ).data;
        while (page.pagination.next) {
            page_number++;
            softwares.push(page.softwares);
            page = await (
                await netilionClient.getAssetSoftwares(
                    auth,
                    str_asset_id,
                    page_number
                )
            ).data;
        }
        softwares.push(page.softwares);
        const SOFTWARES = (await Promise.all(softwares)).reduce((a, b) => {
            a = a.concat(b);
            return a;
        });
        return SOFTWARES;
    } catch (error: any) {
        logger.error(
            `failed to get softwares for asset ${str_asset_id} from netilion: ${error}`
        );
        error.message =
            'Failed to get softwares for asset [' +
            str_asset_id +
            '] from Netilion: ' +
            error.message;
        error.response = error.response || { status: 500 };
        throw error;
    }
}

// Retrieve categories for a Netilion product
async function get_product_categories(
    auth: OAUTH_TOKEN,
    product_id: number
): Promise<Array<any>> {
    const str_product_id = product_id.toString();
    try {
        const categories: Array<any> = [];
        let page_number = 1;
        let page = await (
            await netilionClient.getProductCategories(auth, str_product_id)
        ).data;
        while (page.pagination.next) {
            page_number++;
            categories.push(page.categories);
            page = await (
                await netilionClient.getProductCategories(
                    auth,
                    str_product_id,
                    page_number
                )
            ).data;
        }
        categories.push(page.categories);
        const CATEGORIES = (await Promise.all(categories)).reduce((a, b) => {
            a = a.concat(b);
            return a;
        });
        return CATEGORIES;
    } catch (error: any) {
        logger.error(
            `failed to get categories for product ${str_product_id} from netilion: ${error}`
        );
        error.message =
            'Failed to get categories for product [' +
            str_product_id +
            '] from Netilion: ' +
            error.message;
        error.response = error.response || { status: 500 };
        throw error;
    }
}

// Get specification for a specific Netilion asset.
async function get_asset_specifications(
    auth: OAUTH_TOKEN,
    assset_id: number
): Promise<NetilionSpecification> {
    const str_asset_id = assset_id.toString();
    try {
        let specs: any;
        specs = await (
            await netilionClient.getAssetSpecs(auth, str_asset_id)
        ).data;
        if (specs === undefined) {
            specs = {};
        }
        return specs;
    } catch (error: any) {
        logger.error(
            `failed to get specifications for asset ${str_asset_id} from netilion: ${error}`
        );
        error.message =
            'Failed to get specifications for asset [' +
            str_asset_id +
            '] from Netilion: ' +
            error.message;
        error.response = error.response || { status: 500 };
        throw error;
    }
}

// Retrieve all docuemnts for a Netilion product
async function get_product_documents(
    auth: OAUTH_TOKEN,
    product_id: number,
    categories?: Array<string>
): Promise<Array<any>> {
    const str_product_id = product_id.toString();
    try {
        let docs: Array<any> = [];
        {
            let page_number = 1;
            let page = await (
                await netilionClient.getProductDocs(
                    auth,
                    str_product_id,
                    page_number,
                    categories
                )
            ).data;
            while (page.pagination.next) {
                page_number++;
                docs.push(page.documents);
                page = await (
                    await netilionClient.getProductDocs(
                        auth,
                        str_product_id,
                        page_number,
                        categories
                    )
                ).data;
            }
            docs.push(page.documents);
        }
        const DOCS = (await Promise.all(docs)).reduce((a, b) => {
            a = a.concat(b);
            return a;
        });
        return DOCS;
    } catch (error: any) {
        logger.error(
            'failed to get product documents for product ' +
                str_product_id +
                ' from netilion'
        );
        error.message =
            'Failed to get documents for product [' +
            str_product_id +
            '] from Netilion: ' +
            error.message;
        error.response = error.response || { status: 500 };
        throw error;
    }
}

// Retrieve all docuemnts for an asset in user's Netilion account
async function get_asset_documents(
    auth: OAUTH_TOKEN,
    asset_id: number
): Promise<Array<any>> {
    const str_asset_id = asset_id.toString();
    try {
        let docs: Array<any> = [];
        {
            let page_number = 1;
            let page = await (
                await netilionClient.getAssetDocs(auth, str_asset_id)
            ).data;
            while (page.pagination.next) {
                page_number++;
                docs.push(page.documents);
                page = await (
                    await netilionClient.getAssetDocs(
                        auth,
                        str_asset_id,
                        page_number
                    )
                ).data;
            }
            docs.push(page.documents);
        }
        const DOCS = (await Promise.all(docs)).reduce((a, b) => {
            a = a.concat(b);
            return a;
        });
        return DOCS;
    } catch (error: any) {
        logger.error(
            'failed to get asset documents for asset ' +
                str_asset_id +
                ' from netilion'
        );
        error.message =
            'Failed to get documents for asset [' +
            str_asset_id +
            '] from Netilion: ' +
            error.message;
        error.response = error.response || { status: 500 };
        throw error;
    }
}

// Turn asset object from Netilion to AssetAdministrationShell
async function asset_to_aas(
    auth: OAUTH_TOKEN,
    asset: NetilionAsset
): Promise<AssetAdministrationShell> {
    try {
        let category;
        const cats = await get_product_categories(auth, asset.product.id);
        const submodel_refs: Array<Reference> = [];
        submodel_refs.push({
            type: 'ModelReference',
            keys: [
                {
                    type: 'Submodel',
                    value: netilionAssetIdToSubmodelId(asset.id, 'nameplate')
                }
            ]
        });
        try {
            const configuration_as_built =
                await asset_to_configuration_as_built(auth, asset);
            submodel_refs.push({
                type: 'ModelReference',
                keys: [
                    {
                        type: 'Submodel',
                        value: configuration_as_built.id
                    }
                ]
            });
        } catch (error) {
            logger.warn(error);
        }
        try {
            const configuration_as_documented =
                await asset_to_configuration_as_documented(auth, asset);
            submodel_refs.push({
                type: 'ModelReference',
                keys: [
                    {
                        type: 'Submodel',
                        value: configuration_as_documented.id
                    }
                ]
            });
        } catch (error) {
            logger.warn(error);
        }
        if (cats.length) {
            category =
                '[' + cats.map((e: { name: any }) => e.name).join(', ') + ']';
        }
        const AAS = new AssetAdministrationShell({
            category,
            idShort: 'NetilionAAS_' + asset.id.toString(),
            description: asset.description
                ? [
                      {
                          language: 'en',
                          text: asset.description
                      }
                  ]
                : undefined,
            id: netilionAssetIdToShellId(asset.id),
            assetInformation: {
                assetKind: 'Instance',
                globalAssetId: 'https://dsp.endress.com/' + asset.serial_number
            },
            submodels: submodel_refs
        });
        return AAS;
    } catch (error: any) {
        logger.error(
            `failed to get aas from asset [id: ` + asset.id + `]: ${error}`
        );
        error.message =
            'Failed to generate AssetAdministrationShell from asset [' +
            asset.id +
            ']: ' +
            error.message;
        error.response = error.response || { status: 500 };
        throw error;
    }
}

// Turn asset object from Netilion to Nameplate submodel
async function asset_to_nameplate(
    auth: OAUTH_TOKEN,
    asset: NetilionAsset
): Promise<Submodel> {
    let assetSpecs: any = {};
    let assetSoftwares: any = {};
    let product: any = {};
    let manufacturer: any = {};
    try {
        try {
            assetSpecs = await get_asset_specifications(auth, asset.id);
        } catch (error: any) {
            error.message =
                'Failed to get asset specifications [' +
                asset.id +
                '] from netilion: ' +
                error.message;
            throw error;
        }
        try {
            assetSoftwares = await get_asset_softwares(auth, asset.id);
        } catch (error: any) {
            error.message =
                'Failed to get asset software [' +
                asset.id +
                '] from netilion: ' +
                error.message;
            throw error;
        }
        try {
            product = await get_product(auth, asset.product.id);
        } catch (error: any) {
            error.message =
                'Failed to get product [' +
                asset.product.id +
                '] from netilion: ' +
                error.message;
            throw error;
        }
        try {
            manufacturer = await (
                await netilionClient.getManufacturer(
                    auth,
                    product.manufacturer.id
                )
            ).data;
        } catch (error: any) {
            error.message =
                'Failed to get manufacturer [' +
                product.manufacturer.id +
                '] from netilion: ' +
                error.message;
            throw error;
        }

        const nameplate_input = netilionAssetToNameplateInput({
            asset,
            assetSpecs,
            product,
            assetSoftwares,
            manufacturer
        });

        const nameplate = Generate_SM_Nameplate(
            nameplate_input,
            netilionAssetIdToSubmodelId(asset.id, 'nameplate')
        );
        return nameplate;
    } catch (error: any) {
        logger.error(
            `failed to get nameplate submodel of asset ${asset.id} from netilion: ${error}`
        );
        error.message =
            'Failed to generate Nameplate submodel from asset [' +
            asset.id +
            ']: ' +
            error.message;
        error.response = error.response || { status: 500 };
        throw error;
    }
}

// Turn asset object from Netilion to ConfigurationAsBuilt submodel
async function asset_to_configuration_as_built(
    auth: OAUTH_TOKEN,
    asset: NetilionAsset
): Promise<Submodel> {
    try {
        const specs = await get_asset_specifications(auth, asset.id);
        let MinTemp: number;
        let MaxTemp: number;
        if (
            !specs['anfangswert_des_messbereiches'] ||
            !specs['anfangswert_des_messbereiches']
        ) {
            const error: any = new Error(
                'asset ' +
                    asset.id +
                    ' does not have the required specifications for ConfigurationAsBuilt submodel'
            );
            error.response = { status: 404 };
            throw error;
        }
        MinTemp = Number(specs['anfangswert_des_messbereiches'].value);
        MaxTemp = Number(specs['endwert_des_messbereiches'].value);
        const cap = Generate_SM_ConfigurationAsBuilt(
            {
                NetilionAssetId: String(asset.id),
                MinTemp,
                MaxTemp
            },
            netilionAssetIdToSubmodelId(asset.id, 'configuration_as_built')
        );
        return cap;
    } catch (error: any) {
        logger.error(
            `failed to get ConfigurationAsBuilt submodel of asset ${asset.id} from netilion: ${error}`
        );
        error.message =
            'Failed to generate ConfigurationAsBuilt submodel from asset [' +
            asset.id +
            ']: ' +
            error.message;
        error.response = error.response || { status: 500 };
        throw error;
    }
}

// Turn asset object from Netilion to ConfigurationAsBuilt submodel
async function asset_to_configuration_as_documented(
    auth: OAUTH_TOKEN,
    asset: NetilionAsset
): Promise<Submodel> {
    try {
        const specs = await get_asset_specifications(auth, asset.id);
        let MinTemp: number;
        let MaxTemp: number;
        if (
            !specs['anfangswert_des_messbereiches'] ||
            !specs['anfangswert_des_messbereiches']
        ) {
            const error: any = new Error(
                'asset ' +
                    asset.id +
                    ' does not have the required specifications for ConfigurationAsDocumented submodel'
            );
            error.response = { status: 404 };
            throw error;
        }
        MinTemp = Number(specs['anfangswert_des_messbereiches'].value);
        MaxTemp = Number(specs['endwert_des_messbereiches'].value);
        const cad = Generate_SM_ConfigurationAsDocumented(
            {
                NetilionAssetId: String(asset.id),
                MinTemp,
                MaxTemp
            },
            netilionAssetIdToSubmodelId(asset.id, 'configuration_as_documented')
        );
        return cad;
    } catch (error: any) {
        logger.error(
            `failed to get ConfigurationAsDocumented submodel of asset ${asset.id} from netilion: ${error}`
        );
        error.message =
            'Failed to generate ConfigurationAsDocumented submodel from asset [' +
            asset.id +
            ']: ' +
            error.message;
        error.response = error.response || { status: 500 };
        throw error;
    }
}

// Create AssetAdministrationShells from specific asset in user's Netilion account
async function get_aas(
    auth: OAUTH_TOKEN,
    asset_id: number
): Promise<AGENT_OP_RESULT> {
    const str_asset_id = asset_id.toString();
    try {
        const result = await netilionClient.getAsset(auth, str_asset_id);
        const asset = await result.data;
        const AAS = await asset_to_aas(auth, asset);
        return { status: 200, json: AAS };
    } catch (error: any) {
        logger.error(
            `failed to get asset [id: ` + asset_id + `] from netilion: ${error}`
        );
        return netilion_error_to_agent_error(
            error,
            'Failed to get AssetAdministrationShell for asset [' +
                asset_id +
                ']'
        );
    }
}

// Create AssetAdministrationShells from all assets in user's Netilion account
async function get_all_aas(auth: OAUTH_TOKEN): Promise<AGENT_OP_RESULT> {
    try {
        const assets = await get_all_assets(auth);
        let fail,
            success: boolean = false;
        const shell_resps = await Promise.all(
            assets.map(async (asset: NetilionAsset) => {
                try {
                    return {
                        failed: false,
                        res: await asset_to_aas(auth, asset)
                    };
                } catch (error: any) {
                    return {
                        failed: true,
                        res: netilion_error_to_agent_error(
                            error,
                            'Failed to get AssetAdministrationShell for asset [' +
                                asset.id +
                                ']'
                        )
                    };
                }
            })
        );
        const shells = new Array<AssetAdministrationShell>();
        const failed = new Array<AGENT_OP_RESULT>();
        shell_resps.forEach((shell_resp) => {
            if (shell_resp.failed) {
                fail = true;
                failed.push(shell_resp.res as AGENT_OP_RESULT);
            } else {
                success = true;
                shells.push(shell_resp.res as AssetAdministrationShell);
            }
        });
        return fail
            ? success
                ? { status: 207, json: { shells, failed } }
                : {
                      status: 500,
                      json: { message: 'All failed', error: failed }
                  }
            : { status: 200, json: { shells } };
    } catch (error: any) {
        logger.error(`failed to get aas from assets in netilion: ${error}`);
        return netilion_error_to_agent_error(
            error,
            'Failed to get assets from Netilion'
        );
    }
}

// Get Authentication token from Netilion based on username and password
async function get_auth_token(
    username: string,
    password: string
): Promise<AGENT_OP_RESULT<OAUTH_TOKEN>> {
    try {
        const result = await netilionClient.getAuth(username, password);
        const auth_status = result.status;
        const auth = await result.data;
        return { status: auth_status, json: auth };
    } catch (error: any) {
        logger.error(`failed to authenticate with natilion: ${error}`);
        return netilion_error_to_agent_error(
            error,
            'Failed to authenticate with Netilion'
        );
    }
}

// refresh Authentication token from Netilion based on username and password
async function referesh_auth_token(
    auth: OAUTH_TOKEN
): Promise<AGENT_OP_RESULT<OAUTH_TOKEN>> {
    try {
        const auth_response = await netilionClient.refreshAuth(auth);
        const auth_status = auth_response.status;
        const refreshed_auth = await auth_response.data;
        return { status: auth_status, json: refreshed_auth };
    } catch (error: any) {
        logger.error(`failed to authenticate with natilion: ${error}`);
        return netilion_error_to_agent_error(
            error,
            'Failed to authenticate with Netilion'
        );
    }
}

// Get submodel for all assets on Netilion
async function get_submodel_for_all_assets(
    auth: OAUTH_TOKEN,
    submodel_name: SubmodelName
): Promise<AGENT_OP_RESULT> {
    let asset_to_submodel: (
        auth: OAUTH_TOKEN,
        asset: NetilionAsset
    ) => Promise<Submodel>;

    switch (submodel_name) {
        case 'Nameplate':
            asset_to_submodel = asset_to_nameplate;
            break;
        case 'ConfigurationAsBuilt':
            asset_to_submodel = asset_to_configuration_as_built;
            break;
        case 'ConfigurationAsDocumented':
            asset_to_submodel = asset_to_configuration_as_documented;
            break;
        default:
            logger.error(
                submodel_name + ' retrieval from Netilion not implemeneted'
            );
            return {
                status: 501,
                json: {
                    message: 'no submodel ' + submodel_name + ' implemented'
                }
            };
    }
    try {
        const assets = await get_all_assets(auth);
        let fail,
            success: boolean = false;
        let sm_resps = (
            await Promise.all(
                assets.map(async (asset: NetilionAsset) => {
                    if (
                        (await asset_submodel_names(auth, asset.id)).includes(
                            submodel_name
                        )
                    ) {
                        try {
                            return {
                                failed: false,
                                res: await asset_to_submodel(auth, asset)
                            };
                        } catch (error: any) {
                            return {
                                failed: true,
                                res: netilion_error_to_agent_error(
                                    error,
                                    'Failed to get ' +
                                        submodel_name +
                                        ' submodel for asset [' +
                                        asset.id +
                                        ']'
                                )
                            };
                        }
                    } else {
                        return undefined;
                    }
                })
            )
        ).filter((sm) => {
            return sm !== undefined;
        }) as Array<
            | {
                  failed: boolean;
                  res: Submodel;
              }
            | { failed: boolean; res: AGENT_OP_RESULT }
        >;
        const submodels = new Array<Submodel>();
        const failed = new Array<AGENT_OP_RESULT>();
        sm_resps.forEach((sm_resp) => {
            if (sm_resp.failed) {
                fail = true;
                failed.push(sm_resp.res as AGENT_OP_RESULT);
            } else {
                success = true;
                submodels.push(sm_resp.res as Submodel);
            }
        });
        return fail
            ? success
                ? { status: 207, json: { submodels, failed } }
                : {
                      status: 500,
                      json: { message: 'All failed', error: failed }
                  }
            : { status: 200, json: { submodels } };
    } catch (error: any) {
        return netilion_error_to_agent_error(
            error,
            'Failed to get ' + submodel_name + 'submodels from Netilion'
        );
    }
}

// Get submodel for specifica asset on Netilion
async function get_submodel_for_asset(
    auth: OAUTH_TOKEN,
    asset_id: NetilionAssetId,
    submodel_name: SubmodelName
): Promise<AGENT_OP_RESULT> {
    let asset_to_submodel: (
        auth: OAUTH_TOKEN,
        asset: NetilionAsset
    ) => Promise<Submodel>;

    switch (submodel_name) {
        case 'Nameplate':
            asset_to_submodel = asset_to_nameplate;
            break;
        case 'ConfigurationAsBuilt':
            asset_to_submodel = asset_to_configuration_as_built;
            break;
        case 'ConfigurationAsDocumented':
            asset_to_submodel = asset_to_configuration_as_documented;
            break;
        default:
            logger.error(
                submodel_name + ' retrieval from Netilion not implemeneted'
            );
            return {
                status: 501,
                json: {
                    message: 'no submodel ' + submodel_name + ' implemented'
                }
            };
    }

    const str_asset_id = asset_id.toString();
    try {
        const asset = await (
            await netilionClient.getAsset(auth, str_asset_id)
        ).data;
        const submodel = await asset_to_submodel(auth, asset);
        return { status: 200, json: submodel };
    } catch (error: any) {
        logger.error(
            `failed to get ${submodel_name} submodel for asset [id: ` +
                str_asset_id +
                `] from netilion: ${error}`
        );
        return netilion_error_to_agent_error(
            error,
            'Failed to get ' +
                submodel_name +
                ' submodel for asset [' +
                asset_id +
                '] from Netilion'
        );
    }
}

async function get_all_submodels_for_asset(
    auth: OAUTH_TOKEN,
    asset_id: NetilionAssetId
) {
    try {
        const sm_names = await asset_submodel_names(auth, asset_id);
        const submodels_resps = await Promise.all(
            sm_names.map(async (sm_name) => {
                return await get_submodel_for_asset(auth, asset_id, sm_name);
            })
        );
        const submodels = submodels_resps.reduce((a, b) => {
            if (b.status >= 200 && b.status < 300) {
                a.push(b.json);
            }
            return a;
        }, new Array<Submodel>());

        const failed = submodels_resps.reduce((a, b) => {
            if (!(b.status >= 200 && b.status < 300)) {
                a.push({
                    status: 500,
                    json: {
                        message: 'Failed to retrieve existing submodel.',
                        error: b
                    }
                });
            }
            return a;
        }, new Array<AGENT_OP_RESULT>());
        const success = submodels.length;
        const fail = failed.length;
        return fail
            ? success
                ? { status: 207, json: { submodels, failed } }
                : {
                      status: 500,
                      json: { message: 'All failed', error: failed }
                  }
            : { status: 200, json: { submodels } };
    } catch (error: any) {
        logger.error(error.message);
        return netilion_error_to_agent_error(
            error,
            'Failed to retrieve all submodels for asset [' +
                asset_id +
                '] form Netilion'
        );
    }
}

async function get_all_submodels_for_all_assets(auth: OAUTH_TOKEN) {
    try {
        const sm_names = defined_submodel_names();
        const submodels_resps = await Promise.all(
            sm_names.map(async (sm_name) => {
                return await get_submodel_for_all_assets(auth, sm_name);
            })
        );
        const submodels = submodels_resps.reduce((a, b) => {
            if (b.status >= 200 && b.status < 300) {
                return a.concat(b.json.submodels);
            } else {
                return a;
            }
        }, new Array<Submodel>());
        const failed = submodels_resps.reduce((a, b) => {
            if (b.status === 207) {
                return a.concat(b.json.failed);
            } else {
                return a;
            }
        }, []);
        const success = submodels.length;
        const fail = failed.length;
        return fail
            ? success
                ? { status: 207, json: { submodels, failed } }
                : {
                      status: 500,
                      json: { message: 'All failed', error: failed }
                  }
            : { status: 200, json: { submodels } };
    } catch (error: any) {
        logger.error(error.message);
        return netilion_error_to_agent_error(
            error,
            'Failed to retrieve all submodels from Netilion'
        );
    }
}
// Extract Netilion asset ID from submodel ID
function submodel_id_to_source_asset_id(submodel_id: string): AssetId {
    const id_split = submodel_id.split('/');
    const assetId = Number(id_split[id_split.length - 3]);
    return assetId;
}

// Extract Netilion asset ID from submodel ID
function aas_id_short_to_source_asset_id(aas_id_short: string): AssetId {
    const arr = aas_id_short.match(/(?<=NetilionAAS_).*$/);
    const assetId = arr ? Number(arr[0]) : NaN;
    return assetId;
}

// Turn string id received from request parameters into schema compatible AssetId type
function string_id_to_asset_id(id: string): AssetId {
    return Number(id);
}

// Necessary fuctionality of an asset source agent for the rest of the sdk to function
export default {
    defined_submodel_names,
    asset_submodel_names,
    get_aas,
    get_all_aas,
    get_submodel_for_asset,
    get_submodel_for_all_assets,
    get_all_submodels_for_asset,
    get_all_submodels_for_all_assets,
    submodel_id_to_source_asset_id,
    aas_id_short_to_source_asset_id,
    get_auth_token,
    string_id_to_asset_id,
    referesh_auth_token
};
