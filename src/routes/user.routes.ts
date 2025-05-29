import express from 'express';
import { getSignMessage, verifySignMessage, createWalletController, getProfileDetailsController, getAccountDetailsController, changePasswordController, toggle2FAController, uploadImage, updateImageUrl, deactivateAccountByUser, claimReward } from '../controllers/user.controller';

const router = express.Router();

router.get('/get-sign-message', getSignMessage);
router.post('/verify-message', verifySignMessage);
router.post('/create-wallet', createWalletController);
router.get('/profile-details', getProfileDetailsController);
router.get('/account-details', getAccountDetailsController);
router.post('/change-password', changePasswordController);
router.post('/toggle-2fa', toggle2FAController);
router.post('/upload-image', uploadImage);
router.put('/image-url', updateImageUrl);
router.put('/deactivate-account', deactivateAccountByUser);
router.post('/claim-reward', claimReward);

export default router;