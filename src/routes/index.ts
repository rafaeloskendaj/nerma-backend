import { Router } from 'express';
import authRouter from './auth.routes';
import plaidRouter from './plaid.routes';
import userRouter from './user.routes';
import rewardRouter from './reward.routes';
import transactionRouter from './transaction.routes';
import referralRouter from './referral.routes'
import adminRouter from './admin.routes';
import { auth } from '../middlewares/auth.middleware';
import subscriptionRoutes from "./subscription.routes";
import { checkUserStatus } from '../middlewares/checkUserStatus.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

const router = Router();

router.use('/auth', authRouter);
router.use('/subscription', subscriptionRoutes);
router.use('/admin', auth, adminMiddleware, adminRouter);
router.use('/plaid', auth, checkUserStatus, plaidRouter);
router.use('/user', auth, checkUserStatus, userRouter);
router.use('/transaction', auth, checkUserStatus, transactionRouter);
router.use('/reward', auth, checkUserStatus, rewardRouter);
router.use('/referral', auth, checkUserStatus, referralRouter);

export default router;
