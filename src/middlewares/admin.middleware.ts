import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { logger } from "../startup/logger";
import { IUser } from "../models/User.model";
import { Role } from "../enums/role";

export interface CustomRequest extends Request {
    token?: IUser;
}

export const adminMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const user = req.token

        if (!user || user.role !== Role.ADMIN) {
            throw createHttpError.Forbidden("Access denied. Admins only.");
        }

        next();
    } catch (error) {
        logger.error("Error: In admin middleware", error);
        next(createHttpError.InternalServerError("Server error"));
    }
};
