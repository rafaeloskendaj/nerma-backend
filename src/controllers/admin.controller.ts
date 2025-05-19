import { Request, Response } from "express";
import * as subscriptionService from "../services/admin.service";
import { subscriptionPlanValidator } from "../validators/admin.validator";
import createHttpError from "http-errors";

export const updatePlan = async (req: Request, res: Response) => {
    const { error } = subscriptionPlanValidator.validate(req.body);
    if (error) {
      throw createHttpError.BadRequest(error.details[0].message);
    }

    const updatedPlan = await subscriptionService.createOrUpdatePlan(req.body);
    res.json({ message: "Plan updated", data: updatedPlan });
};
