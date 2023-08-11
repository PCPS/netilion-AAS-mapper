import { logger } from './logger';
import oi4 from '../services/oi4_repo_agent';
import { Submodel, SubmodelElement } from '../oi4_definitions/aas_components';
import { Property } from '../oi4_definitions/submodel_elements';
import { OAUTH_TOKEN } from '../interfaces/Mapper';

if (process.env.NODE_ENV !== 'production') {
    const dotenv = require('dotenv');
    // Use dev dependency
    dotenv.config();
}

// Post all AssetAdministrationShells made from netilion assets to the OI4 Repo
function postAAS(netilion_auth: OAUTH_TOKEN) {
    setTimeout(async () => {
        logger.info('Sending AAS from Netilion to OI4');
        oi4.post_all_aas(netilion_auth);
        postAAS(netilion_auth);
    }, Number(process.env.AAS_POST_PERIOD) || 5 * 60 * 1000);
}

// Post all submodels made from netilion assets to the OI4 Repo
function postSubmodels(netilion_auth: OAUTH_TOKEN) {
    setTimeout(async () => {
        logger.info('Sending Nameplates from Netilion to OI4');
        oi4.postAllEHNameplatesToOI4(netilion_auth);
        oi4.postAllEHConfigurationsAsBuiltToOI4(netilion_auth);
        oi4.postAllEHConfigurationsAsDocumentedToOI4(netilion_auth);
        postSubmodels(netilion_auth);
    }, Number(process.env.SM_POST_PERIOD) || 5 * 60 * 1000);
}

// Update all ConfigurationAsBuilt submodels in OI4 Repo from netilion asset information
function updateConfigurationsAsBuilt(netilion_auth: OAUTH_TOKEN) {
    setTimeout(async () => {
        logger.info('Sending ConfigurationAsBuilt from Netilion to OI4');
        oi4.updateAllEHConfigurationsAsBuiltInOI4(netilion_auth);
        updateConfigurationsAsBuilt(netilion_auth);
    }, Number(process.env.CONFIG_UPDATE_PERIOD) || 5 * 60 * 1000);
}

export default {
    postAAS,
    postSubmodels,
    updateConfigurationsAsBuilt
};
