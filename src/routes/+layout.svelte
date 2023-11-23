<script>
	export let data;

	import '../app.postcss';

	import { invalidate } from '$app/navigation';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Toasts } from 'svoast';

	$: ({ supabase, session } = data);
	$: loggedIn = session?.user?.id;

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});

	const logout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			return;
		}
		goto('/auth/login');
	};
</script>

<div class="lyric-video-builder-container">
	<Toasts position="top-right" />
	<nav class="nav">
		<a href="/" class="nav__link">Lyric Video Builder</a>
		<div>
			{#if loggedIn}
				<button class="nav__link" on:click={logout}>Log out</button>
			{:else}
				<a href="/auth/login" class="nav__link">Login / Register</a>
			{/if}
		</div>
	</nav>
	<slot />
</div>

<style>
	:root {
		/* Spacing for the container and between each toast */
		--svoast-offset: 16px;
		--svoast-gap: 16px;
		/* The toast itself. */
		--svoast-bg: #333;
		--svoast-text: #fff;
		--svoast-padding: 10px 15px 10px 18px;
		--svoast-radius: 4px;
		--svoast-shadow: 0 2px 7px hsl(0 0% 0% / 0.25);
		--svoast-font-size: 14px;
		--svoast-dismiss-gap: 8px;
		--svoast-max-width: unset;
		/* The current colour of the toast, depending on the type */
		--svoast-colour: '';
		/* Colour for each type */
		--svoast-info-colour: #888;
		--svoast-attention-colour: #38bdf8;
		--svoast-success-colour: #4ade80;
		--svoast-warning-colour: #fb923c;
		--svoast-error-colour: #ef4444;
		/* The coloured bar */
		--svoast-bar-width: 3px;
		/* Icons */
		--svoast-icon-padding: 2px;
	}

	.lyric-video-builder-container {
		display: flex;
		flex-direction: column;
		color: #fff;
		min-height: 100vh;
	}

	.nav {
		height: 30px;
		display: flex;
		align-items: center;
		padding: 0 20px;
		color: #fff;
		justify-content: space-between;
	}

	.nav__link {
		text-decoration: none;
		color: #fff;
	}
</style>
