<script>
	import TimelineToolbar from './TimelineToolbar.svelte';
	import TimelineTracks from './TimelineTracks.svelte';

	export let lyrics;
</script>

<div class="timeline">
	<TimelineToolbar />
	<TimelineTracks lyrics={lyrics} />
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
</style>
