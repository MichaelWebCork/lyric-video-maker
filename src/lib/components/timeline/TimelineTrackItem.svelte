<script>
	import { lyricStore, selectedTimelineTrackItemStore } from '../../stores/lyricStore';

	export let scale;
	export let lyric;

	const placeholderPadding = 5;

	let moving = false;
	let selectedHandle;
	let text = lyric.text;
	$: placeholderWidth = lyric.start * scale - placeholderPadding;
	$: width = (lyric.end - lyric.start) * scale;

	const updateLyric = (updates) => {
		lyricStore.update((lyrics) => {
			return lyrics.map((l) => {
				if (l.id !== lyric.id) {
					return l;
				}
				return {
					...lyric,
					...updates
				};
			});
		});
	};

	function onMouseMove(e) {
		if (moving) {
			const xWithoutScaling = e.movementX / scale;
			if (selectedHandle === 'r') {
				updateLyric({ end: lyric.end + xWithoutScaling });
				return;
			}
			if (selectedHandle === 'l') {
				updateLyric({ start: lyric.start + xWithoutScaling });
				return;
			}
			updateLyric({
				start: lyric.start + xWithoutScaling,
				end: lyric.end + xWithoutScaling
			});
		}
	}

	function onMouseUp() {
		moving = false;
		selectedHandle = null;
	}

	const onMouseDown = (handle) => {
		moving = true;
		selectedHandle = handle;
		$selectedTimelineTrackItemStore = lyric.id;
	};
</script>

<div class="timeline-track__placeholder" style="width: {placeholderWidth}px;" />
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	role="button"
	tabindex=""
	class="timeline-track-item"
	class:selected={$selectedTimelineTrackItemStore === lyric.id}
	style="width: {width}px;"
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
		flex-shrink: 0;
		background-color: #dddddf14;
		height: 100%;
	}

	.timeline-track-item {
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
