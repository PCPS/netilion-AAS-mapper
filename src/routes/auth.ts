import { Router } from 'express';
import netilion_controller from '../controllers/netilion_controller';

const router = Router();

// Authenticate
router.get('/token', netilion_controller.getAuthToken);

export = router;
