import { Router } from 'express';
import controller from '../controllers/sample';

const router = Router();

router.get('/ping', controller.sampleHealthCheck);
router.get('/nameplates', controller.getAllEHNameplates);
router.get('/nameplates/:id', controller.getEHNameplate);
router.get('/aas', controller.getAllEHAAS);
router.get('/aas/:id', controller.getEHAAS);
router.get('/handover_documentations/:id', controller.getEHHandoverDocuments);

export = router;
