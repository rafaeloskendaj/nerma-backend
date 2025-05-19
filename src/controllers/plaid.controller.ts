import { Request, Response } from "express";
import createHttpError from "http-errors";
import { publicTokenSchema } from "../validators/plaid.validator";
import * as PlaidService from "../services/plaid.service";

export const exchangeTokenController = async (req: Request, res: Response) => {
    const { error } = publicTokenSchema.validate(req.body);
    if (error) {
        throw createHttpError.BadRequest(error.details[0].message);
    }

    const data = await PlaidService.exchangePublicToken(req);
    res.json(data)
};

export const createLinkTokenController = async (req: Request, res: Response) => {
    const { error } = publicTokenSchema.validate(req.body);
    if (error) {
        throw createHttpError.BadRequest(error.details[0].message);
    }

    const data = await PlaidService.createLinkToken(req);
    res.json(data)
};
