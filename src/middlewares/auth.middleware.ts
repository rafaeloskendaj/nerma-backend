import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { findUserById } from '../services/user.service';

export interface CustomRequest extends Request {
    token: JwtPayload & { _id: string };
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new createHttpError.Forbidden("Access Denied. No token provided");
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload & { _id: string };
        const user = await findUserById(decoded._id);

        if (!user) {
            throw new createHttpError.Unauthorized("Please authenticate");
        }
        
        (req as CustomRequest).token = decoded;

        next();
};
