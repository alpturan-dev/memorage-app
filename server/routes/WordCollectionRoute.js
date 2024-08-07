import express from 'express';
import { createWordCollection, getAllWordCollections, getWordCollectionById, updateWordCollection, deleteWordCollection } from '../controller/WordCollectionController.js';
import { userVerification } from '../middleware/AuthMiddleware.js';
const router = express.Router();

router.use(userVerification);

router.post('/', createWordCollection);
router.get('/', getAllWordCollections);
router.get('/:id', getWordCollectionById);
router.put('/:id', updateWordCollection);
router.delete('/:id', deleteWordCollection);

export default router;