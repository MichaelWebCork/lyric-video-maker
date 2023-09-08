<script>
	import { createEventDispatcher } from 'svelte';
	import TimelineTrackItem from './TimelineTrackItem.svelte';

	export let scale;
	export let lyric;

	let currentMouseXPosition;

	const dispatch = createEventDispatcher();
</script>

<div class="timeline-track">
	<!-- svelte-ignore a11y-no-static-element-interactions -->
		<TimelineTrackItem mouseX={currentMouseXPosition} {lyric} {scale} on:timelineUpdate={({ detail }) => dispatch('timelineUpdate', detail)} />
</div>

<style lang="scss">
	.timeline-track {
		position: relative;
		width: 100%;
		height: 30px;
		display: flex;
	}
</style>
