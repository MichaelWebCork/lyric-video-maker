<script>
	import WaveSurfer from 'wavesurfer.js';
	import { browser } from '$app/environment';
	import { createEventDispatcher, tick } from 'svelte';
	import { lyricStore } from '$lib/stores/lyricStore';
	import { waveSurfer, waveSurferProgress } from '$lib/stores/waveSurferStore';
	import { tl } from '$lib/stores/gsapTimeLineStore';
	import {
		shouldTimelineFollowCursor,
		playState,
		availablePlayStates
	} from '$lib/stores/videoControlStore';
	import TimelineCursor from './TimelineCursor.svelte';
	import TimelineMarkers from './TimelineMarkers.svelte';
	import TimelineToolbar from './TimelineToolbar.svelte';
	import TimelineTracks from './TimelineTracks.svelte';

	export let length = 60;
	export let cursorX = 0;
	export let audioFileAsUrl;
	export let audioFileLength;

	const dispatch = createEventDispatcher();
	const initialScalse = 60;
	const maxZoomIn = 60 * 2;
	const maxZoomOut = 60 / 4;
	const cursorTimeYPositionOffset = 100;
	const audioTrackHeight = 60;

	let cursorTimeYPosition = cursorTimeYPositionOffset;
	let scale = 60;
	let timelineScrollContainer;
	let timelineTracksContainer;

	let cursorHeight;
	const cursorOffsetHeight = 52;

	let waveformContainer;
	let unsubscribeFromWaveSurferAudioProcessListener;
	let unsubscribeFromWaveSurferFinishListener;
	const setWaveSurfer = async () => {
		unsubscribeFromWaveSurferAudioProcessListener?.();
		unsubscribeFromWaveSurferFinishListener?.();
		$waveSurfer = WaveSurfer.create({
			container: waveformContainer,
			waveColor: '#ffffff99',
			progressColor: '#383351',
			interact: false,
			cursorWidth: 0,
			fillParent: true,
			height: audioTrackHeight
		});
		await $waveSurfer.load(audioFileAsUrl.data);
		$waveSurfer.setTime($tl.time());
		unsubscribeFromWaveSurferAudioProcessListener = $waveSurfer?.on('audioprocess', () => {
			$waveSurferProgress = $waveSurfer.getCurrentTime();
		});
		unsubscribeFromWaveSurferFinishListener = $waveSurfer?.on('finish', () => {
			$playState = availablePlayStates.pause;
			$tl.seek(0);
		});
	};

	$: {
		if (!browser || !audioFileAsUrl) {
			break $;
		}
		setWaveSurfer();
	}

	$: waveformContainerWidth = audioFileLength * scale;

	const setCursorHeight = async () => {
		await tick();
		cursorHeight = timelineTracksContainer?.offsetHeight + cursorOffsetHeight || 0;
	};

	$: {
		$lyricStore.length;
		setCursorHeight();
	}

	$: {
		if (!$shouldTimelineFollowCursor) {
			break $;
		}
		const currentPos = cursorX * scale;
		if (currentPos < timelineScrollContainer?.offsetWidth / 2) {
			timelineScrollContainer?.scrollTo(0, timelineScrollContainer?.scrollTop || 0);
			break $;
		}
		timelineScrollContainer?.scrollTo(
			currentPos - timelineScrollContainer?.offsetWidth / 2 || 0,
			timelineScrollContainer?.scrollTop || 0
		);
	}

	const onZoom = ({ detail }) => {
		if (detail === 'in') {
			if (scale >= maxZoomIn) {
				scale = maxZoomIn;
			}
			scale = scale * 2;
			return;
		}
		const newScale = scale / 2;
		if (newScale <= maxZoomOut) {
			scale = maxZoomOut;
			return;
		}
		scale = newScale;
	};
	const onResetZoom = () => {
		scale = initialScalse;
	};
	const onCursorMove = ({ detail }) => {
		cursorX = detail / scale;
		dispatch('cursorMove', cursorX);
	};
	const onscroll = (e) => {
		cursorTimeYPosition = e.srcElement.scrollTop + cursorTimeYPositionOffset;
	};
</script>

<div class="timeline">
	<TimelineToolbar on:zoom={onZoom} on:resetZoom={onResetZoom} />
	<div class="timeline__scroll-container" bind:this={timelineScrollContainer} on:scroll={onscroll}>
		<TimelineCursor
			{scale}
			height={cursorHeight}
			yPosition={cursorTimeYPosition}
			bind:x={cursorX}
			on:cursorMove={onCursorMove}
		/>
		<TimelineMarkers {scale} {length} on:rulerClick={onCursorMove} />
		<div
			class="timeline__waveform-container"
			style="width: {waveformContainerWidth}px"
			bind:this={waveformContainer}
		/>
		<div bind:this={timelineTracksContainer}>
			{#if $lyricStore.length}
				<TimelineTracks
					lyrics={lyricStore}
					{scale}
					on:timelineUpdate={({ detail }) => dispatch('timelineUpdate', detail)}
				/>
			{/if}
		</div>
	</div>
</div>

<style>
	.timeline {
		height: 500px;
		display: flex;
		user-select: none;
		flex-direction: column;
		color: #fff;
	}
	.timeline__scroll-container {
		position: relative;
		overflow-x: auto;
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 0 20px;
	}

	.timeline__scroll-container > :global(.timeline-ruler) {
		position: sticky;
		top: 0;
	}

	.timeline__scroll-container > :global(.timeline-tracks) {
		margin-top: 30px;
	}

	.timeline__waveform-container {
		flex: 1;
		z-index: 1;
		position: sticky;
		top: 32px;
		background: #202024;
	}
</style>
