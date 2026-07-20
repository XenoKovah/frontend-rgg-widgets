"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateLeaderboardOptOut = exports.updateBadgeNotificationsPreference = exports.markBadgeNotificationsSeen = exports.fetchUserLevel = exports.fetchUserBadges = exports.fetchLeaderboardOptOut = exports.fetchGammaProfileData = exports.fetchBadgeNotificationsPreference = exports.fetchBadgeNotifications = exports.BADGE_NOTIFICATIONS_PREFERENCE_KEY = void 0;
var _auth = require("@edx/frontend-platform/auth");
var _urls = require("./urls");
/**
 * Open edX user-preference key for the "badge earned" pop-up opt-out.
 * Must match BADGE_NOTIFICATIONS_PREFERENCE_KEY in edx-gamma-dashboard.
 */
const BADGE_NOTIFICATIONS_PREFERENCE_KEY = exports.BADGE_NOTIFICATIONS_PREFERENCE_KEY = 'rgg_badge_notifications';

/**
 * Fetches profile avatar data from the API.
 *
 * @async
 * @param {string} username - The username of the user.
 * @returns {Promise<object>} The user gamma profile avatar data from the API.
 */
const fetchGammaProfileData = async username => {
  const url = (0, _urls.getGammaProfileUrl)(username);
  const {
    data
  } = await (0, _auth.getAuthenticatedHttpClient)().get(url);
  return data;
};

/**
 * Fetches the badges a user has earned (completed), for their profile page.
 *
 * @async
 * @param {string} username - The username of the profile being viewed.
 * @returns {Promise<Array<{slug: string, title: string, description: string, image: string}>>}
 */
exports.fetchGammaProfileData = fetchGammaProfileData;
const fetchUserBadges = async username => {
  const {
    data
  } = await (0, _auth.getAuthenticatedHttpClient)().get((0, _urls.getUserBadgesUrl)(username));
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
exports.fetchUserBadges = fetchUserBadges;
const fetchUserLevel = async username => {
  const {
    data
  } = await (0, _auth.getAuthenticatedHttpClient)().get((0, _urls.getUserLevelUrl)(username));
  return data;
};

/**
 * Fetches the current user's pending "badge earned" notifications.
 *
 * @async
 * @returns {Promise<{enabled: boolean, notifications: Array<{uuid: string, slug: string,
 *   title: string, description: string, image: string, completed_at: string}>}>}
 */
exports.fetchUserLevel = fetchUserLevel;
const fetchBadgeNotifications = async () => {
  const {
    data
  } = await (0, _auth.getAuthenticatedHttpClient)().get((0, _urls.getBadgeNotificationsUrl)());
  return data;
};

/**
 * Acknowledges shown badge notifications so they are never shown again.
 *
 * @async
 * @param {Array<string>} uuids - Achievement uuids whose toasts were displayed.
 * @returns {Promise<{count: number}>}
 */
exports.fetchBadgeNotifications = fetchBadgeNotifications;
const markBadgeNotificationsSeen = async uuids => {
  const {
    data
  } = await (0, _auth.getAuthenticatedHttpClient)().post((0, _urls.getBadgeNotificationsUrl)(), {
    uuids
  });
  return data;
};

/**
 * Reads whether the user wants "badge earned" pop-ups (default: true when unset).
 *
 * @async
 * @param {string} username - The requesting user's own username.
 * @returns {Promise<boolean>}
 */
exports.markBadgeNotificationsSeen = markBadgeNotificationsSeen;
const fetchBadgeNotificationsPreference = async username => {
  const {
    data
  } = await (0, _auth.getAuthenticatedHttpClient)().get((0, _urls.getUserPreferencesUrl)(username));
  return data?.[BADGE_NOTIFICATIONS_PREFERENCE_KEY] !== 'false';
};

/**
 * Persists the user's "badge earned" pop-up preference.
 *
 * @async
 * @param {string} username - The requesting user's own username.
 * @param {boolean} enabled - Whether pop-ups should be shown.
 */
exports.fetchBadgeNotificationsPreference = fetchBadgeNotificationsPreference;
const updateBadgeNotificationsPreference = async (username, enabled) => {
  await (0, _auth.getAuthenticatedHttpClient)().patch((0, _urls.getUserPreferencesUrl)(username), {
    [BADGE_NOTIFICATIONS_PREFERENCE_KEY]: enabled ? 'true' : 'false'
  }, {
    headers: {
      'Content-Type': 'application/merge-patch+json'
    }
  });
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
exports.updateBadgeNotificationsPreference = updateBadgeNotificationsPreference;
const fetchLeaderboardOptOut = async () => {
  const {
    data
  } = await (0, _auth.getAuthenticatedHttpClient)().get((0, _urls.getLeaderboardOptOutUrl)());
  return Boolean(data?.opted_out);
};

/**
 * Persists the signed-in learner's leaderboard opt-out choice.
 *
 * @async
 * @param {boolean} optedOut - Whether to hide the learner from every leaderboard.
 * @returns {Promise<boolean>} The stored value echoed back by the server.
 */
exports.fetchLeaderboardOptOut = fetchLeaderboardOptOut;
const updateLeaderboardOptOut = async optedOut => {
  const {
    data
  } = await (0, _auth.getAuthenticatedHttpClient)().post((0, _urls.getLeaderboardOptOutUrl)(), {
    opted_out: optedOut
  });
  return Boolean(data?.opted_out);
};
exports.updateLeaderboardOptOut = updateLeaderboardOptOut;
//# sourceMappingURL=api.js.map