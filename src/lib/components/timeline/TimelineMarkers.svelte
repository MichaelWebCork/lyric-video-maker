<script>
  export let length;
  export let scale;

  $: divideAmmountBy = 60 / scale

  $: amount = Math.ceil((length + 10) / divideAmmountBy);

  $: console.log(amount)

  let percision = 16;
  $: {
    if (divideAmmountBy >= 1) { 
      percision = 16;
      break $;
    }
    if (divideAmmountBy <= .5) { 
      percision = 19;
      break $;
    }
  }

  const getTime = (index) => {
    return new Date((index * scale) * 1000 * divideAmmountBy).toISOString().substring(11, percision)
  }
</script>

<div class="timeline-ruler">
  {#each Array(amount) as _, index (index)}
    <div class="timeline-ruler__marker" style="width: {scale * divideAmmountBy}px;">
      <div class="timeline-ruler__marker-line"/>
      <div class="timeline-ruler__marker-time">{ getTime(index * divideAmmountBy) }</div>
    </div>
  {/each}
</div>

<style>
  .timeline-ruler {
    display: flex;
    position: fixed;
  }

  .timeline-ruler__marker {
    flex-shrink: 0;
    position: relative;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    padding-bottom: 5px;
    z-index: 9;
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