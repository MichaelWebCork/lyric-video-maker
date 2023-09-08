<script>
	import { createEventDispatcher } from "svelte";
  
  const dispatch = createEventDispatcher();
</script>
<div class="timeline-toolbar">
  <button on:click={() => dispatch('zoom', 'in')}>+</button>
  <button on:click={() => dispatch('zoom', 'out')}>-</button>
  <button on:click={() => dispatch('resetZoom')}>Reset</button>
  <div class="timeline-toolbar__divider"/>
  <button on:click={() => dispatch('split')}>Split</button>
</div>

<style lang="scss">
  .timeline-toolbar {
    display: flex;
    align-items: center;
  }
  .timeline-toolbar__divider {
    content: "";
    width: 1px;
    height: 10px;
    background: rgba(255,255,255,.6);
    margin: 0 8px;
  }
</style>