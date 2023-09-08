<script>
	import { createEventDispatcher } from 'svelte';
	import { lyricStore } from '../../stores/lyricStore';
	import TimelineCursor from './TimelineCursor.svelte';
	import TimelineMarkers from './TimelineMarkers.svelte';
	import TimelineToolbar from './TimelineToolbar.svelte';
	import TimelineTracks from './TimelineTracks.svelte';

	export let cursorX = 0;

  const dispatch = createEventDispatcher();
	const initialScalse = 60;
	
	let scale = 60;

	const onZoom = ({ detail }) => {
		if (detail === 'in') {
			scale = scale * 2;
			return;
		}
		const newScale = scale / 2;
		if (newScale <= 0) {
			return;
		}
		scale = newScale;
	};
	const onResetZoom = () => {
		scale = initialScalse;
	};
	const onCursorMove = () => {
    dispatch('cursorMove');
	}
</script>

<div class="timeline">
	<TimelineToolbar on:zoom={onZoom} on:resetZoom={onResetZoom} />
	<div class="timeline__scroll-container">
		<TimelineCursor {scale} bind:x={cursorX} on:cursorMove={onCursorMove}/>
		<TimelineMarkers {scale} />
		{#if $lyricStore}
			<TimelineTracks lyrics={lyricStore} {scale} />
		{/if}
	</div>
</div>

<style lang="scss">
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
		padding: 30px 20px 0;

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
</style>
