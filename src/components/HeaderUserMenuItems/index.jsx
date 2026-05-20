import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from './messages';

export const HeaderUserMenuItems = (widget) => {
  const intl = useIntl();
  const { administrator } = getAuthenticatedUser();

  const items = [
    {
      type: 'item',
      href: `${getConfig().LMS_BASE_URL}/gamma_dashboard/dashboard/`,
      content: intl.formatMessage(messages['rgg.avatar.header.user.dropdown.performance.link']),
    },
    {
      type: 'item',
      href: `${getConfig().LMS_BASE_URL}/gamma_dashboard/leaderboard/`,
      content: intl.formatMessage(messages['rgg.avatar.header.user.dropdown.leaderboard.link']),
    },
  ];

  if (administrator) {
    items.push({
      type: 'item',
      href: `${getConfig().GAMMA_SETTINGS_URL}`,
      content: intl.formatMessage(messages['rgg.avatar.header.user.dropdown.gamification-settings.link']),
    });
  }

  // eslint-disable-next-line no-param-reassign
  widget.content.menu = [
    { items },
    ...widget.RenderWidget.props.menu,
  ];

  return widget;
};

export const LearningHeaderUserMenuItems = (widget) => {
  const intl = useIntl();
  const { administrator } = getAuthenticatedUser();

  // MFE Learning currently supports two header implementations:
  // - `content` → used by the Header component
  // - `message` → used by the default LearningHeader
  // Both fields are required for compatibility.
  const items = [{
    href: `${getConfig().LMS_BASE_URL}/gamma_dashboard/dashboard/`,
    content: intl.formatMessage(messages['rgg.avatar.header.user.dropdown.performance.link']),
    message: intl.formatMessage(messages['rgg.avatar.header.user.dropdown.performance.link']),
  },
  {
    href: `${getConfig().LMS_BASE_URL}/gamma_dashboard/leaderboard/`,
    content: intl.formatMessage(messages['rgg.avatar.header.user.dropdown.leaderboard.link']),
    message: intl.formatMessage(messages['rgg.avatar.header.user.dropdown.leaderboard.link']),
  }];

  if (administrator) {
    items.push({
      href: `${getConfig().GAMMA_SETTINGS_URL}`,
      content: intl.formatMessage(messages['rgg.avatar.header.user.dropdown.gamification-settings.link']),
      message: intl.formatMessage(messages['rgg.avatar.header.user.dropdown.gamification-settings.link']),
    });
  }

  // eslint-disable-next-line no-param-reassign
  widget.content.items = [
    ...items,
    ...widget.RenderWidget.props.items,
  ];

  return widget;
};
