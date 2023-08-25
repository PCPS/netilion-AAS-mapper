import { Router } from 'express';
import netilion_controller from '../controllers/netilion_controller';
import oi4_repo_controller from '../controllers/oi4_repo_controller';

const router = Router();

// OI4 Repo

router.get('/shells', oi4_repo_controller.get_all_aas);
router.get('/shells/:shell_id_b64', oi4_repo_controller.get_aas);

router.get('/submodels', oi4_repo_controller.get_all_submodels);
router.get('/submodels/:sm_id_b64', oi4_repo_controller.get_submodel);

export = router;
