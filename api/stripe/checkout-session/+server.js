import { stripe } from '$lib/server/stripe';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	// Create Checkout Sessions from body params.
	const { priceId, successUrl, cancelUrl } = await request.json();
	const session = await stripe.checkout.sessions.create({
		line_items: [
			{
				price: priceId,
				quantity: 1
			}
		],
		mode: 'subscription',
		success_url: successUrl,
		cancel_url: cancelUrl,
		automatic_tax: { enabled: true }
	});
	// throw redirect(303, session.url);
	return json({ sessionUrl: session.url });
}
