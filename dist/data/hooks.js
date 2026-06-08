"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useUserBadges = exports.useGammaProfileData = exports.retryFn = void 0;
var _reactQuery = require("@tanstack/react-query");
var _api = require("./api");
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
//# sourceMappingURL=hooks.js.map