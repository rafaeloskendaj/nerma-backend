import Joi from 'joi';

export const publicTokenSchema = Joi.object({
  public_token: Joi.string()
    // .pattern(/^public-[a-z]+-[\w]+$/)
    .required()
});
