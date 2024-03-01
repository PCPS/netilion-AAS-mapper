import { Request, Response, NextFunction } from 'express';
import oi4 from '../agents/oi4_repo_agent';
import { SubmodelName } from '../agents/netilion_agent';
import { decodeBase64 } from '../oi4_definitions/oi4_helpers';
import { logger } from '../services/logger';
import {
    AssetAdministrationShell,
    Submodel
} from '../oi4_definitions/aas_components';

const submodel_name_map: { [key: string]: SubmodelName | undefined } = {
    nameplate: 'Nameplate',
    configuration_as_built: 'ConfigurationAsBuilt',
    configuration_as_documented: 'ConfigurationAsDocumented'
};

async function get_aas(req: Request, res: Response, next: NextFunction) {
    const result = await oi4.get_aas(decodeBase64(req.params.shell_id_b64));
    res.status(result.status).json(result.json);
}

async function get_all_aas(req: Request, res: Response, next: NextFunction) {
    const result = await oi4.get_all_aas();
    res.status(result.status).json(result.json);
}

async function get_submodel_of_aas(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const result = await oi4.get_submodel_of_aas(
        decodeBase64(req.params.aas_id_b64),
        decodeBase64(req.params.sm_id_b64)
    );
    res.status(result.status).json(result.json);
}

async function get_all_submodels_of_aas(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const result = await oi4.get_all_submodels_of_aas(
        decodeBase64(req.params.shell_id_b64)
    );
    res.status(result.status).json(result.json);
}

async function get_all_submodels(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const result = await oi4.get_all_submodels();
    res.status(result.status).json(result.json);
}

async function passthrough(req: Request, res: Response, next: NextFunction) {
    console.log(req.query);
    console.log(req.params[0]);
    try {
        const result = await oi4.passthrough(req.params[0], req.query);
        if (
            result.headers &&
            (result.headers['Content-Type'] || result.headers['content-type'])
        ) {
            res.writeHead(200, '', result.headers as any);
            res.end(result.raw, 'binary');
        } else {
            res.status(result.status).json(result.json);
        }
    } catch (error: any) {
        logger.error(
            `passthrough failed [query: ` + req.query + `] to OI4: ${error}`
        );
        const resp = error.response || { status: 500, data: {} };
        res.status(resp.status).json(res.json);
    }
}

async function submit_dummies(req: Request, res: Response, next: NextFunction) {
    const count = Number(req.params.dummy_count);
    if (isNaN(count)) {
        res.status(404).json({ message: 'Dummy count must be a number' });
    } else {
        const result = await oi4.submit_dummies(Math.ceil(Math.abs(count)));
        res.status(result.status).json(result.json);
    }
}

async function delete_dummies(req: Request, res: Response, next: NextFunction) {
    const shells_resp = await oi4.get_all_aas();
    const shells_status = shells_resp.status;
    const submodels_resp = await oi4.get_all_submodels();
    const submodels_status = submodels_resp.status;
    try {
        if (!(shells_status >= 200 && shells_status < 300)) {
            let error: any = new Error(
                'failed to retieve shells frome the OI4 Repository'
            );
            error.response = shells_resp;
            logger.error(error);
            throw error;
        }
        if (!(submodels_status >= 200 && submodels_status < 300)) {
            let error: any = new Error(
                'failed to retieve submodels frome the OI4 Repository'
            );
            error.response = submodels_resp;
            logger.error(error);
            throw error;
        }
        const shells = shells_resp.json.shells;
        const submodels = submodels_resp.json.submodels;
        const deleted_submodel_ids = await Promise.all(
            submodels.map(async (submodel: Submodel) => {
                if (submodel.id.match(/^http:\/\/testshells\.io\/.+$/)) {
                    const submodel_delete_resp =
                        await oi4.delete_submodel_of_aas(
                            submodel.id.split('/submodels')[0],
                            submodel.id
                        );
                    const submodel_delete_status = submodel_delete_resp.status;
                    if (
                        !(
                            submodel_delete_status >= 200 &&
                            submodel_delete_status < 300
                        )
                    ) {
                        let error: any = new Error(
                            'failed to delete submodel [' +
                                submodel.id +
                                '] frome the OI4 Repository'
                        );
                        error.response = submodel_delete_resp;
                        logger.error(error);
                        throw error;
                    }
                    return submodel.id;
                }
            })
        );
        const deleted_shell_ids = await Promise.all(
            shells.map(async (shell: AssetAdministrationShell) => {
                if (shell.id.match(/^http:\/\/testshells\.io\/.+$/)) {
                    const shell_delete_resp = await oi4.delete_aas(shell.id);
                    const shell_delete_status = shell_delete_resp.status;
                    if (
                        !(
                            shell_delete_status >= 200 &&
                            shell_delete_status < 300
                        )
                    ) {
                        let error: any = new Error(
                            'failed to delete shell [' +
                                shell.id +
                                '] frome the OI4 Repository'
                        );
                        error.response = shell_delete_resp;
                        logger.error(error);
                        throw error;
                    }
                    return shell.id;
                }
            })
        );

        res.status(200).json({ deleted_shell_ids, deleted_submodel_ids });
    } catch (error: any) {
        logger.error(error);
        error.response = error.response || { status: 500, data: {} };
        res.status(error.response.status).json(error.response.json);
    }
}

export default {
    get_aas,
    get_all_aas,
    get_submodel_of_aas,
    get_all_submodels_of_aas,
    get_all_submodels,
    passthrough,
    submit_dummies,
    delete_dummies
};
