import {  Response, NextFunction } from 'express';
import User from '../models/User.model';
import { CustomRequest } from './auth.middleware';
import createHttpError from 'http-errors';

export const checkUserStatus = async (req: CustomRequest, res: Response, next: NextFunction) => {
        const userId = req.token?._id;

        if (!userId) {
            throw new createHttpError.Unauthorized('Unauthorized access. User ID missing.');
        }

        const user = await User.findById(userId);

        if (!user) {
            throw new createHttpError.NotFound('User not found.');
        }

        // if (user.isAccountDeactivatedByUser) {
        //     return res.status(403).json({ message: 'Account is deactivated by the user.' });
        // }

        if (user.isAccountDeactivateByAdmin) {
            throw new createHttpError.Unauthorized('Account is deactivated by the admin.');
        }

        if (user.isWalletFreezeByAdmin) {
            throw new createHttpError.Unauthorized('Wallet activity is frozen by the admin.');
        }

        if (user.isWalletBlacklistByAdmin) {
            throw new createHttpError.Unauthorized('Wallet is blacklisted by the admin.');
        }

        next();
};
