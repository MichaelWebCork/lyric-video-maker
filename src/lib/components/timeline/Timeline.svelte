<script>
	import { lyricStore } from '../../stores/lyricStore';
	import TimelineToolbar from './TimelineToolbar.svelte';
	import TimelineTracks from './TimelineTracks.svelte';

	const initialScalse = 50;
	let scale = 50;

	const onZoom = ({ detail }) => {
		if (detail === 'in') {
			scale = scale * 2;
			return
		}
		const newScale = scale / 2;
		if (newScale <= 0) { return; }
		scale = newScale;
	};
	const onResetZoom = () => {
		scale = initialScalse;
	}
</script>

<div class="timeline">
	<TimelineToolbar on:zoom={onZoom} on:resetZoom={onResetZoom}/>
	{#if $lyricStore}
		<TimelineTracks lyrics={lyricStore} {scale} />
	{/if}
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
