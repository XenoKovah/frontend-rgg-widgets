import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'rgg.badge.notifications.toggle.heading': {
    id: 'rgg.badge.notifications.toggle.heading',
    defaultMessage: 'Gamification',
    description: 'Heading of the Account Settings section holding gamification preferences.',
  },
  'rgg.badge.notifications.toggle.label': {
    id: 'rgg.badge.notifications.toggle.label',
    defaultMessage: 'Badge notifications',
    description: 'Label of the Account Settings switch that enables/disables badge-earned pop-ups.',
  },
  'rgg.badge.notifications.toggle.description': {
    id: 'rgg.badge.notifications.toggle.description',
    defaultMessage: 'Show a pop-up congratulation when you earn a badge.',
    description: 'Helper text under the badge notifications switch in Account Settings.',
  },
});

export default messages;
