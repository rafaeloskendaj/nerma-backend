import Joi from "joi";

export const validateInitiateRequest = Joi.object({
  reason: Joi.string().required(),
});
