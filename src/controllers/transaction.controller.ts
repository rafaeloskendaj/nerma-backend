import { Request, Response } from "express";
import createHttpError from "http-errors";
import * as TransactionService from "../services/transactions.service";
import {  getDetailsValidate } from "../validators/common.validator";

export const getPlaidTransactionController = async (req: Request, res: Response) => {
    const { error } = getDetailsValidate.validate(req.query);
    if (error) {
        throw createHttpError.BadRequest(error.details[0].message);
    }

    const data = await TransactionService.getPlaidTransaction(req, req.query);
    res.json(data)
}

