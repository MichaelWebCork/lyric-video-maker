import { writable } from 'svelte/store';

export const availablePlayStates = {
  play: 'play',
  pause: 'pause',
}

export const ticker = writable(0);
export const playState = writable(availablePlayStates.pause);
export const shouldTimelineFollowCursor = writable(true);