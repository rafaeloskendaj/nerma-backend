import express from 'express';
import { getStatusOfReferral, getReferralsByReferrer, updateStatusOfReferral } from '../controllers/referral.controller';

const router = express.Router();

router.get('/status', getStatusOfReferral);
router.get('/all', getReferralsByReferrer);
router.put('/update-status', updateStatusOfReferral);

export default router;
