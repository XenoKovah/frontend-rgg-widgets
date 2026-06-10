"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LearningHeaderUserMenuItems = exports.HeaderUserMenuItems = void 0;
var _frontendPlatform = require("@edx/frontend-platform");
var _auth = require("@edx/frontend-platform/auth");
var _i18n = require("@edx/frontend-platform/i18n");
var _messages = _interopRequireDefault(require("./messages"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// Relabel a few stock Open edX header user-menu items (contributed by the platform
// header, not by RGG) to course-specific wording. Keyed by the platform's English
// label; any item whose label isn't listed is passed through unchanged.
const PLATFORM_MENU_RENAMES = {
  Profile: 'Public Profile',
  Account: 'Account Settings'
};

// Stock header items OST2 hides so every user menu matches the learner-dashboard
// MFE's (Your Badges / Leaderboard / Public Profile / Account Settings / Sign Out):
// the course-list links ("My Courses"/"Dashboard" -> /dashboard) and course
// discovery ("Discover" -> /courses). Matched by href rather than label so
// renames elsewhere can't bring them back.
const HIDDEN_PLATFORM_MENU_PATHS = ['/dashboard', '/courses'];
const isHiddenPlatformItem = item => {
  if (!item || typeof item.href !== 'string') {
    return false;
  }
  const lmsBaseUrl = (0, _frontendPlatform.getConfig)().LMS_BASE_URL || '';
  return HIDDEN_PLATFORM_MENU_PATHS.some(path => item.href === `${lmsBaseUrl}${path}` || item.href === path);
};

// Return a copy of a menu item with its label(s) renamed per PLATFORM_MENU_RENAMES,
// or the original item if nothing matches. Handles both `content` (Header component)
// and `message` (default LearningHeader).
const relabelMenuItem = item => {
  if (!item || typeof item !== 'object') {
    return item;
  }
  let updated = item;
  ['content', 'message'].forEach(key => {
    const rename = typeof item[key] === 'string' ? PLATFORM_MENU_RENAMES[item[key]] : undefined;
    if (rename) {
      updated = _objectSpread(_objectSpread({}, updated), {}, {
        [key]: rename
      });
    }
  });
  return updated;
};
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
  const platformMenu = (widget.RenderWidget.props.menu || []).map(group => group && Array.isArray(group.items) ? _objectSpread(_objectSpread({}, group), {}, {
    items: group.items.filter(item => !isHiddenPlatformItem(item)).map(relabelMenuItem)
  }) : group);

  // eslint-disable-next-line no-param-reassign
  widget.content.menu = [{
    items
  }, ...platformMenu];
  return widget;
};
exports.HeaderUserMenuItems = HeaderUserMenuItems;
const LearningHeaderUserMenuItems = widget => {
  const intl = (0, _i18n.useIntl)();
  const {
    administrator
  } = (0, _auth.getAuthenticatedUser)();

  // MFE Learning currently supports two header implementations:
  // - `content` → used by the Header component
  // - `message` → used by the default LearningHeader
  // Both fields are required for compatibility.
  const items = [{
    href: `${(0, _frontendPlatform.getConfig)().LMS_BASE_URL}/gamma_dashboard/dashboard/`,
    content: intl.formatMessage(_messages.default['rgg.avatar.header.user.dropdown.performance.link']),
    message: intl.formatMessage(_messages.default['rgg.avatar.header.user.dropdown.performance.link'])
  }, {
    href: `${(0, _frontendPlatform.getConfig)().LMS_BASE_URL}/gamma_dashboard/leaderboard/`,
    content: intl.formatMessage(_messages.default['rgg.avatar.header.user.dropdown.leaderboard.link']),
    message: intl.formatMessage(_messages.default['rgg.avatar.header.user.dropdown.leaderboard.link'])
  }];
  if (administrator) {
    items.push({
      href: `${(0, _frontendPlatform.getConfig)().GAMMA_SETTINGS_URL}`,
      content: intl.formatMessage(_messages.default['rgg.avatar.header.user.dropdown.gamification-settings.link']),
      message: intl.formatMessage(_messages.default['rgg.avatar.header.user.dropdown.gamification-settings.link'])
    });
  }

  // eslint-disable-next-line no-param-reassign
  widget.content.items = [...items, ...(widget.RenderWidget.props.items || []).filter(item => !isHiddenPlatformItem(item)).map(relabelMenuItem)];
  return widget;
};
exports.LearningHeaderUserMenuItems = LearningHeaderUserMenuItems;
//# sourceMappingURL=index.js.map