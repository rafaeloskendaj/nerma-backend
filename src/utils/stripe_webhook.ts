import { addSubscribedUserDetails, getSubscriptionPlansByPriceId } from '../services/subscription.service';
import { findUserByEmail, updateUserTier } from '../services/user.service';
import { logger } from '../startup/logger';
import { stripe } from './payment_gateway';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export const processStripeEvent = async (reqBody: Buffer, sig: string) => {
    let event;

    try {
        event = stripe.webhooks.constructEvent(reqBody, sig, endpointSecret);
    } catch (err) {
        logger.error(`Webhook error: ${err.message}`);
        throw new Error(`Webhook error: ${err.message}`);
    }

    const { type, data } = event;
    const object = data.object;

    try {
        switch (type) {
            case 'checkout.session.completed': {
                logger.info(`Checkout completed for session: ${object.id}`);
                // Store session info or mark payment initiated
                break;
            }

            case 'payment_intent.created': {
                logger.info(`PaymentIntent created: ${object.id}`);
                break;
            }

            case 'payment_intent.succeeded': {
                logger.info(`PaymentIntent succeeded: ${object.id}`);
                break;
            }

            case 'charge.succeeded': {
                logger.info(`Charge succeeded for: ${object.id}`);
                // Optional: Track successful charges
                break;
            }

            case 'invoice.created': {
                logger.info(`Invoice created: ${object.id}`);
                break;
            }

            case 'invoice.finalized': {
                logger.info(`Invoice finalized: ${object.id}`);
                break;
            }

            case 'invoice.paid': {
                logger.info(`Invoice paid: ${object.id}`);
                const invoicePaid = object;

                const user = await findUserByEmail(invoicePaid.customer_email);
                if (!user) {
                    logger.warn(`User not found for email: ${invoicePaid.customer_email}`);
                    break;
                }

                const priceId = invoicePaid.lines.data[0].pricing.price_details.price;

                const subscriptionPlan = await getSubscriptionPlansByPriceId(priceId);

                const dataToSave = {
                    user: user._id,
                    stripeCustomerId: invoicePaid.customer,
                    stripeSubscriptionId: invoicePaid.subscription,
                    period: {
                        start: new Date(invoicePaid.lines.data[0].period.start * 1000),
                        end: new Date(invoicePaid.lines.data[0].period.end * 1000),
                    },
                    invoice_pdf: invoicePaid.invoice_pdf,
                    hosted_invoice_url: invoicePaid.hosted_invoice_url,
                    description: invoicePaid.description || "Subscription Invoice",
                    invoiceNumber: invoicePaid.number,
                    amountPaid: invoicePaid.amount_paid / 100,
                    amountRemaining: invoicePaid.amount_remaining / 100,
                    status: invoicePaid.status,
                    paymentDate: new Date(invoicePaid.status_transitions.paid_at * 1000),
                    tier: subscriptionPlan.name,
                    priceId
                };

                await addSubscribedUserDetails(dataToSave);
                await updateUserTier(subscriptionPlan.name, invoicePaid.customer_email);
                logger.info(`Subscription saved for user: ${invoicePaid.customer_email}`);
                break;
            }

            case 'invoice.payment_failed': {
                logger.warn(`Invoice payment failed: ${object.id}`);
                // Optional: Mark user subscription as unpaid or suspended
                break;
            }

            case 'customer.subscription.created': {
                logger.info(`Subscription created: ${object.id}`);
                break;
            }

            case 'customer.subscription.deleted': {
                logger.info(`Subscription deleted: ${object.id}`);
                // Optional: Mark user as unsubscribed
                break;
            }

            case 'payment_method.attached': {
                logger.info(`Payment method attached to customer: ${object.customer}`);
                break;
            }

            default: {
                logger.warn(`Unhandled Stripe event type: ${type}`);
                break;
            }
        }
    } catch (err) {
        logger.error(`Stripe event handler failed: ${err.message}`);
    }

    return true;
};
