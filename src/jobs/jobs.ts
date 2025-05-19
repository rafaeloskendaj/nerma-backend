import cron from 'node-cron';
import { rewardUpdateHandler } from '../services/reward.service';
import { syncPlaidTransactionsForTier } from '../services/plaid.service';

const startScheduler = () => {
  cron.schedule('*/1 * * * *', async () => {
    console.log(`[${new Date().toISOString()}] Running job for basic users`);
    await syncPlaidTransactionsForTier('Basic', 30)
  });

  cron.schedule('*/2 * * * *', async () => {
    console.log(`[${new Date().toISOString()}] Running job for premium users`);
    await syncPlaidTransactionsForTier('Premium', 30)
  });

  cron.schedule('*/3 * * * *', async () => {
    console.log(`[${new Date().toISOString()}] Running job for premium+ users`);
    await syncPlaidTransactionsForTier('Premium +', 30)
  });

  cron.schedule('*/1 * * * *', async () => {
    console.log(`[${new Date().toISOString()}] Running reward job for basic users`);
    await rewardUpdateHandler('Basic', 7, 'basicTierPercentage')
  });

  cron.schedule('*/2 * * * *', async () => {
    console.log(`[${new Date().toISOString()}] Running reward job for premium users`);
    await rewardUpdateHandler('Premium', 2, 'premiumTierPercentage')
  });

  cron.schedule('*/3 * * * *', async () => {
    console.log(`[${new Date().toISOString()}] Running reward job for premium+ users`);
    await rewardUpdateHandler('Premium +', 1, 'premiumPlusTierPercentage')
  });
};

export default startScheduler;
