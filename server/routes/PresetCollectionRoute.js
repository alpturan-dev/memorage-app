import express from 'express';
import { getPresetCollection, getPresetCollectionById, getPresetCollections } from '../controller/PresetCollectionController.js';
import { userVerification } from '../middleware/AuthMiddleware.js';
const router = express.Router();

router.use(userVerification);

router.get('/', getPresetCollections);
router.get('/byId/:id', getPresetCollectionById);
router.get('/:languageCode/:level', getPresetCollection);

export default router;