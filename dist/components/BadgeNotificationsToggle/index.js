"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactQuery = require("@tanstack/react-query");
var _BadgeNotificationsToggle = _interopRequireDefault(require("./BadgeNotificationsToggle"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const queryClient = new _reactQuery.QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});
const BadgeNotificationsToggleWithProvider = () => /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactQuery.QueryClientProvider, {
  client: queryClient,
  children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_BadgeNotificationsToggle.default, {})
});
var _default = exports.default = BadgeNotificationsToggleWithProvider;
//# sourceMappingURL=index.js.map