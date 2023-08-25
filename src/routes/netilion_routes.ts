import { Router } from 'express';
import netilion_controller from '../controllers/netilion_controller';

const router = Router();

// router.get(
//     '/handover_documentations/:id',
//     netilion_controller.getEHHandoverDocuments
// );

// router.get('/get/aas', netilion_controller.get_all_aas);
// router.get('/get/aas/:id', netilion_controller.get_aas);
// router.get(
//     '/get/submodels/:sm_name',
//     netilion_controller.get_submodel_for_all_assets
// );
// router.get('/get/submodels/:sm_name/:id', netilion_controller.get_submodel);

// Map assets to AAS components
router.get('/shells', netilion_controller.get_all_aas);
router.get('/shells/:id', netilion_controller.get_aas);
router.get(
    '/shells/:id/submodels',
    netilion_controller.get_all_submodels_for_asset
);
router.get(
    '/shells/:id/submodels/:sm_name',
    netilion_controller.get_submodel_for_asset
);
router.get('/submodels', netilion_controller.get_all_submodels_for_all_assets);
router.get(
    '/submodels/:sm_name',
    netilion_controller.get_submodel_for_all_assets
);

// Submit mapped components to AAS rpository
router.post('/shells/submit', netilion_controller.submit_all_aas);
router.post('/shells/:id/submit', netilion_controller.submit_aas);
router.post(
    '/shells/:id/submodels/submit',
    netilion_controller.submit_all_submodels_for_asset
);
router.post(
    '/shells/:id/submodels/:sm_name/submit',
    netilion_controller.submit_submodel_for_asset
);
router.post(
    '/submodels/submit',
    netilion_controller.submit_all_submodels_for_all_assets
);
router.post(
    '/submodels/:sm_name/submit',
    netilion_controller.get_submodel_for_all_assets
);

export = router;
