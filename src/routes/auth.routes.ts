import { Router } from 'express';
import { loginController, registerController, verifyTotpController } from '../controllers/auth.controller';

const router = Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/verify-totp', verifyTotpController);

export default router;
