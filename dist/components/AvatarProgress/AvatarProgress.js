"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = require("react");
var _frontendPlatform = require("@edx/frontend-platform");
var _i18n = require("@edx/frontend-platform/i18n");
var _auth = require("@edx/frontend-platform/auth");
var _paragon = require("@openedx/paragon");
var _icons = require("@openedx/paragon/icons");
var _hooks = require("../../data/hooks");
var _utils = require("./utils");
var _messages = _interopRequireDefault(require("./messages"));
require("./index.scss");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const AvatarProgress = () => {
  const intl = (0, _i18n.useIntl)();
  const {
    username
  } = (0, _auth.getAuthenticatedUser)();
  const {
    data,
    isLoading,
    isError,
    error
  } = (0, _hooks.useGammaProfileData)(username);
  const [showPopover, setShowPopover] = (0, _react.useState)(false);
  const [hasNewActivity, setHasNewActivity] = (0, _react.useState)(false);
  const lastSeenDataRef = (0, _react.useRef)((0, _utils.getStoredLastSeen)(username));
  const {
    status,
    current_points: currentPoints,
    max_required_points: maxRequiredPoints,
    required_points: requiredPoints,
    current_avatar: currentAvatar
  } = data ?? {};
  (0, _react.useEffect)(() => {
    if (!data || isLoading || isError) {
      return;
    }
    const currentSnapshot = (0, _utils.createProgressSnapshot)(data);
    if (!lastSeenDataRef.current) {
      lastSeenDataRef.current = currentSnapshot;
      (0, _utils.saveLastSeen)(username, currentSnapshot);
      return;
    }
    if ((0, _utils.hasProgressChanged)(lastSeenDataRef.current, currentSnapshot)) {
      setHasNewActivity(true);
    }
  }, [data, isLoading, isError]);
  const handlePopoverToggle = nextShow => {
    setShowPopover(nextShow);
    if (!nextShow) {
      if (data && !isLoading && !isError) {
        const snapshot = (0, _utils.createProgressSnapshot)(data);
        lastSeenDataRef.current = snapshot;
        (0, _utils.saveLastSeen)(username, snapshot);
      }
      setHasNewActivity(false);
    }
  };
  const currentProgressCap = requiredPoints || maxRequiredPoints;
  const currentProgressPercentage = currentPoints / currentProgressCap * 100;
  const performanceUrl = `${(0, _frontendPlatform.getConfig)().LMS_BASE_URL}/gamma_dashboard/dashboard/`;
  const performanceLink = chunks => /*#__PURE__*/(0, _jsxRuntime.jsx)(_paragon.Hyperlink, {
    destination: performanceUrl,
    children: chunks
  });
  const progressMessage = () => {
    if (isLoading) {
      return intl.formatMessage(_messages.default['rgg.avatar.progress.alert.loading.message']);
    }
    if (isError) {
      return error.message || intl.formatMessage(_messages.default['rgg.avatar.progress.alert.error.message']);
    }
    if (status === 404) {
      return intl.formatMessage(_messages.default['rgg.avatar.progress.alert.avatar.not.selected.message'], {
        link: performanceLink
      });
    }
    if (!currentAvatar) {
      return intl.formatMessage(_messages.default['rgg.avatar.progress.alert.no.points.yet.message'], {
        link: performanceLink
      });
    }
    if (currentPoints >= currentProgressCap) {
      return intl.formatMessage(_messages.default['rgg.avatar.progress.alert.fully.developed.message'], {
        link: performanceLink
      });
    }
    return intl.formatMessage(_messages.default['rgg.avatar.progress.alert.current.level.message'], {
      link: performanceLink,
      level: currentAvatar?.stage
    });
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    className: "rgg-avatar-progress-widget mr-2",
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_paragon.OverlayTrigger, {
      trigger: "click",
      placement: "bottom",
      show: showPopover,
      onToggle: handlePopoverToggle,
      rootClose: true,
      overlay: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_paragon.Popover, {
        id: "avatar-progress-popover",
        className: "rgg-avatar-progress-widget-popover",
        children: [!isLoading && !isError && currentAvatar && /*#__PURE__*/(0, _jsxRuntime.jsxs)(_paragon.Popover.Title, {
          as: "h5",
          className: "d-flex justify-content-between align-items-center text-gray-700 gap-2",
          children: [intl.formatMessage(_messages.default['rgg.avatar.progress.popover.title']), ' ', /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
            className: "text-primary-500",
            children: intl.formatMessage(_messages.default['rgg.avatar.progress.popover.level.text'], {
              level: currentAvatar?.stage
            })
          })]
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_paragon.Popover.Content, {
          children: [currentAvatar && /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
            children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_paragon.Avatar, {
              size: "xl",
              src: currentAvatar?.image,
              alt: intl.formatMessage(_messages.default['rgg.avatar.progress.avatar.alt']),
              className: "d-block mx-auto rounded-0 mt-2"
            }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_paragon.ProgressBar, {
              now: currentProgressPercentage,
              label: `${currentPoints}/${currentProgressCap}`,
              variant: "success",
              className: "mt-3 mb-2"
            })]
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_paragon.Alert, {
            variant: isError ? 'danger' : 'info',
            className: "mt-3 p-3 align-items-start",
            icon: _icons.Info,
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
              children: progressMessage()
            })
          })]
        })]
      }),
      children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: "rgg-avatar-progress-icon-wrapper position-relative d-inline-flex",
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_paragon.IconButton, {
          src: _icons.EmojiEvents,
          alt: intl.formatMessage(_messages.default['rgg.avatar.progress.toggle.alt']),
          onClick: () => {}
        }), hasNewActivity && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: "rgg-avatar-progress-notification-dot bg-danger-500 rounded-circle p-1 position-absolute",
          "data-testid": "notification-dot"
        })]
      })
    })
  });
};
var _default = exports.default = AvatarProgress;
//# sourceMappingURL=AvatarProgress.js.map