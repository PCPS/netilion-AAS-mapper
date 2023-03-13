import { Router } from 'express';
import controller from '../controllers/sample';

const router = Router();

router.get('/ping', controller.sampleHealthCheck);
router.get('/assets', controller.getAllEHAssets);
router.get('/assets/:id', controller.getEHAsset);

export = router;
