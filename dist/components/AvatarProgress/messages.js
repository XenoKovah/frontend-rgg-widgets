"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _i18n = require("@edx/frontend-platform/i18n");
const messages = (0, _i18n.defineMessages)({
  'rgg.avatar.progress.alert.fully.developed.message': {
    id: 'rgg.avatar.progress.alert.fully.developed.message',
    defaultMessage: 'Congratulations, your avatar is fully developed! You can choose a different avatar on the <link>Performance page</link>;' + ' your accumulated points and the latest evolution you unlocked will be preserved.',
    description: 'Alert shown when the user has reached the maximum development level for the selected avatar.'
  },
  'rgg.avatar.progress.alert.current.level.message': {
    id: 'rgg.avatar.progress.alert.current.level.message',
    defaultMessage: 'Congratulations, your avatar is Level {level} now! You can find more details on the <link>Performance page</link>.',
    description: 'Alert shown when the user’s avatar levels up, indicating the current achieved level.'
  },
  'rgg.avatar.progress.alert.avatar.not.selected.message': {
    id: 'rgg.avatar.progress.alert.avatar.not.selected.message',
    defaultMessage: 'You haven’t chosen an avatar yet. Begin your journey by picking one on the <link>Performance page</link>!',
    description: 'Alert shown when the user has not selected any avatar yet.'
  },
  'rgg.avatar.progress.alert.no.points.yet.message': {
    id: 'rgg.avatar.progress.alert.no.points.yet.message',
    defaultMessage: 'Your avatar is chosen, but your journey has just begun. Earn your first points to unlock Level 1 - see progress on the <link>Performance page</link>.',
    description: 'Alert shown when an avatar is selected but the user has not earned any points yet and Level 1 is not unlocked.'
  },
  'rgg.avatar.progress.alert.loading.message': {
    id: 'rgg.avatar.progress.alert.loading.message',
    defaultMessage: 'Loading...',
    description: 'Alert shown while avatar progress data is being loaded.'
  },
  'rgg.avatar.progress.alert.error.message': {
    id: 'rgg.avatar.progress.alert.error.message',
    defaultMessage: 'Something went wrong. Please try again later.',
    description: 'Alert shown when an error occurs while loading or processing avatar progress data.'
  },
  'rgg.avatar.progress.popover.title': {
    id: 'rgg.avatar.progress.popover.title',
    defaultMessage: 'Your progress',
    description: 'Title of the popover displaying the user’s avatar progress information.'
  },
  'rgg.avatar.progress.popover.level.text': {
    id: 'rgg.avatar.progress.popover.level.text',
    defaultMessage: 'Level {level}',
    description: 'Text label inside the progress popover showing the current avatar level.'
  },
  'rgg.avatar.progress.toggle.alt': {
    id: 'rgg.avatar.progress.toggle.alt',
    defaultMessage: 'Toggle progress widget',
    description: 'Alt text for the icon button that opens/closes the avatar progress popover.'
  },
  'rgg.avatar.progress.avatar.alt': {
    id: 'rgg.avatar.progress.avatar.alt',
    defaultMessage: 'Your badge avatar',
    description: 'Alt text for the user\'s current badge avatar image.'
  }
});
var _default = exports.default = messages;
//# sourceMappingURL=messages.js.map