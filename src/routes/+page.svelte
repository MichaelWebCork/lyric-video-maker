<script>
	import gsap from 'gsap';
	import * as PIXI from 'pixi.js';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import exportWebWorker from '$lib/workers/export?worker';
	import Timeline from '../lib/components/timeline/Timeline.svelte';
	import { lyrics } from '$lib/lyrics.json';
	import { lyricStore } from '../lib/stores/lyricStore';

	$lyricStore = [...Object.values(lyrics)];

	let exportWorker;
	let canvasElement;
	let currentTime;

	const tl = gsap.timeline();
	const removeLastAnimationTimestamps = [];
	const fps = 24;
	const width = 1920;
	const height = 1080;
	const centerCordinates = {
		x: width / 2,
		y: height / 2
	};
	let app;


	const setAnimations = () => {
		// Generate gsap animations for each line
		const lyricAninmations = $lyricStore.map(({ id, start, end, text }) => {
			const pixiText = new PIXI.Text(text);
			pixiText.anchor.set(0.5);
			return {
				id,
				start,
				end,
				text: pixiText
			};
		});

		lyricAninmations.forEach((line, index) => {
			removeLastAnimationTimestamps.push(Math.floor(line.end));
			const currentLine = line.text;
			currentLine.x = centerCordinates.x;
			currentLine.y = centerCordinates.y + 100;
			currentLine.alpha = 0;
			app.stage.addChild(currentLine);
			tl.to(
				currentLine,
				{
					x: currentLine.x,
					y: centerCordinates.y,
					duration: 0.5,
					alpha: 1,
					onUpdateParams: [currentLine],
					onComplete: () => {}
				},
				line.start
			);
		});
	};

	onMount(async () => {
		if (browser) {
			exportWorker = new exportWebWorker();

			app = new PIXI.Application({
				view: canvasElement,
				background: '#1099bb',
				width,
				height
			});

			// Create a gsap timeline
			tl.pause();
			tl.seek(0);

			// sync pixi and gsap
			app.ticker.stop();
			gsap.ticker.fps(fps);
			gsap.ticker.add(() => {
				currentTime = tl.time();
				// console.log(currentTime)
				// console.log(removeLastAnimationTimestamps[0])
				if (currentTime >= removeLastAnimationTimestamps[0]) {
					console.log('remove');
				}
				app.ticker.update();
			});

			setAnimations();

			// tl.resume();
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
			height: 1080,
			lyrics: $lyricStore
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
	const onBackToStart = () => {
		tl.seek(0);
		tl.resume();
	};
	const onPlay = () => tl.resume();
	const onPause = () => tl.pause();
</script>

<div>
	<canvas bind:this={canvasElement} />
	<button on:click={exportVideo}>Export</button>
	<button on:click={onBackToStart}>Restart</button>
	<button on:click={onPause}>Pause</button>
	<button on:click={onPlay}>Play</button>
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
