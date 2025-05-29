import Joi from "joi";
import { SubscriptionTier } from "../enums/subscription_plans";
import { ethers } from "ethers";

export const subscriptionPlanValidator = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().min(0).required(),
  features: Joi.array().items(Joi.string()).min(1).required(),
  tier: Joi.string()
    .valid(...Object.values(SubscriptionTier))
    .required(),
});

export const mintTokenValidator = Joi.object({
  walletAddress: Joi.string()
    .required()
    .custom((value, helpers) => {
      try {
        ethers.getAddress(value);
        return value;
      } catch (err) {
        return helpers.error("any.invalid", err);
      }
    }),
  amount: Joi.string().required(),
});

export const burnTokenValidator = Joi.object({
  walletAddress: Joi.string().required(),
  amount: Joi.string().required(),
});

export const CsvFileValidator = Joi.object({
  name: Joi.string().required(),
  mimetype: Joi.string()
    .valid("text/csv", "application/vnd.ms-excel")
    .required(),
  size: Joi.number()
    .max(1 * 1024 * 1024)
    .required(),
}).unknown(true);

export const AirdropRequestValidator = Joi.object({
  amount: Joi.number().positive().required(),
  file: Joi.object({
    name: Joi.string().required(),
    mimetype: Joi.string()
      .valid("text/csv", "application/vnd.ms-excel")
      .required(),
    size: Joi.number()
      .max(1 * 1024 * 1024)
      .required(),
  })
    .unknown(true)
    .required(),
});

export const walletAddressValidator = Joi.string().custom((value, helpers) => {
  try {
    ethers.getAddress(value);
    return value;
  } catch (err) {
    return helpers.error("any.invalid", err);
  }
});

export const privateKeyValidator = Joi.string().custom((value, helpers) => {
  try {
    const wallet = new ethers.Wallet(value);
    if (!wallet.privateKey) {
      return helpers.error("any.invalid");
    }
    return value;
  } catch (err) {
    return helpers.error("any.invalid", err);
  }
});

export const validateWalletData = Joi.object({
  walletAddress: walletAddressValidator.optional(),
  privateKey: privateKeyValidator.optional(),
});

export const validateUserEmail = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
});

export const validateCashOutFee = Joi.object({
  fee: Joi.number().min(1).max(100).required(),
});

export const paymentRefundRequest = Joi.object({
  paymentIntend: Joi.string().required(),
  amount: Joi.number().required(),
});

export const addUserByAdmin = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required(),
  access: Joi.string().required(),
  tier: Joi.string().required(),
});