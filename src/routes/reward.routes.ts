import express from 'express';
import { getRewardsDetails, getTotalSpentReward } from '../controllers/reward.controller';

const router = express.Router();

router.get('/details', getRewardsDetails);
router.get('/total-spent-reward', getTotalSpentReward);

export default router;
