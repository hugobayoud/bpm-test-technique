import { useQuery } from '@tanstack/react-query';

import { fetchFeed } from '@/lib/api-client';

// Backend seam: when a real endpoint exists, only fetchFeed's implementation
// changes — keys and hook signature stay.
export const feedKeys = {
  all: ['feed'] as const,
};

export function useFeed() {
  return useQuery({
    queryKey: feedKeys.all,
    queryFn: fetchFeed,
  });
}
