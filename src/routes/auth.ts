import { Router } from 'express';
import netilion_controller from '../controllers/netilion_controller';

const router = Router();

// Authenticate
router.post('/asset-source', netilion_controller.get_auth_token);

export = router;
