// src/routes/export.routes.ts
import { Router } from 'express';
import * as exportController from '../controllers/export.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Apply authentication middleware
router.use(authenticate);

// CSV export endpoint
router.post('/csv', exportController.exportCSV);

export default router;