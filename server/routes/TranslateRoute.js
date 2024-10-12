import express from 'express';
import { translateWord } from '../controller/TranslateController.js';
import { userVerification } from '../middleware/AuthMiddleware.js';
const router = express.Router();

router.use(userVerification);

router.post('/', translateWord);

export default router;