import { beforeEach, describe, expect, it } from 'vitest';

import { isFeedFinished, useFeedStore } from '@/features/feed/store';

// The store is a module-level singleton: reset it between tests.
beforeEach(() => {
  useFeedStore.getState().restart();
});

describe('useFeedStore', () => {
  it('starts on the first profile with nothing recorded', () => {
    const state = useFeedStore.getState();

    expect(state.currentProfileIndex).toBe(0);
    expect(state.likedCardIds).toEqual([]);
    expect(state.passedProfileIds).toEqual([]);
    expect(state.reaction).toBeNull();
  });

  it('likeCard records the card id and raises a like reaction', () => {
    useFeedStore.getState().likeCard('card-1');

    const state = useFeedStore.getState();
    expect(state.likedCardIds).toEqual(['card-1']);
    expect(state.reaction).toBe('like');
    // Advancing is a separate step (the overlay issue animates in between).
    expect(state.currentProfileIndex).toBe(0);
  });

  it('passProfile records the profile id and raises a pass reaction', () => {
    useFeedStore.getState().passProfile('profile-1');

    const state = useFeedStore.getState();
    expect(state.passedProfileIds).toEqual(['profile-1']);
    expect(state.reaction).toBe('pass');
    expect(state.currentProfileIndex).toBe(0);
  });

  it('advance moves to the next profile and clears the reaction', () => {
    useFeedStore.getState().likeCard('card-1');
    useFeedStore.getState().advance();

    const state = useFeedStore.getState();
    expect(state.currentProfileIndex).toBe(1);
    expect(state.reaction).toBeNull();
    expect(state.likedCardIds).toEqual(['card-1']);
  });

  it('accumulates likes and passes across profiles', () => {
    useFeedStore.getState().likeCard('card-1');
    useFeedStore.getState().advance();
    useFeedStore.getState().passProfile('profile-2');
    useFeedStore.getState().advance();
    useFeedStore.getState().likeCard('card-3');
    useFeedStore.getState().advance();

    const state = useFeedStore.getState();
    expect(state.currentProfileIndex).toBe(3);
    expect(state.likedCardIds).toEqual(['card-1', 'card-3']);
    expect(state.passedProfileIds).toEqual(['profile-2']);
  });

  it('restart resets everything back to the first profile', () => {
    useFeedStore.getState().likeCard('card-1');
    useFeedStore.getState().advance();
    useFeedStore.getState().passProfile('profile-2');

    useFeedStore.getState().restart();

    const state = useFeedStore.getState();
    expect(state.currentProfileIndex).toBe(0);
    expect(state.likedCardIds).toEqual([]);
    expect(state.passedProfileIds).toEqual([]);
    expect(state.reaction).toBeNull();
  });
});

describe('isFeedFinished', () => {
  it('is false while profiles remain', () => {
    expect(isFeedFinished(0, 10)).toBe(false);
    expect(isFeedFinished(9, 10)).toBe(false);
  });

  it('is true once the index is past the last profile', () => {
    expect(isFeedFinished(10, 10)).toBe(true);
  });

  it('finishes after reacting to every profile', () => {
    const profileCount = 10;
    for (let index = 0; index < profileCount; index += 1) {
      useFeedStore.getState().passProfile(`profile-${index}`);
      useFeedStore.getState().advance();
    }

    const state = useFeedStore.getState();
    expect(isFeedFinished(state.currentProfileIndex, profileCount)).toBe(true);
    expect(isFeedFinished(state.currentProfileIndex - 1, profileCount)).toBe(
      false,
    );
  });
});
