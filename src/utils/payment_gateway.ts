import Stripe from 'stripe';
import { createOrUpdatePlan } from '../services/admin.service';
import { logger } from '../startup/logger';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const getPlansFromStripe = async () => {
    const prices = await stripe.prices.list({
        active: true,
        expand: ['data.product'],
      });
    
    prices.data.forEach(async (price) => {
        const product = price.product as Stripe.Product;
        const data =  {
          price_id: price.id, 
          name: product.name,
          description: product.description,
          amount: price.unit_amount ?? 0, 
          currency: price.currency,
          interval: price.recurring?.interval || 'month', 
          metadata: product.metadata, 
        };
        
        await createOrUpdatePlan(data)
      });       

    logger.info("Successfully get the products list from stripe")
};