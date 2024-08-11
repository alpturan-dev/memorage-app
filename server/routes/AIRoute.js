import express from 'express';
import multer from 'multer';
import { importWordsFromImages } from "../controller/AIController.js";

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/importWordsFromImages', upload.any(), importWordsFromImages);

export default router;