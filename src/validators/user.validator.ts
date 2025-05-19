import Joi from 'joi';

export const validateVerifySignature = (data) => {
    return Joi.object({
        address: Joi.string().required(),
        signature: Joi.string().required(),
    }).validate(data);
};

export const changePasswordValidator = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
});

export const toggle2FAValidator = Joi.object({
    enable2FA: Joi.boolean().required(),
});

export const updateImageUrlValidator = Joi.object({
    imageUrl: Joi.string().required(),
});
