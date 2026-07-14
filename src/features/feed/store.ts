import { create } from 'zustand';

// Transient reaction: set by likeCard/passProfile, cleared by advance. The
// reaction overlay animates it between those two moments.
export type FeedReaction = 'like' | 'pass';

type FeedStore = {
  currentProfileIndex: number;
  likedCardIds: string[];
  passedProfileIds: string[];
  reaction: FeedReaction | null;
  likeCard: (cardId: string) => void;
  passProfile: (profileId: string) => void;
  advance: () => void;
  restart: () => void;
};

const INITIAL_STATE = {
  currentProfileIndex: 0,
  likedCardIds: [],
  passedProfileIds: [],
  reaction: null,
} satisfies Omit<FeedStore, 'likeCard' | 'passProfile' | 'advance' | 'restart'>;

// Genuine client state only (feed progression) — the profiles themselves stay
// in TanStack Query. In-memory by design: no persistence.
export const useFeedStore = create<FeedStore>()((set) => ({
  ...INITIAL_STATE,
  // Both reactions are no-ops while one is already pending: a rapid
  // double-tap must record and advance exactly one profile.
  likeCard: (cardId) =>
    set((state) =>
      state.reaction
        ? state
        : {
            likedCardIds: [...state.likedCardIds, cardId],
            reaction: 'like',
          },
    ),
  passProfile: (profileId) =>
    set((state) =>
      state.reaction
        ? state
        : {
            passedProfileIds: [...state.passedProfileIds, profileId],
            reaction: 'pass',
          },
    ),
  advance: () =>
    set((state) => ({
      currentProfileIndex: state.currentProfileIndex + 1,
      reaction: null,
    })),
  restart: () => set(INITIAL_STATE),
}));

// Finished = index past the last profile.
export function isFeedFinished(
  currentProfileIndex: number,
  profileCount: number,
): boolean {
  return currentProfileIndex >= profileCount;
}
