import { Request, Response, NextFunction } from 'express';
import { logger } from '../services/logger';
import dotenv from 'dotenv';
import { NetelionClient } from '../services/netilionAPI';
import { netilionAssetToNameplateInput } from '../services/mappers';
import { Generate_SM_Nameplate } from '../oi4_definitions/submodels/nameplate_sm';
import {
    AssetAdministrationShell,
    Submodel
} from '../oi4_definitions/aas_components';

dotenv.config();

const netilionClient = new NetelionClient();

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
            process.env.SERVER_PORT +
            '/' +
            process.env.SERVER_API_VERSION +
            '/nameplates/' +
            asset.id
    );
    return nameplate;
}

async function getAllEHAssets(): Promise<Array<any>> {
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
    const ASSETS = (await Promise.all(assets)).reduce((a, b) => {
        a = a.concat(b);
        return a;
    });
    return ASSETS;
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

async function getEHProductDocumnets(product_id: string): Promise<Array<any>> {
    let docs: Array<any> = [];
    {
        let page_number = 1;
        let page = (await netilionClient.getProductDocs(product_id)).data;
        while (await page.pagination.next) {
            page_number++;
            docs.push(await page.documents);
            page = (
                await netilionClient.getProductDocs(product_id, page_number)
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
            process.env.SERVER_PORT +
            '/' +
            process.env.SERVER_API_VERSION +
            '/aas/' +
            asset.id,
        assetInformation: {
            assetKind: 'Instance',
            globalAssetId: {
                type: 'GlobalReference',
                keys: [
                    {
                        type: 'GlobalReference',
                        value: '[IRI] dsp.endress.com/' + asset.serial_number
                    }
                ]
            }
        },
        submodels: [
            {
                type: 'ModelReference',
                keys: [
                    {
                        type: 'Submodel',
                        value:
                            '[IRI] ' +
                            process.env.SERVER_URL +
                            ':' +
                            process.env.SERVER_PORT +
                            '/' +
                            process.env.SERVER_API_VERSION +
                            '/nameplates/' +
                            asset.id
                    }
                ]
            }
        ]
    });
    return AAS;
}

const sampleHealthCheck = (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Sample healthcheck route called.`);

    return res.status(200).json({
        message: 'pong'
    });
};

const getAllEHNameplates = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const assets = await getAllEHAssets();
    let nameplates = await Promise.all(
        assets.map(async (asset: any) => {
            return await NetilionAssetToNameplate(asset);
        })
    );
    return res.status(200).json({
        message: {
            nameplates
        }
    });
};

const getEHNameplate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let asset;
    try {
        asset = (await netilionClient.getAsset(req.params.id)).data;
    } catch (error: any) {
        logger.error(
            `failed to get asset [id: ` +
                req.params.id +
                `] from netilion: ${error}`
        );
    }
    if (asset) {
        const nameplate = await NetilionAssetToNameplate(asset);
        return res.status(200).json({
            message: nameplate
        });
    } else {
        return res.status(404);
    }
};

const getAllEHAAS = async (req: Request, res: Response, next: NextFunction) => {
    const assets = await getAllEHAssets();
    let asset_adminstration_shells = await Promise.all(
        assets.map(async (asset: any) => {
            return await NetilionAssetToAAS(asset);
        })
    );
    return res.status(200).json({
        message: {
            asset_adminstration_shells
        }
    });
};

const getEHAAS = async (req: Request, res: Response, next: NextFunction) => {
    let asset;
    try {
        asset = (await netilionClient.getAsset(req.params.id)).data;
    } catch (error: any) {
        logger.error(
            `failed to get asset [id: ` +
                req.params.id +
                `] from netilion: ${error}`
        );
    }
    if (asset) {
        const AAS = await NetilionAssetToAAS(asset);
        return res.status(200).json({
            message: AAS
        });
    } else {
        return res.status(404);
    }
};

const getEHHandoverDocuments = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let asset;
    try {
        asset = (await netilionClient.getAsset(req.params.id)).data;
    } catch (error: any) {
        logger.error(
            `failed to get asset [id: ` +
                req.params.id +
                `] from netilion: ${error}`
        );
    }
    const docs = (await getEHAssetDocumnets(asset.id)).concat(
        await getEHProductDocumnets(asset.product.id)
    );
    if (docs) {
        return res.status(200).json({
            message: docs
        });
    } else {
        return res.status(404);
    }
};

export default {
    sampleHealthCheck,
    getAllEHNameplates,
    getEHNameplate,
    getAllEHAAS,
    getEHAAS,
    getEHHandoverDocuments
};
