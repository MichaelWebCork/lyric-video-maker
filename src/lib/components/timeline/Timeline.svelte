<script>
	import { createEventDispatcher } from 'svelte';
	import { lyricStore } from '../../stores/lyricStore';
	import TimelineCursor from './TimelineCursor.svelte';
	import TimelineMarkers from './TimelineMarkers.svelte';
	import TimelineToolbar from './TimelineToolbar.svelte';
	import TimelineTracks from './TimelineTracks.svelte';

	export let length = 0;
	export let cursorX = 0;

	const dispatch = createEventDispatcher();
	const initialScalse = 60;
	const maxZoomIn = 60 * 2;
	const maxZoomOut = 60 / 4;

	let scale = 60;

	const onZoom = ({ detail }) => {
		if (detail === 'in') {
			if (scale >= maxZoomIn) {
				scale = maxZoomIn;
			}
			scale = scale * 2;
			return;
		}
		const newScale = scale / 2;
		console.log(newScale)
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
</script>

<div class="timeline">
	<TimelineToolbar on:zoom={onZoom} on:resetZoom={onResetZoom} />
	<div class="timeline__scroll-container">
		<TimelineCursor {scale} bind:x={cursorX} on:cursorMove={onCursorMove} />
		<TimelineMarkers {scale} {length}/>
		{#if $lyricStore}
			<TimelineTracks
				lyrics={lyricStore}
				{scale}
				on:timelineUpdate={({ detail }) => dispatch('timelineUpdate', detail)}
			/>
		{/if}
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
