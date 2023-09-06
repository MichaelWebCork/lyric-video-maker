<script>
	import TimelineTrackItem from './TimelineTrackItem.svelte';

	export let scale;
	export let lyric;

	let currentMouseXPosition;

</script>

<div class="timeline-track">
	<!-- svelte-ignore a11y-no-static-element-interactions -->
		<TimelineTrackItem mouseX={currentMouseXPosition} {lyric} {scale} />
</div>

<style lang="scss">
	.timeline-track {
		position: relative;
		width: 100%;
		height: 30px;
		display: flex;
	}
</style>
