import express from 'express';
import { Signup, Login, UpdateUserCredentials, UpdatePassword } from "../controller/AuthController.js";
import { userVerification } from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.post("/signup", Signup);
router.post('/login', Login);
router.put('/update-user/:id', UpdateUserCredentials, userVerification);
router.put('/update-password/:id', UpdatePassword, userVerification);

export default router;