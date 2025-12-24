"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LearningHeaderUserMenuItems = exports.HeaderUserMenuItems = void 0;
var _frontendPlatform = require("@edx/frontend-platform");
var _auth = require("@edx/frontend-platform/auth");
var _messages = _interopRequireDefault(require("./messages"));
var _i18n = require("@edx/frontend-platform/i18n");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const HeaderUserMenuItems = widget => {
  const intl = (0, _i18n.useIntl)();
  const {
    administrator
  } = (0, _auth.getAuthenticatedUser)();
  const items = [{
    type: 'item',
    href: `${(0, _frontendPlatform.getConfig)().LMS_BASE_URL}/gamma_dashboard/dashboard/`,
    content: intl.formatMessage(_messages.default['rgg.avatar.header.user.dropdown.performance.link'])
  }, {
    type: 'item',
    href: `${(0, _frontendPlatform.getConfig)().LMS_BASE_URL}/gamma_dashboard/leaderboard/`,
    content: intl.formatMessage(_messages.default['rgg.avatar.header.user.dropdown.leaderboard.link'])
  }];
  if (administrator) {
    items.push({
      type: 'item',
      href: `${(0, _frontendPlatform.getConfig)().GAMMA_SETTINGS_URL}`,
      content: intl.formatMessage(_messages.default['rgg.avatar.header.user.dropdown.gamification-settings.link'])
    });
  }
  widget.content.menu = [{
    items
  }, ...widget.RenderWidget.props.menu];
  return widget;
};
exports.HeaderUserMenuItems = HeaderUserMenuItems;
const LearningHeaderUserMenuItems = widget => {
  const intl = (0, _i18n.useIntl)();
  const {
    administrator
  } = (0, _auth.getAuthenticatedUser)();
  const items = [{
    href: `${(0, _frontendPlatform.getConfig)().LMS_BASE_URL}/gamma_dashboard/dashboard/`,
    content: intl.formatMessage(_messages.default['rgg.avatar.header.user.dropdown.performance.link'])
  }, {
    href: `${(0, _frontendPlatform.getConfig)().LMS_BASE_URL}/gamma_dashboard/leaderboard/`,
    content: intl.formatMessage(_messages.default['rgg.avatar.header.user.dropdown.leaderboard.link'])
  }];
  if (administrator) {
    items.push({
      href: `${(0, _frontendPlatform.getConfig)().GAMMA_SETTINGS_URL}`,
      content: intl.formatMessage(_messages.default['rgg.avatar.header.user.dropdown.gamification-settings.link'])
    });
  }
  widget.content.items = [...items, ...widget.RenderWidget.props.items];
  return widget;
};
exports.LearningHeaderUserMenuItems = LearningHeaderUserMenuItems;
//# sourceMappingURL=index.js.map