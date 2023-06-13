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

const netilionClient = new NetelionClient();

async function getEHVDICategories(): Promise<Array<any>> {
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

async function NetilionAssetToNameplate(asset: any): Promise<Submodel> {
    let assetSpecs: any = {};
    let assetSoftwares: any = {};
    let product: any = {};
    let manufacturer: any = {};
    try {
        assetSpecs = (await netilionClient.getAssetSpecs(asset.id)).data;
    } catch (error: any) {
        logger.error(
            `failed to get asset specifications [id: ` +
                asset.id +
                `] from netilion: ${error}`
        );
    }
    try {
        assetSoftwares = await getEHAssetSoftwares(asset.id);
    } catch (error: any) {
        logger.error(
            `failed to get asset software [id: ` +
                asset.id +
                `] from netilion: ${error}`
        );
    }
    try {
        product = (await netilionClient.getProduct(asset.product.id)).data;
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
            ':' +
            process.env.PORT +
            '/' +
            process.env.SERVER_API_VERSION +
            '/nameplates/' +
            asset.id
    );
    return nameplate;
}

async function getAllEHAssets(): Promise<Array<any> | undefined> {
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
        console.log('!!!!!!!!!!!!!!');
        console.log(assets);
        console.log('!!!!!!!!!!!!!!');
        const ASSETS = (await Promise.all(assets)).reduce((a, b) => {
            a = a.concat(b);
            return a;
        });
        return ASSETS;
    } else {
        return undefined;
    }
}

async function getEHAssetSoftwares(asset_id: string): Promise<Array<any>> {
    let softwares: Array<any> = [];
    try {
        {
            let page_number = 1;
            let page = (await netilionClient.getAssetSoftwares(asset_id)).data;
            while (await page.pagination.next) {
                page_number++;
                softwares.push(await page.softwares);
                page = (
                    await netilionClient.getAssetSoftwares(
                        asset_id,
                        page_number
                    )
                ).data;
            }
            softwares.push(await page.softwares);
        }
    } catch (error: any) {
        logger.error(
            `failed to get softwares for asset ${asset_id} from netilion: ${error}`
        );
    }
    const SOFTWARES = (await Promise.all(softwares)).reduce((a, b) => {
        a = a.concat(b);
        return a;
    });
    return SOFTWARES;
}

async function getEHProductCategories(product_id: string): Promise<Array<any>> {
    let categories: Array<any> = [];
    try {
        {
            let page_number = 1;
            let page = (await netilionClient.getProductCategories(product_id))
                .data;
            while (await page.pagination.next) {
                page_number++;
                categories.push(await page.categories);
                page = (
                    await netilionClient.getProductCategories(
                        product_id,
                        page_number
                    )
                ).data;
            }
            categories.push(await page.categories);
        }
    } catch (error: any) {
        logger.error(
            `failed to get categories for product ${product_id} from netilion: ${error}`
        );
    }
    const CATEGORIES = (await Promise.all(categories)).reduce((a, b) => {
        a = a.concat(b);
        return a;
    });
    return CATEGORIES;
}

async function getEHAssetSpecifications(assset_id: string): Promise<any> {
    let specs: any;
    try {
        specs = await (await netilionClient.getAssetSpecs(assset_id)).data;
        if (specs === undefined) {
            specs = {};
        }
    } catch (error: any) {
        logger.error(
            `failed to get specifications for asset ${assset_id} from netilion: ${error}`
        );
    }
    return specs;
}

async function getEHProductDocumnets(
    product_id: string,
    categories?: Array<string>
): Promise<Array<any>> {
    let docs: Array<any> = [];
    {
        let page_number = 1;
        let page = (
            await netilionClient.getProductDocs(
                product_id,
                page_number,
                categories
            )
        ).data;
        while (await page.pagination.next) {
            page_number++;
            docs.push(await page.documents);
            page = (
                await netilionClient.getProductDocs(
                    product_id,
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

async function getEHAssetDocumnets(asset_id: string): Promise<Array<any>> {
    let docs: Array<any> = [];
    {
        let page_number = 1;
        let page = (await netilionClient.getAssetDocs(asset_id)).data;
        while (await page.pagination.next) {
            page_number++;
            docs.push(await page.documents);
            page = (await netilionClient.getAssetDocs(asset_id, page_number))
                .data;
        }
        docs.push(await page.documents);
    }
    const DOCS = (await Promise.all(docs)).reduce((a, b) => {
        a = a.concat(b);
        return a;
    });
    return DOCS;
}

async function NetilionAssetToAAS(
    asset: any
): Promise<AssetAdministrationShell> {
    let category;
    const cats = await getEHProductCategories(asset.product.id);
    const submodel_refs: Array<Reference> = [];
    submodel_refs.push({
        type: 'ModelReference',
        keys: [
            {
                type: 'Submodel',
                value:
                    process.env.SERVER_URL +
                    ':' +
                    process.env.PORT +
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
        idShort: asset.id,
        description: asset.description,
        id:
            process.env.SERVER_URL +
            ':' +
            process.env.PORT +
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

async function NetilionAssetToConfigurationAsBuilt(
    asset: any
): Promise<Submodel | undefined> {
    const specs = await getEHAssetSpecifications(asset.id);
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
                ':' +
                process.env.PORT +
                '/' +
                process.env.SERVER_API_VERSION +
                '/configurations_as_built/' +
                asset.id
        );
        return cap;
    }
}

async function NetilionAssetToConfigurationAsDocumented(
    asset: any
): Promise<Submodel | undefined> {
    const specs = await getEHAssetSpecifications(asset.id);
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
                ':' +
                process.env.PORT +
                '/' +
                process.env.SERVER_API_VERSION +
                '/configurations_as_documented/' +
                asset.id
        );
        return cap;
    }
}

async function allEHNameplates() {
    const assets = await getAllEHAssets();
    if (assets) {
        let nameplates = await Promise.all(
            assets.map(async (asset: any) => {
                return await NetilionAssetToNameplate(asset);
            })
        );
        return nameplates;
    } else {
        return undefined;
    }
}

async function EHNameplate(asset_id: string) {
    let asset;
    try {
        asset = (await netilionClient.getAsset(asset_id)).data;
    } catch (error: any) {
        logger.error(
            `failed to get asset [id: ` + asset_id + `] from netilion: ${error}`
        );
    }
    if (asset) {
        const nameplate = await NetilionAssetToNameplate(asset);
        return nameplate;
    } else {
        return undefined;
    }
}

async function allEHConfigurationsAsBuilt() {
    const assets = await getAllEHAssets();
    if (assets) {
        let configurations_as_built = (
            await Promise.all(
                assets.map(async (asset: any) => {
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

async function EHConfigurationAsBuilt(asset_id: string) {
    let asset;
    try {
        asset = (await netilionClient.getAsset(asset_id)).data;
    } catch (error: any) {
        logger.error(
            `failed to get asset [id: ` + asset_id + `] from netilion: ${error}`
        );
    }
    if (asset) {
        const cap = await NetilionAssetToConfigurationAsBuilt(asset);
        return cap;
    } else {
        return undefined;
    }
}

async function allEHConfigurationsAsDocumented() {
    const assets = await getAllEHAssets();
    if (assets) {
        let configurations_as_documented = (
            await Promise.all(
                assets.map(async (asset: any) => {
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

async function EHConfigurationAsDocumented(asset_id: string) {
    let asset;
    try {
        asset = (await netilionClient.getAsset(asset_id)).data;
    } catch (error: any) {
        logger.error(
            `failed to get asset [id: ` + asset_id + `] from netilion: ${error}`
        );
    }
    if (asset) {
        const cap = await NetilionAssetToConfigurationAsDocumented(asset);
        return cap;
    } else {
        return undefined;
    }
}

async function allEHAAS() {
    const assets = await getAllEHAssets();
    if (assets) {
        let asset_adminstration_shells = await Promise.all(
            assets.map(async (asset: any) => {
                return await NetilionAssetToAAS(asset);
            })
        );
        return asset_adminstration_shells;
    } else {
        return undefined;
    }
}

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
    getEHVDICategories,
    getAllEHAssets,
    getEHAssetSoftwares,
    getEHProductCategories,
    getEHProductDocumnets,
    getEHAssetDocumnets,
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
