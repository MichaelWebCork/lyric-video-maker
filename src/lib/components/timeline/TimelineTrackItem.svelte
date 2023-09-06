<script>
	export let text = 'Hello World';
	export let width = 200;
	export let left = 100;	
	
	let moving = false;
	let selectedHandle;
	const placeholderPadding = 5;
	let placeholderWidth = left - placeholderPadding;

	function onMouseMove(e) {
		if (moving) {
			const x = e.movementX;
			if (selectedHandle === 'r') {
				width += x;
				return;
			}
			if (selectedHandle === 'l') {
				width -= x;
			}
			const newLeft = left + x;
			if (newLeft <= 0) { return; }
			left = newLeft;
			placeholderWidth = left - placeholderPadding;
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

<div class="timeline-track__placeholder" style="width: {placeholderWidth}px;"/>
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
	.timeline-track__placeholder {
		background-color: #dddddf14;
		height: 100%;
	}

	.timeline-track-item {
    position: absolute;
		display: flex;
		height: 100%;
		min-width: 1px;
		cursor: grab;
		align-items: center;
		justify-content: space-between;
	}

	.timeline-track-item-handle {
		z-index: 1;
		height: 100%;
		width: 4px;
		flex-shrink: 0;
		top: 0;
		cursor: ew-resize;
		background-color: yellow;
	}

	.timeline-track-item-text {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
