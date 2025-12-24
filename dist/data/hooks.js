"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGammaProfileData = exports.retryFn = void 0;
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
//# sourceMappingURL=hooks.js.map