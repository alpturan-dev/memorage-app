import express from 'express';
import { createWord, getWordsByWordCollection, updateWord, deleteWord } from '../controller/WordController.js';
import { userVerification } from '../middleware/AuthMiddleware.js';
const router = express.Router();

router.use(userVerification);

router.post('/', createWord);
router.get('/wordCollection/:wordCollectionId', getWordsByWordCollection);
router.put('/:id', updateWord);
router.delete('/:id', deleteWord);

export default router;