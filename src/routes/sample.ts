import { Router } from 'express';
import netilion_controller from '../controllers/netilion_controller';
import oi4_repo_controller from '../controllers/oi4_repo_controller';

const router = Router();

router.get('/nameplates', netilion_controller.getAllEHNameplates);
router.get('/nameplates/:id', netilion_controller.getEHNameplate);
router.get(
    '/configurations_as_built/',
    netilion_controller.getAllEHConfigurationsAsBuilt
);
router.get(
    '/configurations_as_built/:id',
    netilion_controller.getEHConfigurationAsBuilt
);
router.get(
    '/configurations_as_documented/',
    netilion_controller.getAllEHConfigurationsAsDocumented
);
router.get(
    '/configurations_as_documented/:id',
    netilion_controller.getEHConfigurationAsDocumented
);
router.get('/aas', netilion_controller.getAllEHAAS);
router.get('/aas/:id', netilion_controller.getEHAAS);
// router.get(
//     '/handover_documentations/:id',
//     netilion_controller.getEHHandoverDocuments
// );
router.get('/get_aas', oi4_repo_controller.getAllAASFromOI4);
router.get('/get_aas/:id', oi4_repo_controller.getAASFromOI4);
router.get('/post_aas', oi4_repo_controller.postAllEHAASToOI4);
router.get('/update_aas/:id', oi4_repo_controller.updateEHAASInOI4);
router.get('/get_submodels', oi4_repo_controller.getAllSubmodelsFromOI4);
router.get('/get_submodels/:id', oi4_repo_controller.getSubmodelFromOI4);
router.get('/post_nameplates', oi4_repo_controller.postAllEHNameplatesToOI4);
router.get(
    '/post_configurations_as_built',
    oi4_repo_controller.postAllEHConfigurationsAsBuiltToOI4
);
router.get(
    '/update_configurations_as_built/',
    oi4_repo_controller.updateAllEHConfigurationsAsBuiltInOI4
);
router.get(
    '/update_configurations_as_built/:id',
    oi4_repo_controller.updateEHConfigurationsAsBuiltInOI4
);
router.get(
    '/post_configurations_as_documented',
    oi4_repo_controller.postAllEHConfigurationsAsDocumentedToOI4
);
router.get(
    '/update_configurations_as_documented/',
    oi4_repo_controller.updateAllEHConfigurationsAsDocumentedInOI4
);
router.get(
    '/update_configurations_as_documented/:id',
    oi4_repo_controller.updateEHConfigurationsAsDocumentedInOI4
);
router.get(
    '/update_nameplates/:id',
    oi4_repo_controller.updateEHNameplatesInOI4
);

export = router;
