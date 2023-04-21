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
        assetSoftwares = (await netilionClient.getAssetSoftwares(asset.id))
            .data;
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
async function NetilionAssetToAAS(
    asset: any
): Promise<AssetAdministrationShell> {
    let product;
    let category;
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
        const cats = (
            await netilionClient.getProductCategories(asset.product.id)
        ).data;
        if (cats && cats.categories.length) {
            category = cats.categories.reduce((a: any, b: any) => {
                return a + '[' + b.name + ']';
            }, '');
        }
    } catch (error: any) {
        logger.error(
            `failed to get product [id: ` +
                asset.product.id +
                `] from netilion: ${error}`
        );
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
    let response: any = {};
    try {
        response = (await netilionClient.getAllAssets()).data;
    } catch (error: any) {
        logger.error(`failed to get assets from netilion: ${error}`);
    }
    const assets = response.assets;
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
    let response: any = {};
    try {
        response = (await netilionClient.getAllAssets()).data;
    } catch (error: any) {
        logger.error(`failed to get assets from netilion: ${error}`);
    }
    const assets = response.assets;
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

export default {
    sampleHealthCheck,
    getAllEHNameplates,
    getEHNameplate,
    getAllEHAAS,
    getEHAAS
};
