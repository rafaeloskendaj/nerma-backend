import express from 'express';
import { getPlaidTransactionController } from '../controllers/transaction.controller';

const router = express.Router();

router.get('/tx', getPlaidTransactionController);

export default router;
