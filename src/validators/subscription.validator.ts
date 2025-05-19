import Joi from 'joi';

export const createSubscriptionValidator = Joi.object({
  // paymentMethodId: Joi.string().required(),
  priceId: Joi.string().required(),
});
