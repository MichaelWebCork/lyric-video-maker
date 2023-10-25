<script>
	import gsap from 'gsap';
	import * as PIXI from 'pixi.js';
	import { onMount, tick } from 'svelte';
	import { browser } from '$app/environment';
	import exportWebWorker from '$lib/workers/export?worker';
	import Timeline from '$lib/components/timeline/Timeline.svelte';
	import { lyrics } from '$lib/lyrics.json';
	import { lyricStore } from '$lib/stores/lyricStore';
	import {
		shouldTimelineFollowCursor,
		playState,
		availablePlayStates
	} from '$lib/stores/videoControlStore';
	import { waveSurfer, waveSurferProgress } from '$lib/stores/waveSurferStore';
	import { tl } from '$lib/stores/gsapTimeLineStore';
	import AspectRatioContainer from '$lib/components/AspectRatioContainer.svelte';
	import LyricEditor from '$lib/components/LyricEditor.svelte';
	import Tabs from '$lib/components/Tabs.svelte';
	import BulkLyricInput from '$lib/components/BulkLyricInput.svelte';
	import Dropzone from '$lib/components/Dropzone.svelte';

	// $lyricStore = [...Object.values(lyrics).map((lyric) => ({ ...lyric, text: lyric.text.trim() }))];

	let exportWorker;
	let canvasElement;
	let currentTime;
	let cursorX = 0;
	let lyricAninmations;
	let length;
	let audioL;
	let audioR;
	let audio;
	let audioInfo;
	let audioFileAsUrl;
	let audioFileLength;

	const play = async () => {
		await $waveSurfer?.play();
		$tl.resume();
	};

	const pause = async () => {
		await $waveSurfer?.pause();
		$tl.pause();
	};

	$: {
		if ($playState === availablePlayStates.play) {
			play();
		}
		if ($playState === availablePlayStates.pause) {
			pause();
		}
	}

	let selectedElementEditorSectionTab = 'lyrics';
	const elementEditorSectionTabs = [
		{ key: 'upload', label: 'Upload' },
		{ key: 'lyrics', label: 'Lyrics' },
		{ key: 'style', label: 'Style' }
	];

	$tl = gsap.timeline();
	const removeLastAnimationTimestamps = [];
	const fps = 24;
	const width = 1920;
	const height = 1080;
	const centerCordinates = {
		x: width / 2,
		y: height / 2
	};
	let pixiApp;

	const setLength = () => {
		const duration = $tl.duration();
		length = duration > 60 ? duration : 60;
	};

	const resetAllAnimations = () => {
		while (pixiApp.stage.children?.[0]) {
			pixiApp.stage.removeChild(pixiApp.stage.children?.[0]);
		}
		$tl.clear();
	};

	const setLyricAnimations = () => {
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
	};

	const addAllAnimationsToTimeline = () => {
		lyricAninmations.forEach((line, index) => {
			removeLastAnimationTimestamps.push(Math.floor(line.end));
			const currentLine = line.text;
			currentLine.x = centerCordinates.x;
			currentLine.y = centerCordinates.y + 100;
			currentLine.alpha = 0;
			pixiApp.stage.addChild(currentLine);
			$tl.to(
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
			$tl.to(
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
		setLength();
	};

	const setupWatermark = () => {
		const text = new PIXI.Text(
			'Made with LyricVideoBuilder.com',
			new PIXI.TextStyle({ fontFamily: 'Varela Round', fontSize: 32 })
		);
		text.anchor.set(1);
		text.x = width - 80;
		text.y = height - 50;
		pixiApp.stage.addChild(text);
	};

	onMount(async () => {
		if (browser) {
			exportWorker = new exportWebWorker();

			pixiApp = new PIXI.Application({
				view: canvasElement,
				background: '#1099bb',
				width,
				height
			});

			// Create a gsap timeline
			$tl.pause();
			$tl.seek(0);

			// sync pixi and gsap
			pixiApp.ticker.stop();
			gsap.ticker.fps(fps);
			let previousTime = 0;
			gsap.ticker.add(() => {
				if ($playState === availablePlayStates.play) {
					cursorX = $waveSurferProgress;
				}
				// console.log('cursorX', cursorX);
				// if ($tl.isActive() && currentTime !== previousTime) {
				// }
				pixiApp.ticker.update();
			});

			setLyricAnimations();
			addAllAnimationsToTimeline();
			setupWatermark();
			// $tl.resume();
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
			lyrics: $lyricStore,
			audio,
			audioInfo
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
		if (animation) {
			pixiApp.stage.removeChild(animation.text);
			$tl.remove(animation.text);
		}
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
		pixiApp.stage.addChild(newLyricAnimation.text);
		$tl.to(
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
		$tl.to(
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
		setLength();
	};

	const onLyricSplit = ({ detail }) => {
		updateAnimationById(detail.originalLyricId);
		setLyricAnimations();
		updateAnimationById(detail.newLyricId);
	};

	const onCursorMove = ({ detail }) => {
		$waveSurfer.setTime(detail);
		$waveSurferProgress = detail;
		$tl.seek(detail);
		cursorX = detail;
	};

	const onBackToStart = () => {
		$waveSurfer.setTime(0);
		$waveSurferProgress = 0;
		$tl.seek(0);
		cursorX = 0;
		// $playState = availablePlayStates.pause;
		// $waveSurfer.pause();
		// // $tl.pause();
	};
	const onPlay = async () => {
		$playState = availablePlayStates.play;
	};
	const onPause = () => {
		$playState = availablePlayStates.pause;
	};
	const onTabClick = ({ detail }) => {
		selectedElementEditorSectionTab = detail;
	};
	const onTextAreaInput = () => {
		resetAllAnimations();
		setLyricAnimations();
		addAllAnimationsToTimeline();
		setupWatermark();
	};

	function obtainMp3BytesInArrayBufferUsingFileAPI(selectedFile, callback) {
		const reader = new FileReader();
		reader.onload = function (ev) {
			// The FileReader returns us the bytes from the computer's file system as an ArrayBuffer
			var mp3BytesAsArrayBuffer = reader.result;
			callback(mp3BytesAsArrayBuffer);
		};
		reader.readAsArrayBuffer(selectedFile);
	}

	function decodeMp3BytesFromArrayBufferAndPlay(mp3BytesAsArrayBuffer) {
		const audioContext = new AudioContext();
		audioContext.decodeAudioData(mp3BytesAsArrayBuffer, (decodedSamplesAsAudioBuffer) => {
			audioInfo = {
				sampleRate: decodedSamplesAsAudioBuffer.sampleRate,
				numberOfChannels: decodedSamplesAsAudioBuffer.numberOfChannels,
				numberOfFrames: decodedSamplesAsAudioBuffer.length
			};
			audioFileLength = decodedSamplesAsAudioBuffer.duration;
			audioL = decodedSamplesAsAudioBuffer.getChannelData(0);
			audioR = decodedSamplesAsAudioBuffer.getChannelData(1);
			const arr = new Float32Array(audioL.length + audioR.length);
			arr.set(audioL);
			arr.set(audioR);
			audio = arr;
		});
	}

	async function readFile(file, readAs) {
		return new Promise((resolve, reject) => {
			let fileReader = new FileReader();
			fileReader.onload = function () {
				return resolve({
					data: fileReader.result,
					name: file.name,
					size: file.size,
					type: file.type
				});
			};
			if (readAs === 'buffer') {
				fileReader.readAsArrayBuffer(file);
				return;
			}
			if (readAs === 'binary') {
				fileReader.readAsBinaryString(file);
				return;
			}
			if (readAs === 'url') {
				fileReader.readAsDataURL(file);
				return;
			}
			fileReader.readAsText(file);
		});
	}

	const readAudioFile = async ({ detail }) => {
		audioFileAsUrl = await readFile(detail, 'url');
		obtainMp3BytesInArrayBufferUsingFileAPI(detail, (mp3BytesAsArrayBuffer) => {
			decodeMp3BytesFromArrayBufferAndPlay(mp3BytesAsArrayBuffer);
		});
	};

	const onFollowCursor = () => {
		$shouldTimelineFollowCursor = !$shouldTimelineFollowCursor;
	};

	const onTimeLineKeyDown = (e) => {
		const isBody = e.srcElement.nodeName === 'BODY';
		const isButton = e.srcElement.nodeName === 'BUTTON';
		if (!isBody && !isButton) {
			return;
		}
		e.preventDefault();
		switch (e.keyCode) {
			case 32: // space key
				const isPlaying = $tl.isActive() || $playState === availablePlayStates.play;
				if (isPlaying) {
					onPause();
					return;
				}
				onPlay();
				break;

			case 70: // F key
				onFollowCursor();
				break;

			default:
				break;
		}
	};
</script>

<svelte:window on:keydown={onTimeLineKeyDown} />
<div class="editor">
	<div class="editor__sidebar" />
	<div class="editor__element-edit-section">
		<Tabs
			tabs={elementEditorSectionTabs}
			selectedKey={selectedElementEditorSectionTab}
			on:onTabClick={onTabClick}
		/>
		{#if selectedElementEditorSectionTab === 'upload'}
			<div class="editor__upload-tab">
				<div>
					<Dropzone
						dontRead={true}
						on:readFile={readAudioFile}
						placeholderText="Drag and drop audio file here (.wav, .mp3)"
					/>
				</div>
				<BulkLyricInput on:textAreaInput={onTextAreaInput} />
			</div>
		{/if}
		{#if selectedElementEditorSectionTab === 'lyrics'}
			<LyricEditor on:lyricSplit={onLyricSplit} />
		{/if}
		{#if selectedElementEditorSectionTab === 'style'}
			<LyricEditor on:lyricSplit={onLyricSplit} />
		{/if}
	</div>
	<div class="editor__element-preview-section">
		<AspectRatioContainer>
			<canvas class="preview-canvas" bind:this={canvasElement} />
		</AspectRatioContainer>
		<div>
			<button on:click={exportVideo}>Export</button>
			<button on:click={onBackToStart}>Restart</button>
			<button on:click={onPause}>Pause</button>
			<button on:click={onPlay}>Play</button>
			<button class:buttonActive={$shouldTimelineFollowCursor} on:click={onFollowCursor}
				>Follow Cursor</button
			>
		</div>
	</div>
	<div class="editor__element-timeline-section">
		<Timeline
			{length}
			{audioFileAsUrl}
			{audioFileLength}
			bind:cursorX
			on:cursorMove={onCursorMove}
			on:timelineUpdate={({ detail }) => updateAnimationById(detail.id)}
		/>
	</div>
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
		&::-webkit-scrollbar {
			width: 19px;
			height: 19px;
			background-color: #202024;
			z-index: 2;
			position: relative;
		}

		&.app-timeline-trackpad::-webkit-scrollbar-corner {
			background-color: #202024;
		}

		&::-webkit-scrollbar-thumb {
			border-radius: 10px;
			border: 7px solid #202024;
			background-color: #545459;
			background-clip: content-box;
		}
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
		color: #fff;
	}
	.editor__element-edit-section {
		grid-area: 1 / 2 / 5 / 3;
		display: flex;
		flex-direction: column;
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
		width: 100%;
		height: 100%;
	}

	button.buttonActive {
		background-color: rgb(90, 166, 242);
	}

	.editor__upload-tab {
		padding: 20px;
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
</style>
