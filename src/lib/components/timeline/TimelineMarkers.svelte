<script>
	import { createEventDispatcher } from "svelte";

	export let length;
	export let scale;

  const dispatch = createEventDispatcher();

	$: divideAmmountBy = 60 / scale;
	$: console.log(length)
	$: amount = Math.ceil((length + 10) / divideAmmountBy);

	let percision = 16;
	$: {
		if (divideAmmountBy >= 1) {
			percision = 16;
			break $;
		}
		if (divideAmmountBy <= 0.5) {
			percision = 19;
			break $;
		}
	}

	const getTime = (index) => {
		return new Date(index * scale * 1000 * divideAmmountBy).toISOString().substring(11, percision);
	};

	const onRulerMarkerClick = (e) => {
    const newPosition = e.offsetX + e.srcElement.offsetLeft
    dispatch('rulerClick', newPosition);
  };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="timeline-ruler">
	{#each Array(amount) as _, index (index)}
		<div
			class="timeline-ruler__marker"
			style="width: {scale * divideAmmountBy}px;"
			on:mousedown={onRulerMarkerClick}
		>
			<div class="timeline-ruler__marker-line" />
			<div class="timeline-ruler__marker-time">{getTime(index * divideAmmountBy)}</div>
		</div>
	{/each}
</div>

<style>
	.timeline-ruler {
		display: flex;
		position: fixed;
		cursor: pointer;
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
		content: '';
		display: block;
		width: 1px;
		height: 8px;
		background: rgba(255, 255, 255, 0.6);
    pointer-events: none;
	}

	.timeline-ruler__marker-time {
		margin-top: 1px;
		padding: 0 3px;
		transform: translateX(-50%);
		font-size: 9px;
		line-height: 1.5;
		color: rgba(255, 255, 255, 0.6);
		font-size: 12px;
    pointer-events: none;
	}
</style>
