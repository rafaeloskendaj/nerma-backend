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