import { derived, writable } from 'svelte/store';


const createLyricStore = () => {
  const { subscribe, set, update } = writable([])
  return {
    subscribe,
    set,
    update,
    updateById: ({ id: lyricId, updates}) => update((lyrics) => {
			return lyrics.map((l) => {
				if (l.id !== lyricId) {
					return l;
				}
				return {
					...l,
					...updates
				};
			})
		}),
    addLyricAtIndex: ({ index, newLyric }) => {
      update((lyrics) => {
        lyrics.splice(index, 0, newLyric)
        return lyrics;
      })
    },
  }
}

export const lyricStore = createLyricStore();


export const selectedTimelineTrackItemIdStore = writable(-1);
export const selectedTimelineTrackItemStore = derived(
	[lyricStore, selectedTimelineTrackItemIdStore ],
	($stores) => $stores[0].find((item) => item.id === $stores[1])
);