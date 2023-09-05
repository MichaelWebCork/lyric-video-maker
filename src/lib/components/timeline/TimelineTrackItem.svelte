<script>
	export let text = 'Hello World';
	export let width = 200;
	export let left = 100;

	let moving = false;
	let selectedHandle;

	function onMouseMove(e) {
		if (moving) {
			if (selectedHandle === 'r') {
				width += e.movementX;
				return;
			}
			if (selectedHandle === 'l') {
				left += e.movementX;
				width -= e.movementX;
				return;
			}
      left += e.movementX;
		}
	}

	function onMouseUp() {
		moving = false;
		selectedHandle = null;
	}

	const onMouseDown = (handle) => {
		moving = true;
		selectedHandle = handle;
	};
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="timeline-track-item"
	style="width: {width}px; left: {left}px;"
	on:mousedown|stopPropagation={onMouseDown}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="timeline-track-item-handle" on:mousedown|stopPropagation={() => onMouseDown('l')} />
	<div class="timeline-track-item-text">
		{text}
	</div>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="timeline-track-item-handle" on:mousedown|stopPropagation={() => onMouseDown('r')} />
</div>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

<style lang="scss">
	.timeline-track-item {
    position: absolute;
		display: flex;
		height: 25px;
		min-width: 1px;
		cursor: grab;
		align-items: center;
		justify-content: space-between;
	}

	.timeline-track-item-handle {
		z-index: 1;
		height: 100%;
		width: 8px;
		top: 0;
		cursor: ew-resize;
		background-color: yellow;
	}

	.timeline-track-item-text {
		padding: 8px;
	}
</style>
