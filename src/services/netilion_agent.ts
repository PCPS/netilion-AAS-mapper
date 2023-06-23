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
import { NetilionAsset } from '../interfaces/Netilion';

const netilionClient = new NetelionClient();

// Retrieve all document category IDs corresponding to the VDI standard within netilion
async function EHVDICategories(): Promise<Array<any>> {
    let cats: Array<any> = [];
    try {
        {
            let page_number = 1;
            let page = (await netilionClient.getVDICategories()).data;
            while (await page.pagination.next) {
                page_number++;
                cats.push(await page.categories);
                page = (await netilionClient.getAllAssets(page_number)).data;
            }
            cats.push(await page.categories);
        }
    } catch (error: any) {
        logger.error(`failed to get VDI categories from netilion: ${error}`);
    }
    const CATS = (await Promise.all(cats)).reduce((a, b) => {
        a = a.concat(b);
        return a;
    });
    return CATS;
}

// Turn asset object from Netilion to Nameplate submodel
async function NetilionAssetToNameplate(
    asset: NetilionAsset
): Promise<Submodel> {
    let assetSpecs: any = {};
    let assetSoftwares: any = {};
    let product: any = {};
    let manufacturer: any = {};
    try {
        assetSpecs = (await netilionClient.getAssetSpecs(asset.id.toString()))
            .data;
    } catch (error: any) {
        logger.error(
            `failed to get asset specifications [id: ` +
                asset.id +
                `] from netilion: ${error}`
        );
    }
    try {
        assetSoftwares = await EHAssetSoftwares(asset.id);
    } catch (error: any) {
        logger.error(
            `failed to get asset software [id: ` +
                asset.id +
                `] from netilion: ${error}`
        );
    }
    try {
        product = (await netilionClient.getProduct(asset.product.id.toString()))
            .data;
    } catch (error: any) {
        logger.error(
            `failed to get product [id: ` +
                asset.product.id +
                `] from netilion: ${error}`
        );
    }
    try {
        manufacturer = (
            await netilionClient.getManufacturer(product.manufacturer.id)
        ).data;
    } catch (error: any) {
        logger.error(
            `failed to get manufacturer [id: ` +
                product.manufacturer.id +
                `] from netilion: ${error}`
        );
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
            // ':' +
            // process.env.SERVER_PORT +
            '/' +
            process.env.SERVER_API_VERSION +
            '/nameplates/' +
            asset.id
    );
    return nameplate;
}

// Retrieve all assets in user's Netilion account
async function AllEHAssets(): Promise<Array<any> | undefined> {
    let assets: Array<any> = [];
    try {
        {
            let page_number = 1;
            let page = (await netilionClient.getAllAssets()).data;
            while (await page.pagination.next) {
                page_number++;
                assets.push(await page.assets);
                page = (await netilionClient.getAllAssets(page_number)).data;
            }
            assets.push(await page.assets);
        }
    } catch (error: any) {
        logger.error(`failed to get assets from netilion: ${error}`);
    }
    if (assets && assets.length) {
        const ASSETS = (await Promise.all(assets)).reduce((a, b) => {
            a = a.concat(b);
            return a;
        });
        return ASSETS;
    } else {
        return undefined;
    }
}

// Retrieve software information for an asset in user's Netilion account
async function EHAssetSoftwares(asset_id: number): Promise<Array<any>> {
    const str_asset_id = asset_id.toString();
    const softwares: Array<any> = [];
    try {
        {
            let page_number = 1;
            let page = (await netilionClient.getAssetSoftwares(str_asset_id))
                .data;
            while (await page.pagination.next) {
                page_number++;
                softwares.push(await page.softwares);
                page = (
                    await netilionClient.getAssetSoftwares(
                        str_asset_id,
                        page_number
                    )
                ).data;
            }
            softwares.push(await page.softwares);
        }
    } catch (error: any) {
        logger.error(
            `failed to get softwares for asset ${str_asset_id} from netilion: ${error}`
        );
    }
    const SOFTWARES = (await Promise.all(softwares)).reduce((a, b) => {
        a = a.concat(b);
        return a;
    });
    return SOFTWARES;
}

// Retrieve categories for a Netilion product
async function EHProductCategories(product_id: number): Promise<Array<any>> {
    const str_product_id = product_id.toString();
    const categories: Array<any> = [];
    try {
        {
            let page_number = 1;
            let page = (
                await netilionClient.getProductCategories(str_product_id)
            ).data;
            while (await page.pagination.next) {
                page_number++;
                categories.push(await page.categories);
                page = (
                    await netilionClient.getProductCategories(
                        str_product_id,
                        page_number
                    )
                ).data;
            }
            categories.push(await page.categories);
        }
    } catch (error: any) {
        logger.error(
            `failed to get categories for product ${str_product_id} from netilion: ${error}`
        );
    }
    const CATEGORIES = (await Promise.all(categories)).reduce((a, b) => {
        a = a.concat(b);
        return a;
    });
    return CATEGORIES;
}

async function EHAssetSpecifications(assset_id: number): Promise<any> {
    const str_asset_id = assset_id.toString();
    let specs: any;
    try {
        specs = await (await netilionClient.getAssetSpecs(str_asset_id)).data;
        if (specs === undefined) {
            specs = {};
        }
    } catch (error: any) {
        logger.error(
            `failed to get specifications for asset ${str_asset_id} from netilion: ${error}`
        );
    }
    return specs;
}

// Retrieve all docuemnts for a Netilion product
async function EHProductDocumnets(
    product_id: number,
    categories?: Array<string>
): Promise<Array<any>> {
    const str_product_id = product_id.toString();
    let docs: Array<any> = [];
    {
        let page_number = 1;
        let page = (
            await netilionClient.getProductDocs(
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
}

// Retrieve all docuemnts for an asset in user's Netilion account
async function EHAssetDocumnets(asset_id: number): Promise<Array<any>> {
    let docs: Array<any> = [];
    {
        const str_asset_id = asset_id.toString();
        let page_number = 1;
        let page = (await netilionClient.getAssetDocs(str_asset_id)).data;
        while (await page.pagination.next) {
            page_number++;
            docs.push(await page.documents);
            page = (
                await netilionClient.getAssetDocs(str_asset_id, page_number)
            ).data;
        }
        docs.push(await page.documents);
    }
    const DOCS = (await Promise.all(docs)).reduce((a, b) => {
        a = a.concat(b);
        return a;
    });
    return DOCS;
}

// Turn asset object from Netilion to AssetAdministrationShell
async function NetilionAssetToAAS(
    asset: NetilionAsset
): Promise<AssetAdministrationShell> {
    let category;
    const cats = await EHProductCategories(asset.product.id);
    const submodel_refs: Array<Reference> = [];
    submodel_refs.push({
        type: 'ModelReference',
        keys: [
            {
                type: 'Submodel',
                value:
                    process.env.SERVER_URL +
                    // ':' +
                    // process.env.SERVER_PORT +
                    '/' +
                    process.env.SERVER_API_VERSION +
                    '/nameplates/' +
                    asset.id
            }
        ]
    });
    const configuration_as_built = await EHConfigurationAsBuilt(asset.id);
    if (configuration_as_built) {
        submodel_refs.push({
            type: 'ModelReference',
            keys: [
                {
                    type: 'Submodel',
                    value: configuration_as_built.id
                }
            ]
        });
    }
    const configuration_as_documented = await EHConfigurationAsDocumented(
        asset.id
    );
    if (configuration_as_documented) {
        submodel_refs.push({
            type: 'ModelReference',
            keys: [
                {
                    type: 'Submodel',
                    value: configuration_as_documented.id
                }
            ]
        });
    }
    if (cats.length) {
        category =
            '[' + cats.map((e: { name: any }) => e.name).join(', ') + ']';
    }
    const AAS = new AssetAdministrationShell({
        category,
        idShort: asset.id.toString(),
        description: [
            {
                language: 'en',
                text: asset.description
            }
        ],
        id:
            process.env.SERVER_URL +
            // ':' +
            // process.env.SERVER_PORT +
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
}

// Turn asset object from Netilion to ConfigurationAsBuilt submodel
async function NetilionAssetToConfigurationAsBuilt(
    asset: NetilionAsset
): Promise<Submodel | undefined> {
    const specs = await EHAssetSpecifications(asset.id);
    let MinTemp: number;
    let MaxTemp: number;
    if (
        specs['anfangswert_des_messbereiches'] &&
        specs['endwert_des_messbereiches']
    ) {
        MinTemp = specs['anfangswert_des_messbereiches'].value;
        MaxTemp = specs['endwert_des_messbereiches'].value;
        const cap = Generate_SM_ConfigurationAsBuilt(
            {
                NetilionAssetId: String(asset.id),
                MinTemp,
                MaxTemp
            },
            process.env.SERVER_URL +
                // ':' +
                // process.env.SERVER_PORT +
                '/' +
                process.env.SERVER_API_VERSION +
                '/configurations_as_built/' +
                asset.id
        );
        return cap;
    }
}

// Turn asset object from Netilion to ConfigurationAsDocumented submodel
async function NetilionAssetToConfigurationAsDocumented(
    asset: NetilionAsset
): Promise<Submodel | undefined> {
    const specs = await EHAssetSpecifications(asset.id);
    let MinTemp: number;
    let MaxTemp: number;
    if (
        specs['anfangswert_des_messbereiches'] &&
        specs['endwert_des_messbereiches']
    ) {
        MinTemp = specs['anfangswert_des_messbereiches'].value;
        MaxTemp = specs['endwert_des_messbereiches'].value;
        const cap = Generate_SM_ConfigurationAsDocumented(
            {
                NetilionAssetId: String(asset.id),
                MinTemp,
                MaxTemp
            },
            process.env.SERVER_URL +
                // ':' +
                // process.env.SERVER_PORT +
                '/' +
                process.env.SERVER_API_VERSION +
                '/configurations_as_documented/' +
                asset.id
        );
        return cap;
    }
}

// Create Nameplate submodels from all assets in user's Netilion account
async function allEHNameplates() {
    const assets = await AllEHAssets();
    if (assets) {
        let nameplates = await Promise.all(
            assets.map(async (asset: NetilionAsset) => {
                return await NetilionAssetToNameplate(asset);
            })
        );
        return nameplates;
    } else {
        return undefined;
    }
}

// Create Nameplate submodel for specific asset in user's Netilion account
async function EHNameplate(asset_id: number) {
    const str_asset_id = asset_id.toString();
    let asset;
    try {
        asset = (await netilionClient.getAsset(str_asset_id)).data;
    } catch (error: any) {
        logger.error(
            `failed to get asset [id: ` +
                str_asset_id +
                `] from netilion: ${error}`
        );
    }
    if (asset) {
        const nameplate = await NetilionAssetToNameplate(asset);
        return nameplate;
    } else {
        return undefined;
    }
}

// Create ConfigurationAsBuilt submodels from all assets in user's Netilion account
async function allEHConfigurationsAsBuilt() {
    const assets = await AllEHAssets();
    if (assets) {
        let configurations_as_built = (
            await Promise.all(
                assets.map(async (asset: NetilionAsset) => {
                    return await NetilionAssetToConfigurationAsBuilt(asset);
                })
            )
        ).filter((sm) => {
            return sm !== undefined;
        }) as Array<Submodel>;
        return configurations_as_built;
    } else {
        return undefined;
    }
}

// Create ConfigurationAsBuilt submodel for specific asset in user's Netilion account
async function EHConfigurationAsBuilt(asset_id: number) {
    const str_aasset_id = asset_id.toString();
    let asset;
    try {
        asset = (await netilionClient.getAsset(str_aasset_id)).data;
    } catch (error: any) {
        logger.error(
            `failed to get asset [id: ` +
                str_aasset_id +
                `] from netilion: ${error}`
        );
    }
    if (asset) {
        const cap = await NetilionAssetToConfigurationAsBuilt(asset);
        return cap;
    } else {
        return undefined;
    }
}

// Create ConfigurationAsDocumented submodels from all assets in user's Netilion account
async function allEHConfigurationsAsDocumented() {
    const assets = await AllEHAssets();
    if (assets) {
        let configurations_as_documented = (
            await Promise.all(
                assets.map(async (asset: NetilionAsset) => {
                    return await NetilionAssetToConfigurationAsDocumented(
                        asset
                    );
                })
            )
        ).filter((sm) => {
            return sm !== undefined;
        }) as Array<Submodel>;
        return configurations_as_documented;
    } else {
        return undefined;
    }
}

// Create ConfigurationAsDocumented submodel for specific asset in user's Netilion account
async function EHConfigurationAsDocumented(asset_id: number) {
    const str_asset_id = asset_id.toString();
    let asset;
    try {
        asset = (await netilionClient.getAsset(str_asset_id)).data;
    } catch (error: any) {
        logger.error(
            `failed to get asset [id: ` +
                str_asset_id +
                `] from netilion: ${error}`
        );
    }
    if (asset) {
        const cap = await NetilionAssetToConfigurationAsDocumented(asset);
        return cap;
    } else {
        return undefined;
    }
}

// Create AssetAdministrationShells from all assets in user's Netilion account
async function allEHAAS() {
    const assets = await AllEHAssets();
    if (assets) {
        let asset_adminstration_shells = await Promise.all(
            assets.map(async (asset: NetilionAsset) => {
                return await NetilionAssetToAAS(asset);
            })
        );
        return asset_adminstration_shells;
    } else {
        return undefined;
    }
}

// Create AssetAdministrationShells from specific asset in user's Netilion account
async function EHAAS(asset_id: string) {
    let asset;
    try {
        asset = (await netilionClient.getAsset(asset_id)).data;
    } catch (error: any) {
        logger.error(
            `failed to get asset [id: ` + asset_id + `] from netilion: ${error}`
        );
    }
    if (asset) {
        const AAS = await NetilionAssetToAAS(asset);
        return AAS;
    } else {
        return undefined;
    }
}

export default {
    getEHVDICategories: EHVDICategories,
    getAllEHAssets: AllEHAssets,
    getEHAssetSoftwares: EHAssetSoftwares,
    getEHProductCategories: EHProductCategories,
    getEHProductDocumnets: EHProductDocumnets,
    getEHAssetDocumnets: EHAssetDocumnets,
    NetilionAssetToNameplate,
    EHNameplate,
    NetilionAssetToConfigurationAsBuilt,
    EHConfigurationAsBuilt,
    allEHConfigurationsAsBuilt,
    NetilionAssetToConfigurationAsDocumented,
    EHConfigurationAsDocumented,
    allEHConfigurationsAsDocumented,
    allEHNameplates,
    NetilionAssetToAAS,
    EHAAS,
    allEHAAS
};
