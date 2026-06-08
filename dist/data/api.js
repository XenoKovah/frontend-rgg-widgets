"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchUserBadges = exports.fetchGammaProfileData = void 0;
var _auth = require("@edx/frontend-platform/auth");
var _urls = require("./urls");
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
 * @returns {Promise<Array<{title: string, description: string, image: string}>>}
 */
exports.fetchGammaProfileData = fetchGammaProfileData;
const fetchUserBadges = async username => {
  const {
    data
  } = await (0, _auth.getAuthenticatedHttpClient)().get((0, _urls.getUserBadgesUrl)(username));
  return data;
};
exports.fetchUserBadges = fetchUserBadges;
//# sourceMappingURL=api.js.map