import { Router } from 'express';
import netilion_controller from '../controllers/netilion_controller';
import oi4_repo_controller from '../controllers/oi4_repo_controller';

const router = Router();

// OI4 Repo

router.get('/get/aas', oi4_repo_controller.get_all_aas);
router.get('/get/aas/:id', oi4_repo_controller.get_aas);
router.get('/get/submodels', oi4_repo_controller.get_submodel_for_all_assets);
router.get('/get/submodels/:id', oi4_repo_controller.get_submodel);

router.get('/post/aas', oi4_repo_controller.post_all_aas);
router.get('/post/aas/:id', oi4_repo_controller.post_aas);
router.get(
    '/post/submodels/:sm_name',
    oi4_repo_controller.post_submodel_for_all_assets
);
router.get('/post/submodels/:sm_name/:id', oi4_repo_controller.post_submodel);

router.get('/update/aas', oi4_repo_controller.update_all_aas);
router.get('/update/aas/:id', oi4_repo_controller.update_aas);
router.get(
    '/update/submodels/:sm_name',
    oi4_repo_controller.update_submodel_for_all_assets
);
router.get(
    '/update/submodels/:sm_name/:id',
    oi4_repo_controller.update_submodel
);
export = router;
