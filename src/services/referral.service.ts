import Referral from "../models/Reffral.model";
import { updateRefereeReward, updateUserReferralReward } from "./userConfig.service";


export function generateReferralCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  const timestamp = Date.now();
  let referralCode = '';

  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    referralCode += characters[randomIndex];
  }

  referralCode = timestamp + referralCode;

  return referralCode;
}

export const createReferral = async (referrerId: unknown, refereeId: unknown) => {
  const data = {
    referrer: referrerId,
    referee: refereeId,
    isAggregatorConnected: false,
    rewardAmount: 0,
    status: 'PENDING',
  }

  await Referral.create(data);
};

export const updateAggregatorConnectionStatus = async (refereeId: string, isAggregatorConnected: boolean) => {
  const referral = await findByRefereeId(refereeId);

  if (referral) {
    await updateRefereeReward(100, refereeId);

    const countReferral = await getCountOfReferral(referral.referrer);
    let rewardAmount;

    if (countReferral > 1) {
      rewardAmount = 25;
      await updateUserReferralReward(rewardAmount, referral.referrer)
    } else {
      rewardAmount = 100;
      await updateUserReferralReward(rewardAmount, referral.referrer)
    }

    referral.isAggregatorConnected = isAggregatorConnected;
    referral.rewardAmount = rewardAmount;
    referral.status = 'COMPLETE';

    await referral.save();
    return referral;
  }
};

export const getCountOfReferral = async (referrerId) => {
  return await Referral.countDocuments({ referrer: referrerId });
};

export const findByRefereeId = async (refereeId) => {
  return await Referral.findOne({ referee: refereeId })
};

export const getReferralStatus = async (referrerId) => {
  const completedReferrals = await Referral.countDocuments({
    referrer: referrerId,
    status: 'COMPLETE',
  });

  const referrals = await Referral.find({
    referrer: referrerId,
    status: 'COMPLETE'
  }, 'rewardAmount');
  
  const totalReward = referrals.reduce((sum, referral) => sum + (referral.rewardAmount || 0), 0);

  const totalReferrals = await getCountOfReferral(referrerId);

  return {
    completedReferrals,
    totalReward,
    totalReferrals,
  };
};

export const getReferralDetailsByReferrer = async (
  referrerId: string,
  page: number,
  limit: number
) => {
  return await Referral.paginate(
    { referrer: referrerId },
    {
      page,
      limit,
      populate: ['referee'],
      sort: { createdAt: -1 },
    }
  );
};
