import { Router } from 'express';
import netilion_controller from '../controllers/netilion_controller';

const router = Router();

// router.get(
//     '/handover_documentations/:id',
//     netilion_controller.getEHHandoverDocuments
// );

router.get('/get/aas', netilion_controller.get_all_aas);
router.get('/get/aas/:id', netilion_controller.get_aas);
router.get(
    '/get/submodels/:sm_name',
    netilion_controller.get_submodel_for_all_assets
);
router.get('/get/submodels/:sm_name/:id', netilion_controller.get_submodel);

export = router;
