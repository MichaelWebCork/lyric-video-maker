<script>
	import { createEventDispatcher } from 'svelte';
	import ButtonDivider from './ButtonDivider.svelte';

	export let tabs;
	export let selectedKey;

	const dispatch = createEventDispatcher();

	const onTabClick = (key) => {
		dispatch('onTabClick', key);
	};
</script>

<div class="tabs">
	{#each tabs as tab, index}
		<button
			class="tab-button"
			class:selected={selectedKey === tab.key}
			on:click={() => onTabClick(tab.key)}
		>
			{tab.label}
		</button>
		{#if index < tabs.length - 1}
			<ButtonDivider />
		{/if}
	{/each}
</div>

<style>
	.tabs {
		display: flex;
		align-items: center;
		padding: 10px;
		font-size: 12px;
	}
	.tab-button {
		&:hover {
			cursor: pointer;
		}
	}
</style>
