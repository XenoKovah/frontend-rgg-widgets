"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _i18n = require("@edx/frontend-platform/i18n");
var _auth = require("@edx/frontend-platform/auth");
var _paragon = require("@openedx/paragon");
var _hooks = require("../../data/hooks");
var _messages = _interopRequireDefault(require("./messages"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Account Settings switch controlling the "badge earned" pop-ups, persisted as
 * the `rgg_badge_notifications` Open edX user preference (unset means enabled).
 *
 * Rendered through the account MFE's gamification-preferences plugin slot as its
 * own small section, matching the page's section layout.
 */const BadgeNotificationsToggle = () => {
  const intl = (0, _i18n.useIntl)();
  const authenticatedUser = (0, _auth.getAuthenticatedUser)();
  const username = authenticatedUser?.username;
  const {
    data: enabled,
    isLoading
  } = (0, _hooks.useBadgeNotificationsPreference)(username);
  const {
    mutate: updatePreference
  } = (0, _hooks.useUpdateBadgeNotificationsPreference)(username);
  if (!username) {
    return null;
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    className: "account-section pt-3 mb-5",
    id: "rgg-gamification-settings",
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("h2", {
      className: "section-heading h4 mb-3",
      children: intl.formatMessage(_messages.default['rgg.badge.notifications.toggle.heading'])
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_paragon.Form.Switch, {
      checked: Boolean(enabled),
      disabled: isLoading,
      onChange: event => updatePreference(event.target.checked),
      helperText: intl.formatMessage(_messages.default['rgg.badge.notifications.toggle.description']),
      "data-testid": "rgg-badge-notifications-toggle",
      children: intl.formatMessage(_messages.default['rgg.badge.notifications.toggle.label'])
    })]
  });
};
var _default = exports.default = BadgeNotificationsToggle;
//# sourceMappingURL=BadgeNotificationsToggle.js.map