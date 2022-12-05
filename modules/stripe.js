import Stripe from 'stripe';
import dot from "dotenv";
const env = dot.config().parsed;
export const stripe = new Stripe(env.stripe_secret_key);
