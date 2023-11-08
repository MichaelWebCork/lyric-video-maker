<script>
	export let data;

	let { supabase } = data;
	$: ({ supabase } = data);
	$: console.log(supabase);

	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	let email;
	let code;
	let tokenSent = false;

	const sendCode = async () => {
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
		if (!error) {
			tokenSent = true;
		}
	};

	const login = async () => {
		if (!code?.length) {
			return;
		}
		const { data, error } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' });
		if (error) {
			console.log('error', error);
			return;
		}
		console.log(data);
		console.log('logged in');
	};
</script>

<Card.Root class="w-[350px]">
	<Card.Header>
		<Card.Title>Log in</Card.Title>
		<Card.Description>
			To login or signup, enter your email and you will recieve a password.
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
		<Button variant="outline">Cancel</Button>
		{#if tokenSent}
			<Button on:click={login}>Log in</Button>
		{:else}
			<Button on:click={sendCode}>Send</Button>
		{/if}
	</Card.Footer>
</Card.Root>
