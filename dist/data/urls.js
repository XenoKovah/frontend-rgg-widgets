"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserPreferencesUrl = exports.getUserLevelUrl = exports.getUserBadgesUrl = exports.getLeaderboardOptOutUrl = exports.getGammaProfileUrl = exports.getGammaDashboardUrl = exports.getBadgeNotificationsUrl = exports.getBadgeLeaderboardUrl = void 0;
var _frontendPlatform = require("@edx/frontend-platform");
const getGammaProfileUrl = username => `${(0, _frontendPlatform.getConfig)().LMS_BASE_URL}/gamma_dashboard/api/v0/avatar-progress/${username}/`;
exports.getGammaProfileUrl = getGammaProfileUrl;
const getUserBadgesUrl = username => `${(0, _frontendPlatform.getConfig)().LMS_BASE_URL}/gamma_dashboard/api/v0/user-badges/${username}/`;
exports.getUserBadgesUrl = getUserBadgesUrl;
const getUserLevelUrl = username => `${(0, _frontendPlatform.getConfig)().LMS_BASE_URL}/gamma_dashboard/api/v0/user-level/${username}/`;
exports.getUserLevelUrl = getUserLevelUrl;
const getBadgeLeaderboardUrl = slug => `${(0, _frontendPlatform.getConfig)().LMS_BASE_URL}/gamma_dashboard/leaderboard/badge/${slug}`;
exports.getBadgeLeaderboardUrl = getBadgeLeaderboardUrl;
const getBadgeNotificationsUrl = () => `${(0, _frontendPlatform.getConfig)().LMS_BASE_URL}/gamma_dashboard/api/v0/badge-notifications/`;
exports.getBadgeNotificationsUrl = getBadgeNotificationsUrl;
const getLeaderboardOptOutUrl = () => `${(0, _frontendPlatform.getConfig)().LMS_BASE_URL}/gamma_dashboard/api/v0/leaderboard-opt-out/`;
exports.getLeaderboardOptOutUrl = getLeaderboardOptOutUrl;
const getUserPreferencesUrl = username => `${(0, _frontendPlatform.getConfig)().LMS_BASE_URL}/api/user/v1/preferences/${username}`;
exports.getUserPreferencesUrl = getUserPreferencesUrl;
const getGammaDashboardUrl = () => `${(0, _frontendPlatform.getConfig)().LMS_BASE_URL}/gamma_dashboard/dashboard/`;
exports.getGammaDashboardUrl = getGammaDashboardUrl;
//# sourceMappingURL=urls.js.map