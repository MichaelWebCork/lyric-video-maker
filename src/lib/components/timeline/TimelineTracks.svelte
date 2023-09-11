<script>
	import { createEventDispatcher } from 'svelte';
	import TimelineTrack from './TimelineTrack.svelte';

	export let lyrics;
	export let scale;

	const dispatch = createEventDispatcher();

  $: spacerWidth = ($lyrics[$lyrics.length-1].end * 2) * scale;
</script>

<div class="timeline-tracks">
	<div class="timeline-tracks__tracks-container">
		{#each $lyrics as $lyric}
			<TimelineTrack lyric={$lyric} {scale} on:timelineUpdate={({ detail }) => dispatch('timelineUpdate', detail)}/>
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
		min-height: 100%;
		user-select: none;
	}

  .timeline-tracks__scroll-spacer {
    width: 100%;
  }

	.timeline-tracks__tracks-container :global(.timeline-track) {
		margin-bottom: 5px;
	}
</style>
