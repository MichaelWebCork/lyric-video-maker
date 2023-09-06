<script>
	import TimelineTrack from './TimelineTrack.svelte';

	export let lyrics;
	export let scale;

	console.log($lyrics[1].start)

  $: spacerWidth = ($lyrics[$lyrics.length-1].end * 2) * scale;
</script>

<div class="timeline-tracks">
	<div class="timeline-tracks__tracks-container">
		{#each $lyrics as lyric}
		<!-- <div>
			{lyric.start}
		</div> -->
			<TimelineTrack {lyric} {scale}/>
		{/each}
		<div class="timeline-tracks__scroll-spacer" style="width: {spacerWidth}px;"/>
	</div>
</div>

<style lang="scss">
	.timeline-tracks {
		flex-grow: 1;
	}

	.timeline-tracks__tracks-container {
		min-width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 30px 20px 0;
		min-height: 100%;
		user-select: none;
		overflow-x: auto;

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

  .timeline-tracks__scroll-spacer {
    width: 100%;
  }

	.timeline-tracks__tracks-container :global(.timeline-track) {
		margin-bottom: 5px;
	}
</style>
