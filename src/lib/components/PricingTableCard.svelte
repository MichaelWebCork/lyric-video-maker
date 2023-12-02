<script>
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let id;
	export let planName;
	export let description;
	export let price;
	export let isYearly;

	const subscribe = () => dispatch('subscribe', { id });
</script>

<Card.Root class={`flex flex-col ${$$restProps.class || ''}`}>
	<Card.Header class="grow">
		<Card.Title>{planName}</Card.Title>
		<Card.Description>{description}</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="flex items-center gap-2">
			<div class="text-[40px] font-semibold">
				€{price}
			</div>
			<div class="text-xs">
				{#if isYearly}
					per<br />year
				{:else}
					per<br />month
				{/if}
			</div>
			{#if isYearly}
				<Badge>15% off</Badge>
			{/if}
		</div>
	</Card.Content>
	<Card.Footer>
		<Button class="w-full" on:click={subscribe}>Subscribe</Button>
	</Card.Footer>
</Card.Root>
