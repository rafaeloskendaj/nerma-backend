import express from 'express';
import { getRewardsDetails, getTotalSpentReward, getAvailableReward, getRewardTransactions } from '../controllers/reward.controller';

const router = express.Router();

router.get('/details', getRewardsDetails);
router.get('/total-spent-reward', getTotalSpentReward);
router.get('/available-reward', getAvailableReward);
router.get('/reward-tx', getRewardTransactions);

export default router;
