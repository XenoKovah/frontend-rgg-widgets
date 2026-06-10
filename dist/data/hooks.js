"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useUserBadges = exports.useUpdateBadgeNotificationsPreference = exports.useMarkBadgeNotificationsSeen = exports.useGammaProfileData = exports.useBadgeNotificationsPreference = exports.useBadgeNotifications = exports.retryFn = exports.BADGE_NOTIFICATIONS_POLL_INTERVAL_MS = void 0;
var _reactQuery = require("@tanstack/react-query");
var _api = require("./api");
/**
 * How often the BadgeNotifications widget asks the LMS for newly earned badges.
 * The award pipeline itself is asynchronous (celery), so sub-minute precision
 * buys nothing; this keeps the polling load negligible.
 */
const BADGE_NOTIFICATIONS_POLL_INTERVAL_MS = exports.BADGE_NOTIFICATIONS_POLL_INTERVAL_MS = 45 * 1000;
const retryFn = (failureCount, error) => {
  if (error?.response?.status === 404 || error?.status === 404) {
    return false;
  }
  return failureCount < 2;
};
exports.retryFn = retryFn;
const useGammaProfileData = username => (0, _reactQuery.useQuery)({
  queryKey: ['gammaProfile'],
  queryFn: () => (0, _api.fetchGammaProfileData)(username),
  placeholderData: previousData => previousData,
  retry: retryFn
});
exports.useGammaProfileData = useGammaProfileData;
const useUserBadges = username => (0, _reactQuery.useQuery)({
  // Key by username: unlike the current-user profile data, this is fetched for
  // whichever profile is being viewed, so the cache must not bleed across users.
  queryKey: ['userBadges', username],
  queryFn: () => (0, _api.fetchUserBadges)(username),
  enabled: Boolean(username),
  retry: retryFn
});
exports.useUserBadges = useUserBadges;
const useBadgeNotifications = enabled => (0, _reactQuery.useQuery)({
  queryKey: ['badgeNotifications'],
  queryFn: _api.fetchBadgeNotifications,
  enabled,
  // Stop polling for users who opted out (in Account Settings) — one request per
  // page load is enough to learn that. refetchOnWindowFocus stays on (provider
  // default), so returning to a long-lived tab checks immediately.
  refetchInterval: data => data?.enabled === false ? false : BADGE_NOTIFICATIONS_POLL_INTERVAL_MS,
  retry: retryFn
});
exports.useBadgeNotifications = useBadgeNotifications;
const useMarkBadgeNotificationsSeen = () => (0, _reactQuery.useMutation)({
  mutationFn: _api.markBadgeNotificationsSeen
});
exports.useMarkBadgeNotificationsSeen = useMarkBadgeNotificationsSeen;
const useBadgeNotificationsPreference = username => (0, _reactQuery.useQuery)({
  queryKey: ['badgeNotificationsPreference', username],
  queryFn: () => (0, _api.fetchBadgeNotificationsPreference)(username),
  enabled: Boolean(username),
  retry: retryFn
});
exports.useBadgeNotificationsPreference = useBadgeNotificationsPreference;
const useUpdateBadgeNotificationsPreference = username => {
  const queryClient = (0, _reactQuery.useQueryClient)();
  return (0, _reactQuery.useMutation)({
    mutationFn: enabled => (0, _api.updateBadgeNotificationsPreference)(username, enabled),
    // Optimistic flip so the switch feels instant; reconcile with the server after.
    onMutate: async enabled => {
      await queryClient.cancelQueries({
        queryKey: ['badgeNotificationsPreference', username]
      });
      const previous = queryClient.getQueryData(['badgeNotificationsPreference', username]);
      queryClient.setQueryData(['badgeNotificationsPreference', username], enabled);
      return {
        previous
      };
    },
    onError: (_error, _enabled, context) => {
      queryClient.setQueryData(['badgeNotificationsPreference', username], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['badgeNotificationsPreference', username]
      });
    }
  });
};
exports.useUpdateBadgeNotificationsPreference = useUpdateBadgeNotificationsPreference;
//# sourceMappingURL=hooks.js.map