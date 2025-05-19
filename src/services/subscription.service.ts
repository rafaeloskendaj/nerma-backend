import SubscriptionPlan from "../models/SubscriptionPlan.model";
import { stripe } from "../utils/payment_gateway";
import Subscription from "../models/Subscription.model";
import { findUserById } from "./user.service";

const {FRONTEND_URL} = process.env;

export const getSubscriptionPlans = async (interval: string) => {
  return await SubscriptionPlan.find({ interval });
};

export const getSubscriptionPlansByPriceId = async (PriceId: string) => {
  return await SubscriptionPlan.findOne({ price_id: PriceId });
};

export const findUserByCustomerId = async (stripeCustomerId: string) => await Subscription.findOne({ stripeCustomerId });

export const findSubscribedUserByUserId = async (user: unknown) => await Subscription.findOne({ user }).lean();

export const addSubscribedUserDetails = async (data) => {
  console.log(data);

  const subscribedUser = await findUserByCustomerId(data.stripeCustomerId);

  if (!subscribedUser) {
    await Subscription.create(data);
    return;
  }

  Object.assign(subscribedUser, {
    stripeCustomerId: data.stripeCustomerId,
    stripeSubscriptionId: data.stripeSubscriptionId,
    period: data.period,
    invoice_pdf: data.invoice_pdf,
    hosted_invoice_url: data.hosted_invoice_url,
    description: data.description,
    invoiceNumber: data.invoiceNumber,
    amountPaid: data.amountPaid,
    amountRemaining: data.amountRemaining,
    status: data.status,
    paymentDate: data.paymentDate,
    priceId: data.priceId,
    tier: data.tier
  });

  await subscribedUser.save();
}

export const createSubscriptionService = async (req) => {
  const user = await findUserById(req.token._id);

  if (!user) {
    throw new Error('User not found');
  }

  const { priceId } = req.body;

  const existingCustomer = await findSubscribedUserByUserId(req.token._id);
  let customerId;

  if (!existingCustomer) {
    const customer = await stripe.customers.create({
      email: user.email,
    });
    
    customerId = customer.id;

  } else {
    customerId = existingCustomer.stripeCustomerId;
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${FRONTEND_URL}/home`,
    cancel_url: `${FRONTEND_URL}/subscription`,
  });

  return { url: session.url };
};

