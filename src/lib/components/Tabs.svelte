<script>
	import ButtonDivider from './ButtonDivider.svelte';

	export let tabs;
</script>

<div class="tabs">
	{#each tabs as tab, index}
		{tab.label}
		{#if index < tabs.length-1}
			<ButtonDivider />
		{/if}
	{/each}
</div>

<style>
	.tabs {
		display: flex;
		color: #a6a6a6;
		align-items: center;
		padding: 10px;
		font-size: 12px;

		&:hover {
			cursor: pointer;
		}

		&:focus,
		&:hover,
		&.selected {
			color: #fff;
		}
	}
</style>
