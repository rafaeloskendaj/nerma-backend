import Joi from 'joi';

export const getDetailsValidate = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().allow('', null),
  sortBy: Joi.string().valid(
    'createdAt',
    //   'amount',
    //   'date',
    //   'name',
    //   'merchant_name'
  ).default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

export const getPaginateValidate = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});
