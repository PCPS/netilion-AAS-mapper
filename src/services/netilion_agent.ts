import { Request, Response, NextFunction } from 'express';
import {
    Submodel,
    AssetAdministrationShell,
    Reference
} from '../oi4_definitions/aas_components';
import { Generate_SM_Nameplate } from '../oi4_definitions/submodels/nameplate_sm';
import { logger } from './logger';
import { netilionAssetToNameplateInput } from './mappers';
import { NetelionClient } from './netilionAPI';
import { Generate_SM_ConfigurationAsBuilt } from '../oi4_definitions/submodels/configuration_as_built_sm';
import { Generate_SM_ConfigurationAsDocumented } from '../oi4_definitions/submodels/configuration_as_documented_sm';
import { NetilionAsset, NetilionAssetId } from '../interfaces/Netilion';
import { OAUTH_TOKEN } from '../interfaces/Mapper';
import { AGENT_OP_RESULT } from '../interfaces/Agent';
import { json } from 'body-parser';

const netilionClient = new NetelionClient();

export type SubmodelName =
    | 'Nameplate'
    | 'ConfigurationAsBuilt'
    | 'ConfigurationAsDocumented'
    | 'ContactInformation'
    | 'HandoverDucumentation';

export type AssetId = NetilionAssetId;
// Retrieve all document category IDs corresponding to the VDI standard within netilion
async function get_vdi_categories(auth: OAUTH_TOKEN): Promise<Array<any>> {
    //TODO: add category schema for return type
    try {
        let cats: Array<any> = [];
        let page_number = 1;
        let page = await (await netilionClient.getVDICategories(auth)).data;
        while (await page.pagination.next) {
            page_number++;
            cats.push(await page.categories);
            page = await (
                await netilionClient.getAllAssets(auth, page_number)
            ).data;
        }
        cats.push(await page.categories);

        const CATS = (await Promise.all(cats)).reduce((a, b) => {
            a = a.concat(b);
            return a;
        });
        return CATS;
    } catch (error: any) {
        logger.error(`failed to get VDI categories from netilion: ${error}`);
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
            while (await page.pagination.next) {
                page_number++;
                assets.push(await page.assets);
                page = (await netilionClient.getAllAssets(auth, page_number))
                    .data;
            }
            assets.push(await page.assets);
        }
        const ASSETS = (await Promise.all(assets)).reduce((a, b) => {
            a = a.concat(b);
            return a;
        });
        return ASSETS;
    } catch (error: any) {
        logger.error(`failed to get assets from netilion: ${error}`);
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
        let page = (await netilionClient.getAssetSoftwares(auth, str_asset_id))
            .data;
        while (await page.pagination.next) {
            page_number++;
            softwares.push(await page.softwares);
            page = (
                await netilionClient.getAssetSoftwares(
                    auth,
                    str_asset_id,
                    page_number
                )
            ).data;
        }
        softwares.push(await page.softwares);
        const SOFTWARES = (await Promise.all(softwares)).reduce((a, b) => {
            a = a.concat(b);
            return a;
        });
        return SOFTWARES;
    } catch (error: any) {
        logger.error(
            `failed to get softwares for asset ${str_asset_id} from netilion: ${error}`
        );
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
        let page = (
            await netilionClient.getProductCategories(auth, str_product_id)
        ).data;
        while (await page.pagination.next) {
            page_number++;
            categories.push(await page.categories);
            page = (
                await netilionClient.getProductCategories(
                    auth,
                    str_product_id,
                    page_number
                )
            ).data;
        }
        categories.push(await page.categories);
        const CATEGORIES = (await Promise.all(categories)).reduce((a, b) => {
            a = a.concat(b);
            return a;
        });
        return CATEGORIES;
    } catch (error: any) {
        logger.error(
            `failed to get categories for product ${str_product_id} from netilion: ${error}`
        );
        throw error;
    }
}

// Get specification for a specific Netilion asset.
async function get_asset_specifications(
    auth: OAUTH_TOKEN,
    assset_id: number
): Promise<any> {
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
            let page = (
                await netilionClient.getProductDocs(
                    auth,
                    str_product_id,
                    page_number,
                    categories
                )
            ).data;
            while (await page.pagination.next) {
                page_number++;
                docs.push(await page.documents);
                page = (
                    await netilionClient.getProductDocs(
                        auth,
                        str_product_id,
                        page_number,
                        categories
                    )
                ).data;
            }
            docs.push(await page.documents);
        }
        const DOCS = (await Promise.all(docs)).reduce((a, b) => {
            a = a.concat(b);
            return a;
        });
        return DOCS;
    } catch (error) {
        logger.error(
            'failed to get product documents for product ' +
                str_product_id +
                ' from netilion'
        );
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
            let page = (await netilionClient.getAssetDocs(auth, str_asset_id))
                .data;
            while (await page.pagination.next) {
                page_number++;
                docs.push(await page.documents);
                page = (
                    await netilionClient.getAssetDocs(
                        auth,
                        str_asset_id,
                        page_number
                    )
                ).data;
            }
            docs.push(await page.documents);
        }
        const DOCS = (await Promise.all(docs)).reduce((a, b) => {
            a = a.concat(b);
            return a;
        });
        return DOCS;
    } catch (error) {
        logger.error(
            'failed to get asset documents for asset ' +
                str_asset_id +
                ' from netilion'
        );
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
                    value:
                        process.env.SERVER_URL +
                        (process.env.NODE_ENV !== 'production'
                            ? ':' + process.env.PORT
                            : '') +
                        '/' +
                        process.env.SERVER_API_VERSION +
                        '/nameplates/' +
                        asset.id
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
            id:
                process.env.SERVER_URL +
                (process.env.NODE_ENV !== 'production'
                    ? ':' + process.env.PORT
                    : '') +
                '/' +
                process.env.SERVER_API_VERSION +
                '/aas/' +
                asset.id,
            assetInformation: {
                assetKind: 'Instance',
                globalAssetId: '[IRI] dsp.endress.com/' + asset.serial_number
            },
            submodels: submodel_refs
        });
        return AAS;
    } catch (error: any) {
        logger.error(
            `failed to get aas from asset [id: ` + asset.id + `]: ${error}`
        );
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
            assetSpecs = (
                await netilionClient.getAssetSpecs(auth, asset.id.toString())
            ).data;
        } catch (error: any) {
            error.message =
                `failed to get asset specifications [id: ` +
                asset.id +
                `] from netilion: ${error.message}`;
            throw error;
        }
        try {
            assetSoftwares = await get_asset_softwares(auth, asset.id);
        } catch (error: any) {
            error.message =
                `failed to get asset software [id: ` +
                asset.id +
                `] from netilion: ${error.message}`;
            throw error;
        }
        try {
            product = (
                await netilionClient.getProduct(
                    auth,
                    asset.product.id.toString()
                )
            ).data;
        } catch (error: any) {
            error.message =
                `failed to get product [id: ` +
                asset.product.id +
                `] from netilion: ${error.message}`;
            throw error;
        }
        try {
            manufacturer = (
                await netilionClient.getManufacturer(
                    auth,
                    product.manufacturer.id
                )
            ).data;
        } catch (error: any) {
            error.message =
                `failed to get manufacturer [id: ` +
                product.manufacturer.id +
                `] from netilion: ${error.message}`;
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
            process.env.SERVER_URL +
                (process.env.NODE_ENV !== 'production'
                    ? ':' + process.env.PORT
                    : '') +
                '/' +
                process.env.SERVER_API_VERSION +
                '/nameplates/' +
                asset.id
        );
        return nameplate;
    } catch (error: any) {
        logger.error(
            `failed to get nameplate submodel of asset ${asset.id} from netilion: ${error}`
        );
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
        MinTemp = specs['anfangswert_des_messbereiches'].value;
        MaxTemp = specs['endwert_des_messbereiches'].value;
        const cap = Generate_SM_ConfigurationAsBuilt(
            {
                NetilionAssetId: String(asset.id),
                MinTemp,
                MaxTemp
            },
            process.env.SERVER_URL +
                (process.env.NODE_ENV !== 'production'
                    ? ':' + process.env.PORT
                    : '') +
                '/' +
                process.env.SERVER_API_VERSION +
                '/configurations_as_built/' +
                asset.id
        );
        return cap;
    } catch (error: any) {
        logger.error(
            `failed to get ConfigurationAsBuilt submodel of asset ${asset.id} from netilion: ${error}`
        );
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
        MinTemp = specs['anfangswert_des_messbereiches'].value;
        MaxTemp = specs['endwert_des_messbereiches'].value;
        const cad = Generate_SM_ConfigurationAsDocumented(
            {
                NetilionAssetId: String(asset.id),
                MinTemp,
                MaxTemp
            },
            process.env.SERVER_URL +
                (process.env.NODE_ENV !== 'production'
                    ? ':' + process.env.PORT
                    : '') +
                '/' +
                process.env.SERVER_API_VERSION +
                '/configurations_as_built/' +
                asset.id
        );
        return cad;
    } catch (error: any) {
        logger.error(
            `failed to get ConfigurationAsDocumented submodel of asset ${asset.id} from netilion: ${error}`
        );
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
        console.error(error);
        const resp = error.response || { status: 500 };
        return {
            status: resp.status,
            json: {
                message: 'Failed to get asset [' + asset_id + '] from Netilion'
            }
        };
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
                    const resp = error.response || { status: 500 };
                    return {
                        failed: true,
                        res: {
                            status: resp.status,
                            json: {
                                asset_id: asset.id,
                                message:
                                    'Failed to get AssetAdministrationShell for asset',
                                error: error.message
                            }
                        }
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
        return success
            ? fail
                ? { status: 207, json: { shells, failed } }
                : { status: 200, json: { shells } }
            : fail
            ? { status: 400, json: { message: 'All failed', results: failed } }
            : { status: 418, json: { message: 'Something went wrong' } };
    } catch (error: any) {
        logger.error(`failed to get aas from assets in netilion: ${error}`);
        const resp = error.response || { status: 500 };
        return {
            status: resp.status,
            json: {
                message: 'Failed to get assets from Netilion'
            }
        };
    }
}

// Get Authentication token from Netilion based on username and password
async function get_auth_token(
    username: string,
    password: string
): Promise<OAUTH_TOKEN | undefined> {
    try {
        const auth = await (
            await netilionClient.getAuth(username, password)
        ).data;
        return auth;
    } catch (error: any) {
        logger.error(`failed to authenticate with natilion: ${error}`);
        return undefined;
    }
}

// refresh Authentication token from Netilion based on username and password
async function referesh_auth_token(auth: OAUTH_TOKEN) {
    try {
        const refreshed_auth = await (
            await netilionClient.refreshAuth(auth)
        ).data;
        return refreshed_auth;
    } catch (error: any) {
        logger.error(`failed to authenticate with natilion: ${error}`);
        return undefined;
    }
}

// Get submodel for all assets on Netiliom
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
                status: 404,
                json: {
                    message: 'no submodel ' + submodel_name + ' implemented'
                }
            };
    }
    try {
        const assets = await get_all_assets(auth);
        let submodels = (
            await Promise.all(
                assets.map(async (asset: NetilionAsset) => {
                    try {
                        return await asset_to_submodel(auth, asset);
                    } catch (error) {
                        return undefined;
                    }
                })
            )
        ).filter((sm) => {
            return sm !== undefined;
        }) as Array<Submodel>;
        return { status: 200, json: { submodels } };
    } catch (error: any) {
        const resp = error.response || { status: 500 };
        return {
            status: resp.status,
            json: {
                message:
                    'Failed to get ' +
                    submodel_name +
                    'submodels from Netilion',
                error: error
            }
        };
    }
}

// Get submodel for specifica asset on Netiliom
async function get_submodel(
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
                status: 404,
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
        const resp = error.response || { status: 500 };
        return {
            status: resp.status,
            json: {
                message:
                    'Failed to get ' +
                    submodel_name +
                    ' submodel for asset [' +
                    asset_id +
                    '] from Netilion'
            }
        };
    }
}

// Extract Netilion asset ID from submodel ID
function submodel_id_to_source_asset_id(submodel_id: string): AssetId {
    const id_split = submodel_id.split('/');
    const assetId = Number(id_split[id_split.length - 1]);
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
    get_aas,
    get_all_aas,
    get_submodel,
    get_submodel_for_all_assets,
    submodel_id_to_source_asset_id,
    aas_id_short_to_source_asset_id,
    get_auth_token,
    string_id_to_asset_id,
    referesh_auth_token
};
