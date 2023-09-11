<script>
	import { createEventDispatcher, tick } from 'svelte';
	import { lyricStore, selectedTimelineTrackItemIdStore } from '../stores/lyricStore';


  const dispatch = createEventDispatcher();

	function getCaretPosition() {
		if (window.getSelection && window.getSelection().getRangeAt) {
			var range = window.getSelection().getRangeAt(0);
			var selectedObj = window.getSelection();
			var rangeCount = 0;
			var childNodes = selectedObj.anchorNode.parentNode.childNodes;
			for (var i = 0; i < childNodes.length; i++) {
				if (childNodes[i] == selectedObj.anchorNode) {
					break;
				}
				if (childNodes[i].outerHTML) rangeCount += childNodes[i].outerHTML.length;
				else if (childNodes[i].nodeType == 3) {
					rangeCount += childNodes[i].textContent.length;
				}
			}
			return range.startOffset + rangeCount;
		}
		return -1;
	}

	const splitText = async (e, lyricId) => {
		await tick();
    const text = e.srcElement.innerText;
		const selectedLyric = $lyricStore.find(({ id }) => id === lyricId);
		const selectedLyricIndex = $lyricStore.findIndex(({ id }) => id === lyricId);
		const splitAt = getCaretPosition();
		const p1 = text.slice(0, splitAt);
		const p2 = text.slice(splitAt);
		const halfLength = (selectedLyric.end - selectedLyric.start) / 2;
		const newEnd = selectedLyric.end - halfLength;
		const newStart = selectedLyric.start + halfLength;
    lyricStore.updateById({
			id: lyricId,
			updates: {
				text: p1,
				end: newEnd
			}
		});
    const newId = $lyricStore.length;
		lyricStore.addLyricAtIndex({
			index: selectedLyricIndex + 1,
			newLyric: {
				id: newId,
				text: p2,
				start: newStart,
				end: selectedLyric.end
			}
		});
    dispatch('lyricSplit', { originalLyricId: lyricId, newLyricId: newId })
	};

	const onKeyDown = (e, id) => {
		if (e.keyCode === 13) {
			e.preventDefault();
			splitText(e, id);
		}
	};
</script>

<div class="lyric-editor">
	{#each $lyricStore as lryic}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="lyric-editor__text"
			class:selected={$selectedTimelineTrackItemIdStore === lryic.id}
			contenteditable="true"
			on:keydown={(e) => onKeyDown(e, lryic.id)}
		>
			{lryic.text}
		</div>
	{/each}
</div>

<style lang="scss">
	.lyric-editor {
		color: #fff;
		padding: 10px;
		height: 100%;
	}
	.lyric-editor__text {
		padding: 10px;
		color: #a6a6a6;

		&.selected {
			color: #fff;
			border-left: 0;
			border-right: 0;
		}
	}
</style>
