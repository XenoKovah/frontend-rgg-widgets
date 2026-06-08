"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserBadgesUrl = exports.getGammaProfileUrl = void 0;
var _frontendPlatform = require("@edx/frontend-platform");
const getGammaProfileUrl = username => `${(0, _frontendPlatform.getConfig)().LMS_BASE_URL}/gamma_dashboard/api/v0/avatar-progress/${username}/`;
exports.getGammaProfileUrl = getGammaProfileUrl;
const getUserBadgesUrl = username => `${(0, _frontendPlatform.getConfig)().LMS_BASE_URL}/gamma_dashboard/api/v0/user-badges/${username}/`;
exports.getUserBadgesUrl = getUserBadgesUrl;
//# sourceMappingURL=urls.js.map