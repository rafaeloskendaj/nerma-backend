import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import Subscription from '../models/Subscription.model';

interface AuthenticatedRequest extends Request {
  user?: {
    _id: Types.ObjectId;
  };
}

export const checkSubscription = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized: User not found.' });
    }

    const subscription = await Subscription.findOne({
      user: req.user._id,
      isActive: true,
      'period.start': { $lte: new Date() },
      'period.end': { $gte: new Date() },
    });

    if (!subscription) {
      return res.status(403).json({ message: 'Access Denied: No active subscription.' });
    }

    next();
};
