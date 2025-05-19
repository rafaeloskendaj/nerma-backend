import AdminConfig from "../models/Admin_config";
import SubscriptionPlan from "../models/SubscriptionPlan.model";

export const createOrUpdatePlan = async (planData) => {
  return await SubscriptionPlan.findOneAndUpdate(
    { price_id: planData.price_id },
    { $set: planData },
    { upsert: true, new: true }
  );
};

export const upsertAdminConfig = async (data: {
  basicTierPercentage: number;
  premiumTierPercentage: number;
  premiumPlusTierPercentage: number;
}) => {
  const existing = await AdminConfig.findOne();

  if (existing) {
    existing.basicTierPercentage = data.basicTierPercentage;
    existing.premiumTierPercentage = data.premiumTierPercentage;
    existing.premiumPlusTierPercentage = data.premiumPlusTierPercentage;
    return await existing.save();
  }

  await AdminConfig.create(data);
};

export const getAdminConfig = async () => {
  return await AdminConfig.findOne();
};







