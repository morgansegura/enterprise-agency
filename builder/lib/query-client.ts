import { QueryClient, DefaultOptions } from "@tanstack/react-query";
import { logger } from "./logger";

const queryConfig: DefaultOptions = {
  queries: {
    // Stale time: how long data is considered fresh
    staleTime: 60 * 1000, // 1 minute
    // Cache time: how long unused data stays in cache
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
    // Retry logic
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Refetch settings
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
  },
  mutations: {
    // Global mutation error handler
    onError: (error: any) => {
      logger.error("Mutation error", error, {
        status: error?.response?.status,
        message: error?.message,
      });
    },
  },
};

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: queryConfig,
  });
}
