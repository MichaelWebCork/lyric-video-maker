<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import PricingTable from '$lib/components/PricingTable.svelte';
	export let data;
	$: ({ session } = data);
	$: clientReferenceId = session?.user?.id;
	import StripePricingTabel from '$lib/components/StripePricingTabel.svelte';

	const onSubscribe = async ({ detail: { id } }) => {
		if (!clientReferenceId) {
			const redirectLink = `/settings/subscription?plan=${id}`;
			goto(`/auth/login?next=${redirectLink}`);
			return;
		}
		const response = await fetch('/stripe/checkout-session', {
			method: 'POST',
			body: JSON.stringify({
				priceId: id,
				successUrl: `${$page.url.origin}?checkout-success=true`,
				cancelUrl: `${$page.url.origin}?checkout-success=false`
			}),
			headers: {
				'content-type': 'application/json'
			}
		});

		const responseJson = await response.json();
		window.location.href = responseJson.sessionUrl;
	};
</script>

<PricingTable on:subscribe={onSubscribe} />
<!-- <StripePricingTabel client-reference-id={clientReferenceId} /> -->
