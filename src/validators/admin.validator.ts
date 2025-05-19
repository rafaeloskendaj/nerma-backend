import Joi from 'joi';
import { SubscriptionTier } from '../enums/subscription_plans';

export const subscriptionPlanValidator = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().min(0).required(),
  features: Joi.array().items(Joi.string()).min(1).required(),
  tier: Joi.string()
    .valid(...Object.values(SubscriptionTier))
    .required(),
});