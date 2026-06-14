import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  fetchBadgeNotifications,
  fetchBadgeNotificationsPreference,
  fetchGammaProfileData,
  fetchLeaderboardOptOut,
  fetchUserBadges,
  markBadgeNotificationsSeen,
  updateBadgeNotificationsPreference,
  updateLeaderboardOptOut,
} from './api';

/**
 * How often the BadgeNotifications widget asks the LMS for newly earned badges.
 * The award pipeline itself is asynchronous (celery), so sub-minute precision
 * buys nothing; this keeps the polling load negligible.
 */
export const BADGE_NOTIFICATIONS_POLL_INTERVAL_MS = 45 * 1000;

export const retryFn = (failureCount, error) => {
  if (error?.response?.status === 404 || error?.status === 404) {
    return false;
  }
  return failureCount < 2;
};

export const useGammaProfileData = (username) => (
  useQuery({
    queryKey: ['gammaProfile'],
    queryFn: () => fetchGammaProfileData(username),
    placeholderData: (previousData) => previousData,
    retry: retryFn,
  })
);

export const useUserBadges = (username) => (
  useQuery({
    // Key by username: unlike the current-user profile data, this is fetched for
    // whichever profile is being viewed, so the cache must not bleed across users.
    queryKey: ['userBadges', username],
    queryFn: () => fetchUserBadges(username),
    enabled: Boolean(username),
    retry: retryFn,
    // The API returns badges in award order; show the collection alphabetically.
    select: (badges) => [...(badges || [])].sort(
      (a, b) => (a.title || '').localeCompare(b.title || '', undefined, { sensitivity: 'base' }),
    ),
  })
);

export const useBadgeNotifications = (enabled) => (
  useQuery({
    queryKey: ['badgeNotifications'],
    queryFn: fetchBadgeNotifications,
    enabled,
    // Stop polling for users who opted out (in Account Settings) — one request per
    // page load is enough to learn that. refetchOnWindowFocus stays on (provider
    // default), so returning to a long-lived tab checks immediately.
    refetchInterval: (data) => (data?.enabled === false ? false : BADGE_NOTIFICATIONS_POLL_INTERVAL_MS),
    retry: retryFn,
  })
);

export const useMarkBadgeNotificationsSeen = () => (
  useMutation({
    mutationFn: markBadgeNotificationsSeen,
  })
);

export const useBadgeNotificationsPreference = (username) => (
  useQuery({
    queryKey: ['badgeNotificationsPreference', username],
    queryFn: () => fetchBadgeNotificationsPreference(username),
    enabled: Boolean(username),
    retry: retryFn,
  })
);

export const useUpdateBadgeNotificationsPreference = (username) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (enabled) => updateBadgeNotificationsPreference(username, enabled),
    // Optimistic flip so the switch feels instant; reconcile with the server after.
    onMutate: async (enabled) => {
      await queryClient.cancelQueries({ queryKey: ['badgeNotificationsPreference', username] });
      const previous = queryClient.getQueryData(['badgeNotificationsPreference', username]);
      queryClient.setQueryData(['badgeNotificationsPreference', username], enabled);
      return { previous };
    },
    onError: (_error, _enabled, context) => {
      queryClient.setQueryData(['badgeNotificationsPreference', username], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['badgeNotificationsPreference', username] });
    },
  });
};

export const useLeaderboardOptOut = (username) => (
  useQuery({
    queryKey: ['leaderboardOptOut', username],
    queryFn: fetchLeaderboardOptOut,
    enabled: Boolean(username),
    retry: retryFn,
  })
);

export const useUpdateLeaderboardOptOut = (username) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (optedOut) => updateLeaderboardOptOut(optedOut),
    // Optimistic flip so the switch feels instant; reconcile with the server after.
    onMutate: async (optedOut) => {
      await queryClient.cancelQueries({ queryKey: ['leaderboardOptOut', username] });
      const previous = queryClient.getQueryData(['leaderboardOptOut', username]);
      queryClient.setQueryData(['leaderboardOptOut', username], optedOut);
      return { previous };
    },
    onError: (_error, _optedOut, context) => {
      queryClient.setQueryData(['leaderboardOptOut', username], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['leaderboardOptOut', username] });
    },
  });
};
