import express from 'express';
import { createCollection, getAllCollections, getCollectionById, updateCollection, deleteCollection } from '../controller/CollectionController.js';
import { userVerification } from '../middleware/AuthMiddleware.js';
const router = express.Router();

router.use(userVerification);

router.post('/', createCollection);
router.get('/', getAllCollections);
router.get('/:id', getCollectionById);
router.put('/:id', updateCollection);
router.delete('/:id', deleteCollection);

export default router;