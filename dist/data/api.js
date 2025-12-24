"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchGammaProfileData = void 0;
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
exports.fetchGammaProfileData = fetchGammaProfileData;
//# sourceMappingURL=api.js.map