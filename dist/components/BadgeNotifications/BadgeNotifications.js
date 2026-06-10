"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.TOAST_DELAY_MS = void 0;
var _react = _interopRequireWildcard(require("react"));
var _i18n = require("@edx/frontend-platform/i18n");
var _auth = require("@edx/frontend-platform/auth");
var _paragon = require("@openedx/paragon");
var _hooks = require("../../data/hooks");
var _urls = require("../../data/urls");
var _messages = _interopRequireDefault(require("./messages"));
require("./index.scss");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 * How long each badge toast stays on screen. Paragon pauses the timer while the
 * toast is hovered or focused, so this is a floor, not a hard limit.
 */
const TOAST_DELAY_MS = exports.TOAST_DELAY_MS = 8 * 1000;

/**
 * Polls the LMS for badges the user earned but has not been congratulated for
 * yet, and shows them one at a time as a Paragon Toast ("You earned a badge!").
 *
 * Mounted on every RGG-enabled MFE page (alongside the footer), so the pop-up
 * appears wherever the learner happens to be when a badge completes — courseware,
 * dashboard, discussions, or the profile page they are editing. Each toast is
 * acknowledged to the backend when displayed, so it is shown only once across
 * pages, tabs, and devices. Users can turn these off in Account Settings, which
 * the backend honors by reporting `enabled: false` (polling then stops).
 */
const BadgeNotifications = () => {
  const intl = (0, _i18n.useIntl)();
  const authenticatedUser = (0, _auth.getAuthenticatedUser)();
  const {
    data
  } = (0, _hooks.useBadgeNotifications)(Boolean(authenticatedUser));
  const [queue, setQueue] = (0, _react.useState)([]);
  // Session-level dedupe: uuids ever enqueued by this mount. Keeps repeat poll
  // responses (or a failed acknowledgement) from re-queueing the same badge.
  const enqueuedUuidsRef = (0, _react.useRef)(new Set());
  const {
    mutate: markSeen
  } = (0, _hooks.useMarkBadgeNotificationsSeen)();
  (0, _react.useEffect)(() => {
    if (!data?.enabled || !data.notifications?.length) {
      return;
    }
    const fresh = data.notifications.filter(notification => notification.uuid && !enqueuedUuidsRef.current.has(notification.uuid));
    if (!fresh.length) {
      return;
    }
    fresh.forEach(notification => enqueuedUuidsRef.current.add(notification.uuid));
    setQueue(previous => [...previous, ...fresh]);
  }, [data]);
  const current = queue[0] || null;
  const currentUuid = current?.uuid;

  // Acknowledge each toast as it is displayed (not when it closes), so a
  // navigation mid-toast cannot replay the whole queue on the next page.
  (0, _react.useEffect)(() => {
    if (currentUuid) {
      markSeen([currentUuid]);
    }
  }, [currentUuid, markSeen]);
  if (!authenticatedUser || !current) {
    return null;
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_paragon.Toast, {
    show: true,
    onClose: () => setQueue(previous => previous.slice(1)),
    delay: TOAST_DELAY_MS,
    className: "rgg-badge-notification-toast",
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: "d-flex align-items-center",
      "data-testid": "rgg-badge-notification",
      children: [current.image && /*#__PURE__*/(0, _jsxRuntime.jsx)(_paragon.Image, {
        src: current.image,
        alt: "",
        className: "rgg-badge-notification-image mr-3 flex-shrink-0"
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
          className: "font-weight-bold mb-1",
          children: intl.formatMessage(_messages.default['rgg.badge.notifications.headline'])
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
          className: "mb-1",
          children: current.title
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_paragon.Hyperlink, {
          destination: (0, _urls.getGammaDashboardUrl)(),
          className: "rgg-badge-notification-link",
          children: intl.formatMessage(_messages.default['rgg.badge.notifications.view.badges'])
        })]
      })]
    })
  });
};
var _default = exports.default = BadgeNotifications;
//# sourceMappingURL=BadgeNotifications.js.map