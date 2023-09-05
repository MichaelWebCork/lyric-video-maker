<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import exportWebWorker from '$lib/workers/export?worker';
	import Timeline from '../lib/components/timeline/Timeline.svelte';

	let exportWorker;

	onMount(async () => {
		if (browser) {
			exportWorker = new exportWebWorker();
		}
	});

	const exportVideo = async () => {
		// Set up file system access
		const fileHandle = await window.showSaveFilePicker({
			suggestedName: `video.webm`,
			types: [
				{
					description: 'Video File',
					accept: { 'video/webm': ['.webm'] }
				}
			]
		});
		const fileWritableStream = await fileHandle.createWritable();

		exportWorker.postMessage({
			width: 1920,
			height: 1080
		});

		exportWorker.onmessage = async (event) => {
			if (event.data.shouldCloseStream) {
				await fileWritableStream.close();
				console.log(new Date().getTime());
				console.log('File saved!');
				return;
			}
			fileWritableStream.write({
				type: 'write',
				data: event.data.data,
				position: event.data.position
			});
		};
	};
</script>

<div>
	<button on:click={exportVideo}>Export</button>
</div>
<Timeline />

<style>
	:global(body) {
		padding: 0;
		margin: 0;
	}
	:global(*, *::before, *::after) {
		box-sizing: border-box;
	}
</style>
