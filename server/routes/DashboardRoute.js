import express from 'express';
import { getDashboardStats, recordActivity } from '../controller/DashboardController.js';
import { userVerification } from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.use(userVerification);

router.get('/stats', getDashboardStats);
router.post('/activity', recordActivity);

export default router;
