<script>
	export let data;

	import '../app.postcss';

	import { invalidate } from '$app/navigation';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

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
	<nav class="nav">
		<a href="/" class="nav__link">Lyric Video Builder</a>
		<div>
			{#if loggedIn}
				<button class="nav__link" on:click={logout}>Log out</button>
			{:else}
				<a href="/auth/login" class="nav__link">Login</a>
			{/if}
		</div>
	</nav>
	<slot />
</div>

<style>
	.lyric-video-builder-container {
		display: flex;
		flex-direction: column;
		color: #fff;
		min-height: 100vh;
		background-color: #202024;
	}

	.nav {
		height: 30px;
		display: flex;
		align-items: center;
		padding: 0 20px;
		background-color: #202024;
		color: #fff;
		justify-content: space-between;
	}

	.nav__link {
		text-decoration: none;
		color: #fff;
	}
</style>
