import express from 'express';
import { Signup, Login, GoogleLogin, UpdateUserCredentials, UpdatePassword } from "../controller/AuthController.js";
import { userVerification } from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.post("/signup", Signup);
router.post('/login', Login);
router.post('/google-login', GoogleLogin);
router.put('/update-user/:id', UpdateUserCredentials, userVerification);
router.put('/update-password/:id', UpdatePassword, userVerification);

export default router;