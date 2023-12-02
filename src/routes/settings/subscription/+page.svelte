<script>
	import { goto } from '$app/navigation';

	import PricingTable from '$lib/components/PricingTable.svelte';
	export let data;
	$: ({ session } = data);
	$: clientReferenceId = session?.user?.id;
	import StripePricingTabel from '$lib/components/StripePricingTabel.svelte';

	const onSubscribe = ({ detail: { id } }) => {
		if (!clientReferenceId) {
			const redirectLink = `/settings/subscription?plan=${id}`;
			goto(`/auth/login?next=${redirectLink}`);
			return;
		}
	};
</script>

<PricingTable on:subscribe={onSubscribe} />
<!-- <StripePricingTabel client-reference-id={clientReferenceId} /> -->
