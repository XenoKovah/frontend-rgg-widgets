"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCookieDomain = void 0;
var _frontendPlatform = require("@edx/frontend-platform");
var _logging = require("@edx/frontend-platform/logging");
/**
 * Extracts the hostname from LMS_BASE_URL to use as the cookie domain.
 * This allows the cookie to be shared across subdomains (e.g. profile.example.io, learning.example.io).
 * @returns {string} The hostname or empty string if unavailable.
 */
const getCookieDomain = () => {
  try {
    return new URL((0, _frontendPlatform.getConfig)().LMS_BASE_URL).hostname;
  } catch (error) {
    (0, _logging.logError)('Failed to extract cookie domain from LMS_BASE_URL', error);
    return '';
  }
};
exports.getCookieDomain = getCookieDomain;
//# sourceMappingURL=utils.js.map