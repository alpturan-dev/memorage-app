import express from 'express';
import { translateWord, getTranslationSuggestions } from '../controller/TranslateController.js';
import { userVerification } from '../middleware/AuthMiddleware.js';
const router = express.Router();

router.use(userVerification);

router.post('/', translateWord);
router.post('/suggestions', getTranslationSuggestions);

export default router;