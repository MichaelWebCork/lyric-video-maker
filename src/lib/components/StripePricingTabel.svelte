<script>
	// import { browser } from '$app/environment';
	export let clientReferenceId;
</script>

<svelte:head>
	<script async src="https://js.stripe.com/v3/pricing-table.js"></script>
</svelte:head>

<stripe-pricing-table
	class="stripe-pricing-table"
	pricing-table-id="prctbl_1OHqalDFuR9IRt44HIEQn7nz"
	publishable-key="pk_test_51OFfnlDFuR9IRt44i8F7AQqdbBd06RJEWAbnfSwQUKAGKhvkXpL3xLSEItWmuRAGXjXkF46rg52fSpT425ZSK7Vp00DKMgCQjs"
	client-reference-id={clientReferenceId}
/>

<style>
	.stripe-pricing-table {
		margin-top: 50px;
	}
</style>
