import cron from 'node-cron';
import { rewardUpdateHandler } from '../services/reward.service';
import { syncPlaidTransactionsForTier } from '../services/plaid.service';

const startScheduler = () => {
  // Weekly (every Monday at 00:00)
  cron.schedule('0 0 * * 1', async () => {
    console.log(`[${new Date().toISOString()}] Weekly job for Basic users`);
    await syncPlaidTransactionsForTier('Basic');
    await rewardUpdateHandler('Basic', 7, 'basicTierPercentage');
  });

  // Daily (every day at 00:00)
  cron.schedule('0 0 * * *', async () => {
    console.log(`[${new Date().toISOString()}] Daily job for Premium+ users`);
    await syncPlaidTransactionsForTier('Premium +');
    await rewardUpdateHandler('Premium +', 1, 'premiumPlusTierPercentage');
  });

  // Custom 48-hour interval using a timestamp tracker
  let lastPremiumRun: number = 0;

  cron.schedule('0 * * * *', async () => {
    const now = Date.now();
    if (now - lastPremiumRun >= 48 * 60 * 60 * 1000) {
      console.log(`[${new Date().toISOString()}] 48-hour job for Premium users`);
      await syncPlaidTransactionsForTier('Premium');
      await rewardUpdateHandler('Premium', 2, 'premiumTierPercentage');
      lastPremiumRun = now;
    }
  });
};

export default startScheduler;
