import { Request, Response, NextFunction } from 'express';
import { logger } from '../services/logger';
import dotenv from 'dotenv';
import { NetelionClient } from '../services/netilionAPI';
import { netilionAssetToNameplateInput } from '../services/mappers';
import { GenerateNameplate } from '../oi4_definitions/submodels/digital_nameplate';
import { Submodel } from '../oi4_definitions/aas_components';

dotenv.config();

const netilionClient = new NetelionClient();

const sampleHealthCheck = (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Sample healthcheck route called.`);

    return res.status(200).json({
        message: 'pong'
    });
};

const getAllEHAssets = async (
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
            let assetSpecs: any = {};
            let assetSoftwares: any = {};
            let product: any = {};
            let manufacturer: any = {};
            try {
                assetSpecs = (await netilionClient.getAssetSpecs(asset.id))
                    .data;
            } catch (error: any) {
                logger.error(
                    `failed to get asset specifications from netilion: ${error}`
                );
            }
            try {
                assetSoftwares = (
                    await netilionClient.getAssetSoftwares(asset.id)
                ).data;
            } catch (error: any) {
                logger.error(
                    `failed to get asset specifications from netilion: ${error}`
                );
            }
            if (asset.profuct) {
                try {
                    product = (
                        await netilionClient.getProduct(asset.product.id)
                    ).data;
                } catch (error: any) {
                    logger.error(
                        `failed to get product from netilion: ${error}`
                    );
                }
            }
            if (product.manufacturer) {
                try {
                    manufacturer = (
                        await netilionClient.getManufacturer(
                            product.manufacturer.id
                        )
                    ).data;
                } catch (error: any) {
                    logger.error(
                        `failed to get manufacturer from netilion: ${error}`
                    );
                }
            }

            const nameplate_input = netilionAssetToNameplateInput({
                asset,
                assetSpecs,
                product,
                assetSoftwares,
                manufacturer
            });

            return GenerateNameplate(nameplate_input);
        })
    );
    return res.status(200).json({
        message: {
            nameplates
        }
    });
};

const getEHAsset = async (req: Request, res: Response, next: NextFunction) => {
    const params = req.params;
    let asset: any = {};
    let assetSpecs: any = {};
    let assetSoftwares: any = {};
    let product: any = {};
    let manufacturer: any = {};
    try {
        asset = (await netilionClient.getAsset(params.id)).data;
    } catch (error: any) {
        logger.error(`failed to get asset from netilion: ${error}`);
    }
    try {
        assetSpecs = (await netilionClient.getAssetSpecs(asset.id)).data;
    } catch (error: any) {
        logger.error(
            `failed to get asset specifications from netilion: ${error}`
        );
    }
    try {
        assetSoftwares = (await netilionClient.getAssetSoftwares(asset.id))
            .data;
    } catch (error: any) {
        logger.error(
            `failed to get asset specifications from netilion: ${error}`
        );
    }
    try {
        product = (await netilionClient.getProduct(asset.product.id)).data;
    } catch (error: any) {
        logger.error(`failed to get product from netilion: ${error}`);
    }
    try {
        manufacturer = (
            await netilionClient.getManufacturer(product.manufacturer.id)
        ).data;
    } catch (error: any) {
        logger.error(`failed to get manufacturer from netilion: ${error}`);
    }

    const nameplate_input = netilionAssetToNameplateInput({
        asset,
        assetSpecs,
        product,
        assetSoftwares,
        manufacturer
    });

    const nameplate = GenerateNameplate(nameplate_input);

    return res.status(200).json({
        message: nameplate
    });
};

export default {
    sampleHealthCheck,
    getAllEHAssets,
    getEHAsset
};
