import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required(),
  phone_number: Joi.number().required(),
  // referralCode: Joi.string(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const verifyTotp = Joi.object({
  email: Joi.string().email().required(),
  totp: Joi.string().length(6).pattern(/^[0-9]+$/).required(),
});