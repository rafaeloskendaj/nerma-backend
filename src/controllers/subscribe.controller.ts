import { Request, Response } from "express";
import * as SubscriptionService from "../services/subscription.service";
import { processStripeEvent } from "../utils/stripe_webhook";
import { createSubscriptionValidator } from "../validators/subscription.validator";
import createHttpError from "http-errors";
import { CustomRequest } from "../middlewares/admin.middleware";

export const getSubscriptionPlans = async (req: Request, res: Response) => {
  const interval = typeof req.query.interval === 'string' ? req.query.interval : 'month';

  const subscription = await SubscriptionService.getSubscriptionPlans(interval);
  res.json(subscription);
};

export const createSubscription = async (req: Request, res: Response) => {
  const { error } = createSubscriptionValidator.validate(req.body);
  if (error) {
    throw createHttpError.BadRequest(error.details[0].message);
  }

  const result = await SubscriptionService.createSubscriptionService(req);
  res.json(result);
};

export const listenStripeEvents = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const result = await processStripeEvent(req.body, sig);
  res.json({ result });
};

export const getUserSubscriptionDetails = async (req: CustomRequest, res: Response) => {
  const data = await SubscriptionService.findSubscribedUserByUserId(req.token._id);
  res.json({ data })
};