import Joi from 'joi';

export const tokenQuerySchema = Joi.object({
  type: Joi.string().valid('crypto', 'fiat').required(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

export const tokenParamsSchema = Joi.object({
  userId: Joi.string().length(24).hex().required(),
});
