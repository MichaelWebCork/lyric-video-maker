<script>
	export let data;

	let { supabase } = data;
	$: ({ supabase } = data);

	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Loader2 } from 'lucide-svelte';
	import { toast } from 'svoast';

	let email;
	let code;
	let tokenSent = false;
	let sendingCode = false;
	let loggingIn = false;

	const sendCode = async () => {
		sendingCode = true;
		if (!email?.length) {
			return;
		}
		const { data, error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				// set this to false if you do not want the user to be automatically signed up
				shouldCreateUser: true,
				emailRedirectTo: 'http://localhost:5173/'
			}
		});
		sendingCode = false;
		if (!error) {
			tokenSent = true;
		}
	};

	const login = async () => {
		loggingIn = true;
		if (!code?.length) {
			return;
		}
		const { data, error } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' });
		loggingIn = false;
		if (error) {
			toast.error(error.message);
			return;
		}
		goto('/');
	};
</script>

<Card.Root class="w-[350px]">
	<Card.Header>
		<Card.Title>Log in / Register</Card.Title>
		<Card.Description>
			To login or register, enter your email and you will recieve a one time log in code.
		</Card.Description>
	</Card.Header>
	<Card.Content>
		<form>
			{#if tokenSent}
				<div class="grid w-full items-center gap-4">
					<div class="flex flex-col space-y-1.5">
						<Label for="email">6 digit code</Label>
						<Input
							type="number"
							autocomplete="one-time-code"
							inputmode="numeric"
							maxlength="6"
							pattern="[0-9]"
							bind:value={code}
						/>
					</div>
				</div>
			{:else}
				<div class="grid w-full items-center gap-4">
					<div class="flex flex-col space-y-1.5">
						<Label for="email">Email</Label>
						<Input id="email" placeholder="name@example.com" bind:value={email} />
					</div>
				</div>
			{/if}
		</form>
	</Card.Content>
	<Card.Footer class="flex justify-between">
		<Button on:click={() => goto('/')} variant="outline">Cancel</Button>
		{#if tokenSent}
			<Button on:click={login} disabled={loggingIn}>
				{#if loggingIn}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				Log in
			</Button>
		{:else}
			<Button on:click={sendCode} disabled={sendingCode}>
				{#if sendingCode}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				Send
			</Button>
		{/if}
	</Card.Footer>
</Card.Root>
