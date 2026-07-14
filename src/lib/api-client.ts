import feedResponseFixture from '@/features/feed/fixtures/feed-response-example.json';
import type { FeedResponse } from '@/types/feed';

// Mock client standing in for the real backend: it serves the local fixture
// after an artificial delay so loading states behave like a network fetch.
const NETWORK_DELAY_MS = 500;

export async function fetchFeed(): Promise<FeedResponse> {
  await new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY_MS));
  // No runtime validation by design: the provided types are the contract,
  // and duplicating them (zod or otherwise) is forbidden.
  return feedResponseFixture as FeedResponse;
}
