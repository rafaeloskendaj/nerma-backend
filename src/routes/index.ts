import { Router } from 'express';
import authRouter from './auth.routes';
import adminRouter from './admin.routes';
import plaidRouter from './plaid.routes';
import userRouter from './user.routes';
import rewardRouter from './reward.routes';
import transactionRouter from './transaction.routes';
import { adminMiddleware } from '../middlewares/admin.middleware';
import { auth } from '../middlewares/auth.middleware';
import subscriptionRoutes from "./subscription.routes";

const router = Router();

router.use('/auth', authRouter);
router.use('/subscription', subscriptionRoutes);
router.use('/admin', auth, adminMiddleware, adminRouter);
router.use('/plaid', auth, plaidRouter);
router.use('/user', auth, userRouter);
router.use('/transaction', auth, transactionRouter);
router.use('/reward', auth, rewardRouter);

export default router;
