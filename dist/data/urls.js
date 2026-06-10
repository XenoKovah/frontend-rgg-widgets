"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserProfileUrl = exports.getUserPreferencesUrl = exports.getUserBadgesUrl = exports.getGammaProfileUrl = exports.getBadgeNotificationsUrl = exports.getBadgeLeaderboardUrl = void 0;
var _frontendPlatform = require("@edx/frontend-platform");
const getGammaProfileUrl = username => `${(0, _frontendPlatform.getConfig)().LMS_BASE_URL}/gamma_dashboard/api/v0/avatar-progress/${username}/`;
exports.getGammaProfileUrl = getGammaProfileUrl;
const getUserBadgesUrl = username => `${(0, _frontendPlatform.getConfig)().LMS_BASE_URL}/gamma_dashboard/api/v0/user-badges/${username}/`;
exports.getUserBadgesUrl = getUserBadgesUrl;
const getBadgeLeaderboardUrl = slug => `${(0, _frontendPlatform.getConfig)().LMS_BASE_URL}/gamma_dashboard/leaderboard/badge/${slug}`;
exports.getBadgeLeaderboardUrl = getBadgeLeaderboardUrl;
const getBadgeNotificationsUrl = () => `${(0, _frontendPlatform.getConfig)().LMS_BASE_URL}/gamma_dashboard/api/v0/badge-notifications/`;
exports.getBadgeNotificationsUrl = getBadgeNotificationsUrl;
const getUserPreferencesUrl = username => `${(0, _frontendPlatform.getConfig)().LMS_BASE_URL}/api/user/v1/preferences/${username}`;
exports.getUserPreferencesUrl = getUserPreferencesUrl;
const getUserProfileUrl = username => `${(0, _frontendPlatform.getConfig)().LMS_BASE_URL}/u/${username}`;
exports.getUserProfileUrl = getUserProfileUrl;
//# sourceMappingURL=urls.js.map