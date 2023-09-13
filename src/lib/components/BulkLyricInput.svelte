<script>
	import { createEventDispatcher } from 'svelte';
	import { lyricStore } from '../stores/lyricStore';
	import Dropzone from './Dropzone.svelte';

	const dispatch = createEventDispatcher();

	let lyrics;

	$: {
		const splitLyrics = lyrics?.split(/\r?\n|\r|\n/g);
		const lyricsWithStarAndEndTime = splitLyrics?.filter((lyric) => lyric.length)?.map(
			(lyric, index) => ({
				id: index,
				start: 4 * index,
				end: 4 * index + 4,
				text: lyric
			})
		);
		if (!lyricsWithStarAndEndTime?.length) {
			$lyricStore = [];
			break $;
		}
		$lyricStore = lyricsWithStarAndEndTime;
		onTextAreaInput();
	}

	const onTextAreaInput = () => {
		dispatch('textAreaInput');
	};

	const onReadFile = ({detail}) => {
		lyrics = detail;
	}
</script>

<div class="bulk-lyric-input">
	<div class="bulk-lyric-input__dropzone">
		<Dropzone on:readFile={onReadFile}/>
	</div>
	<!-- <div class="bulk-lyric-input__input" contenteditable="true" placeholder="Or start typing..." /> -->
	<textarea
		class="bulk-lyric-input__input"
		placeholder="Or type the lyrics here and seperate each line with a line break."
		bind:value={lyrics}
		on:input={onTextAreaInput}
	/>
</div>

<style>
	.bulk-lyric-input {
		display: flex;
		flex-direction: column;
		flex: 1;
		padding: 10px;
		overflow: hidden;
	}
	.bulk-lyric-input__input {
		flex: 1;
		padding: 10px;
		margin: 10px 0;
		color: #fff;
		background-color: transparent;
	}
</style>
