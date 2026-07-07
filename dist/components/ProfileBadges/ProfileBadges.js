"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _i18n = require("@edx/frontend-platform/i18n");
var _paragon = require("@openedx/paragon");
var _hooks = require("../../data/hooks");
var _urls = require("../../data/urls");
var _sanitizeHtml = require("../../utils/sanitizeHtml");
var _messages = _interopRequireDefault(require("./messages"));
require("./index.scss");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Extract the viewed user's username from the profile URL (`/profile/u/<username>`).
 *
 * Read from the path rather than react-router's `useParams` so the widget does not
 * depend on sharing a react-router context with the host MFE: it is bundled
 * separately and may not see the MFE's Router provider.
 *
 * @returns {string} the viewed username, or '' if it can't be determined.
 */const getViewedUsername = () => {
  const match = window.location.pathname.match(/\/u\/([^/?#]+)/);
  return match ? decodeURIComponent(match[1]) : '';
};

/**
 * Renders the list of badges the viewed user has earned, in the Profile page's
 * left column (under "Social Links"). The backend returns only completed badges
 * and already enforces profile visibility, so this widget simply renders nothing
 * when there is nothing to show.
 */
const ProfileBadges = () => {
  const intl = (0, _i18n.useIntl)();
  const username = getViewedUsername();
  const {
    data: badges = [],
    isLoading,
    isError
  } = (0, _hooks.useUserBadges)(username);
  if (isLoading || isError || badges.length === 0) {
    return null;
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    className: "rgg-profile-badges mb-4",
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("h2", {
      className: "h5 mb-3",
      children: intl.formatMessage(_messages.default['rgg.profile.badges.heading'])
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("ul", {
      className: "list-unstyled m-0",
      children: badges.map(badge => /*#__PURE__*/(0, _jsxRuntime.jsxs)("li", {
        className: "rgg-profile-badge d-flex align-items-start mb-3",
        "data-testid": "rgg-profile-badge",
        children: [badge.image &&
        /*#__PURE__*/
        // The image links to the per-badge leaderboard like the title, but is
        // hidden from assistive tech and the tab order so it is not a duplicate
        // of the title link to the same destination.
        (0, _jsxRuntime.jsx)(_paragon.Hyperlink, {
          destination: (0, _urls.getBadgeLeaderboardUrl)(badge.slug),
          className: "rgg-profile-badge-image-link flex-shrink-0 mr-3",
          tabIndex: -1,
          "aria-hidden": "true",
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_paragon.Image, {
            className: "rgg-profile-badge-image",
            src: badge.image,
            alt: badge.title
          })
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          className: "rgg-profile-badge-info",
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_paragon.Hyperlink, {
            destination: (0, _urls.getBadgeLeaderboardUrl)(badge.slug),
            className: "rgg-profile-badge-link rgg-profile-badge-title font-weight-bold text-reset text-decoration-none",
            children: badge.title
          }), badge.description &&
          /*#__PURE__*/
          // Rendered as sanitized HTML (not plain text) so a description may
          // link the course name to its class page. Kept OUTSIDE the badge's
          // leaderboard link above to avoid an invalid nested anchor. See
          // sanitizeDescriptionHtml.
          (0, _jsxRuntime.jsx)("div", {
            className: "rgg-profile-badge-description small text-gray-600"
            // eslint-disable-next-line react/no-danger
            ,
            dangerouslySetInnerHTML: {
              __html: (0, _sanitizeHtml.sanitizeDescriptionHtml)(badge.description)
            }
          })]
        })]
      }, badge.title))
    })]
  });
};
var _default = exports.default = ProfileBadges;
//# sourceMappingURL=ProfileBadges.js.map