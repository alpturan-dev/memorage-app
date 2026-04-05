import express from 'express';
import { generateShareLink, removeShareLink, getSharedCollection, copySharedCollection } from '../controller/ShareController.js';
import { userVerification } from '../middleware/AuthMiddleware.js';
const router = express.Router();

router.post('/generate/:id', userVerification, generateShareLink);
router.delete('/revoke/:id', userVerification, removeShareLink);
router.get('/:token', getSharedCollection);
router.post('/:token/copy', userVerification, copySharedCollection);

export default router;
