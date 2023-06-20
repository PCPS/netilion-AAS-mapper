import { logger } from './logger';
import oi4 from '../services/oi4_repo_agent';
import { Submodel, SubmodelElement } from '../oi4_definitions/aas_components';
import { Property } from '../oi4_definitions/submodel_elements';

if (process.env.NODE_ENV !== 'production') {
    const dotenv = require('dotenv');
    // Use dev dependency
    dotenv.config();
}

// Post all AssetAdministrationShells made from netilion assets to the OI4 Repo
function postAAS() {
    setTimeout(async () => {
        logger.info('Sending AAS from Netilion to OI4');
        oi4.postAllEHAASToOI4();
        postAAS();
    }, Number(process.env.AAS_POST_PERIOD) || 5 * 60 * 1000);
}

// Post all submodels made from netilion assets to the OI4 Repo
function postSubmodels() {
    setTimeout(async () => {
        logger.info('Sending Nameplates from Netilion to OI4');
        oi4.postAllEHNameplatesToOI4();
        oi4.postAllEHConfigurationsAsBuiltToOI4();
        oi4.postAllEHConfigurationsAsDocumentedToOI4();
        postSubmodels();
    }, Number(process.env.SM_POST_PERIOD) || 5 * 60 * 1000);
}

// Update all ConfigurationAsBuilt submodels in OI4 Repo from netilion asset information
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
