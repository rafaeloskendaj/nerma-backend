import { Request, Response } from "express";
import createHttpError from "http-errors";
import * as RewardService from "../services/reward.service";
import { getDetailsValidate } from "../validators/common.validator";
import { getUserConfig } from "../services/userConfig.service";
import { CustomRequest } from "../middlewares/admin.middleware";

export const getRewardsDetails = async (req: Request, res: Response) => {
    const { error } = getDetailsValidate.validate(req.query);
    if (error) {
        throw createHttpError.BadRequest(error.details[0].message);
    }

    const data = await RewardService.getRewardsByUser(req, req.query);
    res.json(data)
};

export const getTotalSpentReward = async (req: CustomRequest, res: Response) => {
    const data = await getUserConfig(req.token._id);
    res.json({ data })
};

export const getAvailableReward = async (req: CustomRequest, res: Response) => {
    const totalReward = await RewardService.getAvailableReward(req.token._id);
    res.json({ totalReward })
};

export const getRewardTransactions = async (req: CustomRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await RewardService.getTransactions(req.token._id, page, limit);
    res.json(result);
};
