import { CustomRequest } from "../middlewares/admin.middleware";
import { IAdminConfig } from "../models/Admin_config";
import RewardAggregator from "../models/Reward.model";
import Transaction_Plaid from "../models/Transaction_Plaid";
import { getAdminConfig } from "./admin.service";
import { getUsersByTier } from "./user.service";
import { updateUserConfig } from "./userConfig.service";

interface RewardInput {
    userId: unknown;
    aggregator: string;
    syncDurationMs: number;
    totalSpend: number;
    reward: number;
}


export const calculateReward = (totalSpent, multiplier) => {
    const reward = totalSpent * multiplier;
    return Math.floor(reward) / 100;
};

export const createReward = async (input: RewardInput) => {
    await RewardAggregator.create(input)
};

export const getRewardsByUser = async (
    req: CustomRequest, queryParams) => {

    const { page, limit, sortOrder, sortBy } = queryParams;
    const query = {
        userId: req.token._id,
    };

    const options = {
        page,
        limit,
        sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 },
    };

    return await RewardAggregator.paginate(query, options);
};

export const rewardUpdateHandler = async (
    tierName: 'Basic' | 'Premium' | 'Premium +',
    durationDays: number,
    percentageKey: keyof IAdminConfig
) => {
    const users = await getUsersByTier(tierName);
    if (!users.length) return;

    const adminConfig = await getAdminConfig();
    if (!adminConfig) throw new Error('Admin config not found');

    const now = Date.now();
    const durationMs = durationDays * 24 * 60 * 60 * 1000;
    const startDate = new Date(now - durationMs);
    const nextSyncDate = new Date(now + durationMs);

    for (const user of users) {
        const transactions = await Transaction_Plaid.find({
            user: user._id,
            // datetime: { $gte: startDate, $lte: new Date() },
        });

        if (!transactions.length) continue;

        const totalSpend = transactions.reduce((sum, tx) => sum + tx.amount, 0);
        const reward = calculateReward(totalSpend, adminConfig[percentageKey]);

        await createReward({
            userId: user._id,
            aggregator: 'PLAID',
            syncDurationMs: durationMs,
            totalSpend,
            reward,
        });

        const userConfig = {
            user: user._id,
            aggregator: 'PLAID',
            totalSpent: totalSpend,
            totalReward: reward,
            currentSyncDate: new Date(),
            nextSyncDate: nextSyncDate,
        };

        await updateUserConfig(userConfig);

        console.log(`✅ ${tierName} | User ${user._id} spent ${totalSpend} → reward ${reward}`);
    }
};