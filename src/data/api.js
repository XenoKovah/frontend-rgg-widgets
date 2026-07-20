import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import {
  getBadgeNotificationsUrl,
  getGammaProfileUrl,
  getLeaderboardOptOutUrl,
  getUserBadgesUrl,
  getUserLevelUrl,
  getUserPreferencesUrl,
} from './urls';

/**
 * Open edX user-preference key for the "badge earned" pop-up opt-out.
 * Must match BADGE_NOTIFICATIONS_PREFERENCE_KEY in edx-gamma-dashboard.
 */
export const BADGE_NOTIFICATIONS_PREFERENCE_KEY = 'rgg_badge_notifications';

/**
 * Fetches profile avatar data from the API.
 *
 * @async
 * @param {string} username - The username of the user.
 * @returns {Promise<object>} The user gamma profile avatar data from the API.
 */
export const fetchGammaProfileData = async (username) => {
  const url = getGammaProfileUrl(username);

  const { data } = await getAuthenticatedHttpClient().get(url);
  return data;
};

/**
 * Fetches the badges a user has earned (completed), for their profile page.
 *
 * @async
 * @param {string} username - The username of the profile being viewed.
 * @returns {Promise<Array<{slug: string, title: string, description: string, image: string}>>}
 */
export const fetchUserBadges = async (username) => {
  const { data } = await getAuthenticatedHttpClient().get(getUserBadgesUrl(username));
  return data;
};

/**
 * Fetches the R0x0r level a user has reached, for their profile page.
 *
 * `level` is null when the learner has not yet reached the first threshold, and
 * the whole payload is `{}` when the profile is not visible to the requester.
 *
 * @async
 * @param {string} username - The username of the profile being viewed.
 * @returns {Promise<{points?: number, level?: {title: string, slug: string,
 *   image: string, status_points: number}|null}>}
 */
export const fetchUserLevel = async (username) => {
  const { data } = await getAuthenticatedHttpClient().get(getUserLevelUrl(username));
  return data;
};

/**
 * Fetches the current user's pending "badge earned" notifications.
 *
 * @async
 * @returns {Promise<{enabled: boolean, notifications: Array<{uuid: string, slug: string,
 *   title: string, description: string, image: string, completed_at: string}>}>}
 */
export const fetchBadgeNotifications = async () => {
  const { data } = await getAuthenticatedHttpClient().get(getBadgeNotificationsUrl());
  return data;
};

/**
 * Acknowledges shown badge notifications so they are never shown again.
 *
 * @async
 * @param {Array<string>} uuids - Achievement uuids whose toasts were displayed.
 * @returns {Promise<{count: number}>}
 */
export const markBadgeNotificationsSeen = async (uuids) => {
  const { data } = await getAuthenticatedHttpClient().post(getBadgeNotificationsUrl(), { uuids });
  return data;
};

/**
 * Reads whether the user wants "badge earned" pop-ups (default: true when unset).
 *
 * @async
 * @param {string} username - The requesting user's own username.
 * @returns {Promise<boolean>}
 */
export const fetchBadgeNotificationsPreference = async (username) => {
  const { data } = await getAuthenticatedHttpClient().get(getUserPreferencesUrl(username));
  return data?.[BADGE_NOTIFICATIONS_PREFERENCE_KEY] !== 'false';
};

/**
 * Persists the user's "badge earned" pop-up preference.
 *
 * @async
 * @param {string} username - The requesting user's own username.
 * @param {boolean} enabled - Whether pop-ups should be shown.
 */
export const updateBadgeNotificationsPreference = async (username, enabled) => {
  await getAuthenticatedHttpClient().patch(
    getUserPreferencesUrl(username),
    { [BADGE_NOTIFICATIONS_PREFERENCE_KEY]: enabled ? 'true' : 'false' },
    { headers: { 'Content-Type': 'application/merge-patch+json' } },
  );
};

/**
 * Reads whether the signed-in learner has opted out of leaderboard ranking.
 *
 * Backed by the dashboard endpoint (Gamma is the source of truth), not a user
 * preference. Returns false (not opted out) when unset.
 *
 * @async
 * @returns {Promise<boolean>}
 */
export const fetchLeaderboardOptOut = async () => {
  const { data } = await getAuthenticatedHttpClient().get(getLeaderboardOptOutUrl());
  return Boolean(data?.opted_out);
};

/**
 * Persists the signed-in learner's leaderboard opt-out choice.
 *
 * @async
 * @param {boolean} optedOut - Whether to hide the learner from every leaderboard.
 * @returns {Promise<boolean>} The stored value echoed back by the server.
 */
export const updateLeaderboardOptOut = async (optedOut) => {
  const { data } = await getAuthenticatedHttpClient().post(
    getLeaderboardOptOutUrl(),
    { opted_out: optedOut },
  );
  return Boolean(data?.opted_out);
};
