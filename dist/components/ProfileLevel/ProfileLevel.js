"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _i18n = require("@edx/frontend-platform/i18n");
var _paragon = require("@openedx/paragon");
var _hooks = require("../../data/hooks");
var _viewedProfile = require("../../utils/viewedProfile");
var _messages = _interopRequireDefault(require("./messages"));
require("./index.scss");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Renders the viewed user's R0x0r level -- the level art, its name and their point
 * total -- in the Profile page's left column, above "Earned Accomplishments".
 *
 * The backend enforces profile visibility and answers `{}` when the requester may
 * not see the profile, and `level: null` for a learner who has not yet reached the
 * first threshold; both mean there is nothing to show, so the widget renders
 * nothing rather than an empty box.
 */const ProfileLevel = () => {
  const intl = (0, _i18n.useIntl)();
  const username = (0, _viewedProfile.getViewedUsername)();
  const {
    data,
    isLoading,
    isError
  } = (0, _hooks.useUserLevel)(username);
  const level = data?.level;
  if (isLoading || isError || !level) {
    return null;
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    className: "rgg-profile-level mb-4",
    "data-testid": "rgg-profile-level",
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("h2", {
      className: "h5 mb-3",
      children: intl.formatMessage(_messages.default['rgg.profile.level.heading'])
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: "rgg-profile-level-body d-flex align-items-center",
      children: [level.image &&
      /*#__PURE__*/
      // The same art the dashboard ladder shows for this level. Marked
      // decorative: the level name sits right beside it as real text, so
      // announcing the image too would just repeat it.
      (0, _jsxRuntime.jsx)(_paragon.Image, {
        className: "rgg-profile-level-image flex-shrink-0 mr-3",
        src: level.image,
        alt: "",
        "aria-hidden": "true"
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: "rgg-profile-level-info",
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
          className: "rgg-profile-level-title font-weight-bold",
          children: level.title
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
          className: "rgg-profile-level-points small text-gray-600",
          children: intl.formatMessage(_messages.default['rgg.profile.level.points'], {
            points: data.points || 0
          })
        })]
      })]
    })]
  });
};
var _default = exports.default = ProfileLevel;
//# sourceMappingURL=ProfileLevel.js.map