import express from 'express';
import { getSignMessage, verifySignMessage, createWalletController, getProfileDetailsController, getAccountDetailsController, toggle2FAController, uploadImage, updateImageUrl } from '../controllers/user.controller';

const router = express.Router();

router.get('/get-sign-message', getSignMessage);
router.post('/verify-message', verifySignMessage);
router.post('/create-wallet', createWalletController);
router.get('/profile-details', getProfileDetailsController);
router.get('/account-details', getAccountDetailsController);
router.post('/toggle-2fa', toggle2FAController);
router.post('/upload-image', uploadImage);
router.put('/image-url', updateImageUrl);

export default router;