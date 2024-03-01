import { Router } from 'express';
import netilion_controller from '../controllers/netilion_controller';
import oi4_repo_controller from '../controllers/oi4_repo_controller';

const router = Router();

// OI4 Repo

router.get('/shells', oi4_repo_controller.get_all_aas);
router.get('/shells/:shell_id_b64', oi4_repo_controller.get_aas);
router.get(
    '/shells/:shell_id_b64/submodels',
    oi4_repo_controller.get_all_submodels_of_aas
);
router.get(
    '/shells/:shell_id_b64/submodels/:sm_id_b64',
    oi4_repo_controller.get_submodel_of_aas
);

router.get('/submodels', oi4_repo_controller.get_all_submodels);

router.get('/passthrough/*', oi4_repo_controller.passthrough);

router.post('/submit-dummies/:dummy_count', oi4_repo_controller.submit_dummies);
router.post('/delete-dummies', oi4_repo_controller.delete_dummies);

export = router;
