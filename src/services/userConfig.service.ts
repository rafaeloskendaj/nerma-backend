import { UserConfig } from '../models/user_config';

export async function getUserConfig(user: unknown) {
    return await UserConfig.findOne({ user });
}

export async function updateUserConfig(data) {
    const userConfig = await UserConfig.findOne({ user: data.user, aggregator: data.aggregator });
    if (!userConfig) {
        await UserConfig.create(data)
    };

    userConfig.totalReward = userConfig.totalReward + data.totalReward;
    userConfig.totalSpent = userConfig.totalSpent + data.totalSpent;
    userConfig.currentSyncDate = data.currentSyncDate;
    userConfig.nextSyncDate = data.nextSyncDate;

    await userConfig.save();
};

export async function updateUserReferralReward(reward: number, userId: unknown) {
    const user = await getUserConfig(userId);
    if (user) {
        user.totalReferralReward = user.totalReferralReward + reward;
        await user.save();
    }
};

export async function updateRefereeReward(reward: number, userId: unknown) {
    const user = await getUserConfig(userId);
    if (!user) {
        return await UserConfig.create({
            refereeReward: reward,
            user: userId,
            aggregator: 'PLAID' // HARDCODE
        })
    }
    
    user.refereeReward = reward;
    await user.save();
};