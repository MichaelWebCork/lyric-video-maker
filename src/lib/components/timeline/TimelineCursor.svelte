<script>
	import { createEventDispatcher } from "svelte";

	export let yPosition;
	export let height;
  export let scale;
  export let x = 0;

  const dispatch = createEventDispatcher();
  
	let moving = false;
  let xPadding = 10;

  $: xSclaed = x * scale + xPadding;
  $: time = new Date((x * 60) * 1000).toISOString().substring(11, 19)
  
	function onMouseMove(e) {
		if (moving) {
      const xWithoutScaling = e.movementX / scale;
			const newX = x + xWithoutScaling;

      if (newX <= 0) {
        x = 0;
        return;
      }
      x = newX;
		}
	}

	function onMouseUp() {
		moving = false;
	}

	const onMouseDown = () => {
    moving = true;
    dispatch('cursorMove');
	};
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="timeline-cursor" style="height: {height}px; left: {xSclaed}px;" on:mousedown={onMouseDown}>
	<div class="timeline-cursor__wrapper">
		<div class="timeline-cursor__line" />
		<div class="timeline-cursor__time" style="top: {yPosition}px">{ time }</div>
	</div>
</div>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

<style>
	.timeline-cursor {
		position: absolute;
		top: 0;
		width: 21px;
		left: 10px;
		z-index: 2;
		display: flex;
		justify-content: center;
		pointer-events: none;
		min-height: 100%;
	}
	.timeline-cursor__wrapper {
		position: relative;
	}
	.timeline-cursor__line {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		user-select: none;
		background-color: #fff;
		width: 1px;
	}
	.timeline-cursor__time {
		background: #dddddf;
		border-radius: 8px;
		font-size: 11px;
		line-height: 12px;
		position: absolute;
		transform: translateX(-50%);
		color: #151519;
		padding: 2px 4px;
		left: 1px;
		pointer-events: all;
		cursor: grab;
	}
</style>
