<script>
	import { createEventDispatcher } from "svelte";
  
  const dispatch = createEventDispatcher();
</script>
<div class="timeline-toolbar">
  <button on:click={() => dispatch('zoom', 'in')}>+</button>
  <button on:click={() => dispatch('zoom', 'out')}>-</button>
  <button on:click={() => dispatch('resetZoom')}>Reset</button>
</div>