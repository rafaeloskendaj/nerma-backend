import express from 'express';
import { getSubscriptionPlans, createSubscription, listenStripeEvents, getUserSubscriptionDetails } from '../controllers/subscribe.controller';
import { auth } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', getSubscriptionPlans);
router.post('/create-subscription',auth, createSubscription);
router.post('/webhook', listenStripeEvents);
router.get('/subscription-user-details', auth, getUserSubscriptionDetails);

export default router;
