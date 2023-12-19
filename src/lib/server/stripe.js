import Stripe from 'stripe';
import { env } from '$env/dynamic/private';

// export the stripe instance
export const stripe = Stripe(env.STRIPE_API_KEY, {
	// pin the api version
	apiVersion: '2023-10-16'
});
