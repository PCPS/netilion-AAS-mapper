import { Request, Response, NextFunction } from 'express';
import netilion, { SubmodelName } from '../services/netilion_agent';
import { decodeBase64 } from '../services/oi4_helpers';
import { logger } from '../services/logger';
import { OAUTH_TOKEN } from '../interfaces/Mapper';
if (process.env.NODE_ENV !== 'production') {
    const dotenv = require('dotenv');
    // Use dev dependency
    dotenv.config();
}

const submodel_name_map: { [key: string]: SubmodelName | undefined } = {
    nameplate: 'Nameplate',
    configuration_as_built: 'ConfigurationAsBuilt',
    configuration_as_documented: 'ConfigurationAsDocumented'
};

async function get_aas(req: Request, res: Response, next: NextFunction) {
    const result = await netilion.get_aas(
        res.locals.token,
        netilion.string_id_to_asset_id(req.params.id)
    );
    res.status(result.status).json(result.json);
}

async function get_all_aas(req: Request, res: Response, next: NextFunction) {
    const result = await netilion.get_all_aas(res.locals.token);
    res.status(result.status).json(result.json);
}

async function get_submodel(req: Request, res: Response, next: NextFunction) {
    const submodel_name = submodel_name_map[req.params.sm_name];
    if (submodel_name) {
        const result = await netilion.get_submodel(
            res.locals.token,
            netilion.string_id_to_asset_id(req.params.id),
            submodel_name
        );
        res.status(result.status).json(result.json);
    } else {
        res.status(404).json({
            message: "No Submodel '" + req.params.sm_name + "'"
        });
    }
}

async function get_submodel_for_all_assets(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const submodel_name = submodel_name_map[req.params.sm_name];
    if (submodel_name) {
        const result = await netilion.get_submodel_for_all_assets(
            res.locals.token,
            submodel_name
        );
        res.status(result.status).json(result.json);
    } else {
        res.status(404).json({
            message: "No Submodel '" + req.params.sm_name + "'"
        });
    }
}

// async function getEHHandoverDocuments(
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) {
//     let asset;
//     try {
//         asset = (await netilionClient.getAsset(req.params.id)).data;
//     } catch (error: any) {
//         logger.error(
//             `failed to get asset [id: ` +
//                 req.params.id +
//                 `] from netilion: ${error}`
//         );
//         return res.status(404).json({
//             message: 'Asset ' + req.params.id + ' Not Found.'
//         });
//     }
//     const vdi_categories = await grabber.getEHVDICategories();
//     const vdi_category_ids = await Promise.all(vdi_categories.map((e) => e.id));
//     const docs = (await grabber.getEHAssetDocumnets(asset.id)).concat(
//         await grabber.getEHProductDocumnets(asset.product.id, vdi_category_ids)
//     );
//     if (docs && docs.length) {
//         return res.status(200).json({
//             documents: docs
//         });
//     } else {
//         return res.status(404).json({
//             message:
//                 'Handover Documents for Asset [' +
//                 req.params.id +
//                 '] Not Found.'
//         });
//     }
// }

async function getAuthToken(req: Request, res: Response, next: NextFunction) {
    const encoded_userpass = req.headers.authorization?.match(/Basic (.*)/);
    const userpass = encoded_userpass?.length
        ? encoded_userpass.length > 1
            ? decodeBase64(encoded_userpass[1])
            : undefined
        : undefined;

    const [user, pass] = userpass ? userpass.split(':') : [];
    const auth_response = await netilion.get_auth_token(user, pass);
    if (auth_response) {
        const auth_keys = Object.keys(auth_response);
        auth_keys.forEach((key) => {
            res.cookie(key, auth_response[key as keyof OAUTH_TOKEN]);
        });
        return res.status(200).json({ message: 'Authentication Successful' });
    } else {
        return res.status(401).json({
            message: 'Authentication With Netilion Failed.'
        });
    }
}

export default {
    get_submodel,
    get_submodel_for_all_assets,
    get_all_aas,
    get_aas,
    // getEHHandoverDocuments,
    getAuthToken
};
