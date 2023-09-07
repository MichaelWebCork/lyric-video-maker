<script>
  export let scale;

  const getTime = (index) => {
    return new Date((index * 60) * 1000).toISOString().substring(11, 16)
  }
</script>

<div class="timeline-ruler">
  {#each Array(100) as _, index (index)}
    <div class="timeline-ruler__marker" style="width: {scale}px;">
      <div class="timeline-ruler__marker-line"/>
      <div class="timeline-ruler__marker-time">{ getTime(index) }</div>
    </div>
  {/each}
</div>

<style lang="scss">
  .timeline-ruler {
    display: flex;
  }

  .timeline-ruler__marker {
    flex-shrink: 0;
    position: relative;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    padding-bottom: 5px;
  }

  .timeline-ruler__marker-line {
    content: "";
    display: block;
    width: 1px;
    height: 8px;
    background: rgba(255,255,255,.6);
  }

  .timeline-ruler__marker-time {
    margin-top: 1px;
    padding: 0 3px;
    transform: translateX(-50%);
    font-size: 9px;
    line-height: 1.5;
    color: rgba(255,255,255,.6);
    font-size: 12px;
  }
</style>