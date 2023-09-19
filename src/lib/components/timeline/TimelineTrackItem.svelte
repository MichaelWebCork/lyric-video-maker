<script>
	import { createEventDispatcher, tick } from 'svelte';
	import { lyricStore, selectedTimelineTrackItemIdStore } from '../../stores/lyricStore';

	export let scale;
	export let lyric;

	const dispatch = createEventDispatcher();
	const placeholderPadding = 5;

	let isEditing = false;
	let itemTextElement;
	let moving = false;
	let selectedHandle;

	$: text = lyric.text;
	$: placeholderWidth = lyric.start * scale - placeholderPadding;
	$: width = (lyric.end - lyric.start) * scale;
	$: isSelected = $selectedTimelineTrackItemIdStore === lyric.id;
	$: if (!isSelected) {
		isEditing = false;
	}

	const updateLyric = (updates) => {
		lyricStore.updateById({id: lyric.id, updates});
	};

	function onMouseMove(e) {
		if (moving) {
			const xWithoutScaling = e.movementX / scale;
			if (selectedHandle === 'r') {
				updateLyric({ end: lyric.end + xWithoutScaling });
				return;
			}
			if (selectedHandle === 'l') {
				const start = lyric.start + xWithoutScaling;
				if (start <= 0) {
					updateLyric({ start: 0 });
					return;
				}
				updateLyric({ start });
				return;
			}
			const start = lyric.start + xWithoutScaling;
			if (start <= 0) {
				updateLyric({ start: 0 });
				return;
			}
			updateLyric({
				start,
				end: lyric.end + xWithoutScaling
			});
		}
	}

	function onMouseUp() {
		if (moving) {
			dispatch('timelineUpdate', { id: lyric.id })
		}
		moving = false;
		selectedHandle = null;
	}

	const onMouseDown = (handle) => {
		moving = true;
		selectedHandle = handle;
		$selectedTimelineTrackItemIdStore = lyric.id;
	};

	const onDoubleClick = async () => {
		if (!isSelected) {
			return;
		}
		isEditing = true;
		await tick();
		itemTextElement.focus();
	};
</script>

<div class="timeline-track__placeholder" style="width: {placeholderWidth}px;" />
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	role="button"
	tabindex=""
	class="timeline-track-item"
	class:selected={isSelected}
	style="width: {width}px; left: {placeholderWidth + placeholderPadding}px"
	on:mousedown|stopPropagation={onMouseDown}
	on:dblclick={onDoubleClick}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="timeline-track-item-handle" on:mousedown|stopPropagation={() => onMouseDown('l')} />
	<div class="timeline-track-item-text" bind:this={itemTextElement} contenteditable={isEditing}>
		{text}
	</div>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="timeline-track-item-handle" on:mousedown|stopPropagation={() => onMouseDown('r')} />
</div>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

<style>
	.timeline-track__placeholder {
		flex-shrink: 0;
		background-color: #dddddf14;
		height: 100%;
	}

	.timeline-track-item {
		position: absolute;
		flex-shrink: 0;
		display: flex;
		height: 100%;
		min-width: 1px;
		cursor: grab;
		align-items: center;
		justify-content: space-between;

		&:hover,
		&:focus,
		&:active,
		&.selected {
			border: 1px solid rgb(255, 255, 0);
			border-left: 0;
			border-right: 0;
		}
	}

	.timeline-track-item-handle {
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
