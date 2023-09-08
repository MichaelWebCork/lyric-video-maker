<script>
	import gsap from 'gsap';
	import * as PIXI from 'pixi.js';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import exportWebWorker from '$lib/workers/export?worker';
	import Timeline from '../lib/components/timeline/Timeline.svelte';
	import { lyrics } from '$lib/lyrics.json';
	import { lyricStore, selectedTimelineTrackItemIdStore } from '../lib/stores/lyricStore';
	import AspectRatioContainer from '../lib/components/AspectRatioContainer.svelte';

	$lyricStore = [...Object.values(lyrics)];

	$: console.log($selectedTimelineTrackItemIdStore)

	let exportWorker;
	let canvasElement;
	let currentTime;
	let cursorX = 0;
	let lyricAninmations;

	$: {
		if (tl.isActive()) {
			break $;
		}
		tl.seek(cursorX);
	}

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
		lyricAninmations = $lyricStore.map(({ id, start, end, text }) => {
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
			tl.to(
				currentLine,
				{
					duration: 0,
					alpha: 0,
					onUpdateParams: [currentLine],
					onComplete: () => {}
				},
				line.end
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
			let previousTime = 0;
			gsap.ticker.add(() => {
				currentTime = tl.time();
				if (tl.isActive() && currentTime !== previousTime) {
					cursorX = currentTime;
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

	const updateAnimationById = (id) => {
		const findById = (animation) => animation.id === id;
		const animation = lyricAninmations.find(findById);
		app.stage.removeChild(animation.text);
		tl.remove(animation.text);

		const { id: storeId, start, end, text } = $lyricStore.find(findById);
		const pixiText = new PIXI.Text(text);
		pixiText.anchor.set(0.5);
		const newLyricAnimation = {
			id: storeId,
			start,
			end,
			text: pixiText
		};
		newLyricAnimation.text.x = centerCordinates.x;
		newLyricAnimation.text.y = centerCordinates.y + 100;
		newLyricAnimation.text.alpha = 0;
		app.stage.addChild(newLyricAnimation.text);
		tl.to(
			newLyricAnimation.text,
			{
				x: newLyricAnimation.text.x,
				y: centerCordinates.y,
				duration: 0.5,
				alpha: 1,
				onUpdateParams: [newLyricAnimation.text],
				onComplete: () => {}
			},
			newLyricAnimation.start
		);
		tl.to(
			newLyricAnimation.text,
			{
				duration: 0,
				alpha: 0,
				onUpdateParams: [newLyricAnimation.text],
				onComplete: () => {}
			},
			newLyricAnimation.end
		);
		lyricAninmations = lyricAninmations.map((animation) => {
			if (animation.id !== id) {
				return animation;
			}
			return newLyricAnimation;
		});
	};

	const onTimelineUpdate = ({ detail }) => {
		updateAnimationById(detail.id);
	};

	const onCursorMove = () => {
		tl.pause();
	};

	const onBackToStart = () => {
		tl.seek(0);
		tl.resume();
	};
	const onPlay = () => tl.resume();
	const onPause = () => tl.pause();
</script>

<div class="editor">
	<div class="editor__sidebar">test</div>
	<div class="editor__element-edit-section">el edit section</div>
	<div class="editor__element-preview-section">
		<AspectRatioContainer>
			<canvas class="preview-canvas" bind:this={canvasElement} />
		</AspectRatioContainer>
		<div>
			<button on:click={exportVideo}>Export</button>
			<button on:click={onBackToStart}>Restart</button>
			<button on:click={onPause}>Pause</button>
			<button on:click={onPlay}>Play</button>
		</div>
	</div>
	<div class="editor__element-timeline-section">
		<Timeline bind:cursorX on:cursorMove={onCursorMove} on:timelineUpdate={onTimelineUpdate} />
	</div>
</div>

<style>
	:global(body) {
		padding: 0;
		margin: 0;
	}
	:global(*, *::before, *::after) {
		box-sizing: border-box;
	}

	.editor {
		height: 100vh;
		display: grid;
		grid-template-columns: 80px repeat(4, 3fr);
		grid-template-rows: repeat(5, 1fr);
		grid-column-gap: 0px;
		grid-row-gap: 0px;
		background-color: #202024;
	}

	.editor__sidebar {
		grid-area: 1 / 1 / 5 / 2;
	}
	.editor__element-edit-section {
		grid-area: 1 / 2 / 5 / 3;
	}
	.editor__element-preview-section {
		grid-area: 1 / 3 / 5 / 6;
		display: flex;
		flex-direction: column;
	}
	.editor__element-timeline-section {
		grid-area: 5 / 1 / 6 / 6;
	}

	.preview-canvas {
		/* width: 854px;
		height: 480px; */
		width: 100%;
		height: 100%;
	}
</style>
