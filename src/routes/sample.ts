import { Router } from 'express';
import controller from '../controllers/sample';

const router = Router();

router.get('/ping', controller.sampleHealthCheck);

export = router;
