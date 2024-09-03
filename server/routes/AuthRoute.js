import express from 'express';
import { Signup, Login, UpdateUserCredentials } from "../controller/AuthController.js";
import { userVerification } from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.post("/signup", Signup);
router.post('/login', Login);
router.put('/update-user/:id', UpdateUserCredentials, userVerification);

export default router;