<script>
	import TimelineTrack from "./TimelineTrack.svelte";

  export let lyrics;

  $: console.log(lyrics);

</script>
<div class="timeline-tracks">
  <div class="timeline-tracks__tracks-container">
    {#each lyrics as lyric }
      <TimelineTrack/>
    {/each}
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
  }

  .timeline-tracks__tracks-container :global(.timeline-track) {
    margin-bottom: 5px;
  }

</style>