import { Request, Response, NextFunction } from 'express';
import netilion from '../services/netilion_agent';

async function getAllEHNameplates(
    req: Request,
    res: Response,
    next: NextFunction
) {
    let nameplates = await netilion.allEHNameplates();
    if (nameplates) {
        return res.status(200).json({
            nameplates
        });
    } else {
        return res.status(404).json({
            message: 'Namplates Not Found.'
        });
    }
}

async function getEHNameplate(req: Request, res: Response, next: NextFunction) {
    let nameplate = await netilion.EHNameplate(req.params.id);
    if (nameplate) {
        return res.status(200).json(nameplate);
    } else {
        return res.status(404).json({
            message: 'Namplate for Asset [' + req.params.id + '] Not Found.'
        });
    }
}

async function getAllEHAAS(req: Request, res: Response, next: NextFunction) {
    const shells = await netilion.allEHAAS();
    if (shells) {
        return res.status(200).json({
            shells
        });
    } else {
        return res.status(404).json({
            message: 'Assets Not Found.'
        });
    }
}

async function getEHAAS(req: Request, res: Response, next: NextFunction) {
    const shell = await netilion.EHAAS(req.params.id);
    if (shell) {
        return res.status(200).json(shell);
    } else {
        return res.status(404).json({
            message: 'Asset [' + req.params.id + '] Not Found.'
        });
    }
}

async function getAllEHConfigurationsAsBuilt(
    req: Request,
    res: Response,
    next: NextFunction
) {
    let configurations_as_built = await netilion.allEHConfigurationsAsBuilt();
    if (configurations_as_built) {
        return res.status(200).json({
            configurations_as_built
        });
    } else {
        return res.status(404).json({
            message: 'Configurations As Planned Not Found.'
        });
    }
}

async function getEHConfigurationAsBuilt(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const cap = await netilion.EHConfigurationAsBuilt(req.params.id);
    if (cap) {
        return res.status(200).json(cap);
    } else {
        return res.status(404).json({
            message:
                'Configuration As Planned for Asset [' +
                req.params.id +
                '] Not Found.'
        });
    }
}

async function getAllEHConfigurationsAsDocumented(
    req: Request,
    res: Response,
    next: NextFunction
) {
    let configurations_as_documented =
        await netilion.allEHConfigurationsAsDocumented();
    if (configurations_as_documented) {
        return res.status(200).json({
            configurations_as_documented
        });
    } else {
        return res.status(404).json({
            message: 'Configurations As Planned Not Found.'
        });
    }
}

async function getEHConfigurationAsDocumented(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const cap = await netilion.EHConfigurationAsDocumented(req.params.id);
    if (cap) {
        return res.status(200).json(cap);
    } else {
        return res.status(404).json({
            message:
                'Configuration As Planned for Asset [' +
                req.params.id +
                '] Not Found.'
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

export default {
    getAllEHNameplates,
    getEHNameplate,
    getAllEHConfigurationsAsBuilt,
    getEHConfigurationAsBuilt,
    getAllEHConfigurationsAsDocumented,
    getEHConfigurationAsDocumented,
    getAllEHAAS,
    getEHAAS
    // getEHHandoverDocuments
};
