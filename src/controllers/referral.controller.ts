import { Response } from 'express';
import * as ReferralService from '../services/referral.service';
import { CustomRequest } from '../middlewares/auth.middleware';
import { getPaginateValidate } from '../validators/common.validator';
import createHttpError from 'http-errors';

export const updateStatusOfReferral = async (req: CustomRequest, res: Response) => {
    const { isAggregatorConnected } = req.query;

    if (!isAggregatorConnected) throw createHttpError.BadRequest("Value is required");

    await ReferralService.updateAggregatorConnectionStatus(req.token._id, Boolean(isAggregatorConnected));
    res.json({});
};

export const getStatusOfReferral = async (req: CustomRequest, res: Response): Promise<void> => {
    const status = await ReferralService.getReferralStatus(req.token._id);
    res.json(status);
};

export const getReferralsByReferrer = async (req: CustomRequest, res: Response): Promise<void> => {
    const { error } = getPaginateValidate.validate(req.query);
    if (error) {
        throw createHttpError.BadRequest(error.details[0].message);
    }

    const { page, limit } = req.query;

    const referrals = await ReferralService.getReferralDetailsByReferrer(req.token._id, Number(page), Number(limit));
    res.json(referrals);
};

