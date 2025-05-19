import { Router } from 'express';
import {  exchangeTokenController, createLinkTokenController } from '../controllers/plaid.controller';

const router = Router();

router.post('/exchange-token', exchangeTokenController);
router.get('/create-link-token', createLinkTokenController);

export default router;
