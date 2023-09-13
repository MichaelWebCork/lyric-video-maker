<script>
	import { createEventDispatcher, tick } from 'svelte';
	import { lyricStore } from '../../stores/lyricStore';
	import TimelineCursor from './TimelineCursor.svelte';
	import TimelineMarkers from './TimelineMarkers.svelte';
	import TimelineToolbar from './TimelineToolbar.svelte';
	import TimelineTracks from './TimelineTracks.svelte';

	export let length = 60;
	export let cursorX = 0;

	const dispatch = createEventDispatcher();
	const initialScalse = 60;
	const maxZoomIn = 60 * 2;
	const maxZoomOut = 60 / 4;
	const cursorTimeYPositionOffset = 100;
	let cursorTimeYPosition = cursorTimeYPositionOffset;

	let scale = 60;
	let timelineTracksContainer;

	let cursorHeight;
	const cursorOffsetHeight = 52;

	const setCursorHeight = async () => {
		await tick();
		cursorHeight = timelineTracksContainer?.offsetHeight + cursorOffsetHeight || 0
	}
	$: {
		$lyricStore.length;
		setCursorHeight();
	};

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
	const onCursorMove = () => {
		dispatch('cursorMove');
	};
	const onRulerClick = ({ detail }) => {
		cursorX = detail / scale;
	};
	const onscroll = (e) => {
		cursorTimeYPosition =  e.srcElement.scrollTop + cursorTimeYPositionOffset;
	};
</script>

<div class="timeline">
	<TimelineToolbar on:zoom={onZoom} on:resetZoom={onResetZoom} />
	<div class="timeline__scroll-container" on:scroll={onscroll}>
		<TimelineCursor {scale} height={cursorHeight} yPosition={cursorTimeYPosition} bind:x={cursorX} on:cursorMove={onCursorMove} />
		<TimelineMarkers {scale} {length} on:rulerClick={onRulerClick} />
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
		background: #202024;
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
		padding: 20px 20px 0;
	}

	.timeline__scroll-container > :global(.timeline-ruler) {
		position: sticky;
		top: 0;
	}

	.timeline__scroll-container > :global(.timeline-tracks) {
		margin-top: 30px;
	}
</style>
