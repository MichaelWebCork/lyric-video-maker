<script>
	import TimelineTrackItem from './TimelineTrackItem.svelte';
	let currentMouseXPosition;
</script>

<div class="timeline-track">
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<TimelineTrackItem mouseX={currentMouseXPosition}/>
</div>

<style lang="scss">
	.timeline-track {
		position: relative;
		width: 100%;
		height: 30px;
		overflow: hidden;
		display: flex;
	}
</style>
