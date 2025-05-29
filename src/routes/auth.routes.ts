import { Router } from 'express';
import { loginController, registerController, verifyTotpController, sendOtp, verifyOtpController } from '../controllers/auth.controller';

const router = Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/send-otp', sendOtp);
router.post('/verify-totp', verifyTotpController);
router.post("/otp/verify", verifyOtpController);

export default router;
