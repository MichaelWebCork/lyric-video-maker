<script>
	import { createEventDispatcher } from "svelte";
	import ButtonDivider from '../ButtonDivider.svelte';
  
  const dispatch = createEventDispatcher();
</script>
<div class="timeline-toolbar">
  <button on:click={() => dispatch('zoom', 'in')}>+</button>
  <button on:click={() => dispatch('zoom', 'out')}>-</button>
  <button on:click={() => dispatch('resetZoom')}>Reset</button>
  <div class="timeline-toolbar__divider"/>
  <ButtonDivider />
  <button on:click={() => dispatch('split')}>Split</button>
</div>

<style>
  .timeline-toolbar {
    display: flex;
    align-items: center;
  }
</style>