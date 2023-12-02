export async function load({ url }) {
	let next = url.searchParams.get('next');
	return { next };
}
