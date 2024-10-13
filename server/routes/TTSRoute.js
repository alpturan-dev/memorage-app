// ttsRoutes.js
import express from 'express';
import { synthesizeSpeech } from '../controller/TTSController.js';
import { userVerification } from '../middleware/AuthMiddleware.js';
const router = express.Router();
router.use(userVerification);

router.post('/synthesize', synthesizeSpeech);

export default router;