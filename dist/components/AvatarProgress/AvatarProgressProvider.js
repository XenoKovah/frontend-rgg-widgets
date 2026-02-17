"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactQuery = require("@tanstack/react-query");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const queryClient = new _reactQuery.QueryClient();
const AvatarProgressProvider = ({
  children
}) => /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactQuery.QueryClientProvider, {
  client: queryClient,
  children: children
});
AvatarProgressProvider.propTypes = {
  children: _propTypes.default.node.isRequired
};
var _default = exports.default = AvatarProgressProvider;
//# sourceMappingURL=AvatarProgressProvider.js.map