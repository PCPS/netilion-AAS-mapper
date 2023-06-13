import { logger } from './logger';
import oi4 from '../services/oi4_repo_agent';
if (process.env.NODE_ENV !== 'production') {
    import('dotenv').then((dotenv) => dotenv.config());
}
import { Submodel, SubmodelElement } from '../oi4_definitions/aas_components';
import { Property } from '../oi4_definitions/submodel_elements';

function postAAS() {
    setTimeout(async () => {
        logger.info('Sending AAS from Netilion to OI4');
        oi4.postAllEHAASToOI4();
        postAAS();
    }, Number(process.env.AAS_POST_PERIOD) || 5 * 60 * 1000);
}

function postSubmodels() {
    setTimeout(async () => {
        logger.info('Sending Nameplates from Netilion to OI4');
        oi4.postAllEHNameplatesToOI4();
        oi4.postAllEHConfigurationsAsBuiltToOI4();
        oi4.postAllEHConfigurationsAsDocumentedToOI4();
        postSubmodels();
    }, Number(process.env.SM_POST_PERIOD) || 5 * 60 * 1000);
}

function updateConfigurationsAsBuilt() {
    setTimeout(async () => {
        logger.info('Sending ConfigurationAsBuilt from Netilion to OI4');
        oi4.updateAllEHConfigurationsAsBuiltInOI4();
        updateConfigurationsAsBuilt();
    }, Number(process.env.CONFIG_UPDATE_PERIOD) || 5 * 60 * 1000);
}

export default {
    postAAS,
    postSubmodels,
    updateConfigurationsAsBuilt
};
