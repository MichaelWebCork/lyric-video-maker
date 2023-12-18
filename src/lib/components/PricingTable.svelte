<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import { createEventDispatcher } from 'svelte';
	import PricingTableCard from './PricingTableCard.svelte';

	const dispatch = createEventDispatcher();

	const monthlyPlans = [
		{
			id: 'price_1OHqGrDFuR9IRt445rCT7vS6',
			name: 'Artist',
			description:
				'15% off for Yearly Subscriptions. Removes water mark from videos, allows greater customization of videos, allows 10 videos per month.',
			price: 30
		},
		{
			id: 'price_1OHrTFDFuR9IRt44L8JIQeyH',
			name: 'Agency',
			description:
				'15% off for Yearly Subscriptions. For marketing agencies and labels, allows unlimited video exports each month.',
			price: 250
		}
	];
	const yearlyPlans = [
		{
			id: 'price_1OHqGrDFuR9IRt44zfYdRB2F',
			name: 'Artist',
			description:
				'15% off for Yearly Subscriptions. Removes water mark from videos, allows greater customization of videos, allows 10 videos per month.',
			price: 306
		},
		{
			id: 'price_1OHrTFDFuR9IRt44d80hB2ef',
			name: 'Agency',
			description:
				'15% off for Yearly Subscriptions. For marketing agencies and labels, allows unlimited video exports each month.',
			price: '2,550'
		}
	];

	const subscribe = ({ detail: { id } }) => {
		dispatch('subscribe', { id });
	};
</script>

<Tabs.Root value="monthly" class="mt-10 flex flex-col items-center">
	<Tabs.List class="mb-10">
		<Tabs.Trigger value="monthly">Monthly</Tabs.Trigger>
		<Tabs.Trigger value="yearly">Yearly (15% off)</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="monthly">
		<div class="flex gap-4 justify-between">
			{#each monthlyPlans as plan}
				<PricingTableCard
					class="w-80"
					id={plan.id}
					planName={plan.name}
					description={plan.description}
					price={plan.price}
					isYearly={false}
					on:subscribe={subscribe}
				/>
			{/each}
		</div>
	</Tabs.Content>
	<Tabs.Content value="yearly">
		<div class="flex gap-4 justify-between">
			{#each yearlyPlans as plan}
				<PricingTableCard
					class="w-80"
					id={plan.id}
					planName={plan.name}
					description={plan.description}
					price={plan.price}
					isYearly={true}
					on:subscribe={subscribe}
				/>
			{/each}
		</div>
	</Tabs.Content>
</Tabs.Root>
