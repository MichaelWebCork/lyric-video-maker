<script>
	export let data;
	$: ({ session } = data);
	$: clientReferenceId = session?.user?.id;
	import StripePricingTabel from '../../../lib/components/StripePricingTabel.svelte';
</script>

{clientReferenceId}
<!-- <StripePricingTabel client-reference-id={clientReferenceId} /> -->
