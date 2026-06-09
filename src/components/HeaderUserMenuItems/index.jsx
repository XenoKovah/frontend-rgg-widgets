import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from './messages';

// Relabel a few stock Open edX header user-menu items (contributed by the platform
// header, not by RGG) to course-specific wording. Keyed by the platform's English
// label; any item whose label isn't listed is passed through unchanged.
const PLATFORM_MENU_RENAMES = {
  Dashboard: 'Class Dashboard',
  Profile: 'Public Profile',
  Account: 'Account Settings',
};

// Return a copy of a menu item with its label(s) renamed per PLATFORM_MENU_RENAMES,
// or the original item if nothing matches. Handles both `content` (Header component)
// and `message` (default LearningHeader).
const relabelMenuItem = (item) => {
  if (!item || typeof item !== 'object') {
    return item;
  }

  let updated = item;
  ['content', 'message'].forEach((key) => {
    const rename = typeof item[key] === 'string' ? PLATFORM_MENU_RENAMES[item[key]] : undefined;
    if (rename) {
      updated = { ...updated, [key]: rename };
    }
  });

  return updated;
};

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

  const platformMenu = (widget.RenderWidget.props.menu || []).map((group) => (
    group && Array.isArray(group.items)
      ? { ...group, items: group.items.map(relabelMenuItem) }
      : group
  ));

  // eslint-disable-next-line no-param-reassign
  widget.content.menu = [
    { items },
    ...platformMenu,
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
    ...(widget.RenderWidget.props.items || []).map(relabelMenuItem),
  ];

  return widget;
};
