<script>
	import '../app.postcss';
	import Editor from '../lib/components/editor/Editor.svelte';
	import { browser } from '$app/environment';

	// $: ({ supabase } = data);
</script>

<div>
	{#if browser}
		<Editor />
	{/if}
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Varela+Round&display=swap');
	:global(body) {
		padding: 0;
		margin: 0;
	}
	:global(*, *::before, *::after) {
		font-family: 'Varela Round', sans-serif;
		box-sizing: border-box;

		&::-webkit-scrollbar-thumb {
			color: #030a0e;
		}
	}
</style>
