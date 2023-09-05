<script>
	import TimelineTrackItem from './TimelineTrackItem.svelte';
  let currentMouseXPosition;

	// let moving = false;

	// function onMouseDown() {
	// 	console.log('down');
	// 	moving = true;
	// }

	// function onMouseMove(e) {
  //   currentMouseXPosition = e.movementX 
	// 	if (moving) {
	// 		left += e.movementX;
	// 	}
	// }

	// function onMouseUp() {
	// 	moving = false;
	// }
</script>

<div class="timeline-track">
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="timeline-track-item-wrapper"
	>
		<TimelineTrackItem
      mouseX={currentMouseXPosition}
    />
	</div>
</div>


<style lang="scss">
	.timeline-track {
		position: relative;
		width: 100%;
		height: 30px;
		overflow: hidden;
	}
  .timeline-track-item-wrapper {
    user-select: none;
		cursor: move;
		position: absolute;
  }
</style>
