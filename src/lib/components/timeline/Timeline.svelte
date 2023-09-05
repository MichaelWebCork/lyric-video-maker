<script>
	import TimelineToolbar from "./TimelineToolbar.svelte";
	import TimelineTracks from "./TimelineTracks.svelte";


</script>

<div class="timeline">
  <TimelineToolbar/>
  <TimelineTracks/>
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