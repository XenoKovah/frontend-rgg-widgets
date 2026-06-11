import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from './messages';

// Relabel a few stock Open edX header user-menu items (contributed by the platform
// header, not by RGG) to course-specific wording. Keyed by the platform's English
// label; any item whose label isn't listed is passed through unchanged.
const PLATFORM_MENU_RENAMES = {
  Profile: 'Public Profile',
  Account: 'Account Settings',
};

// Stock header items OST2 hides so every user menu matches the learner-dashboard
// MFE's (Your Badges / Leaderboard / Public Profile / Account Settings / Sign Out):
// the course-list links ("My Courses"/"Dashboard" -> /dashboard) and course
// discovery ("Discover" -> /courses). Matched by href rather than label so
// renames elsewhere can't bring them back.
const HIDDEN_PLATFORM_MENU_PATHS = ['/dashboard', '/courses'];

const isHiddenPlatformItem = (item) => {
  if (!item || typeof item.href !== 'string') {
    return false;
  }
  const lmsBaseUrl = getConfig().LMS_BASE_URL || '';
  return HIDDEN_PLATFORM_MENU_PATHS.some(
    (path) => item.href === `${lmsBaseUrl}${path}` || item.href === path,
  );
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

// The RGG gamification links (Your Accomplishments / Leaderboard / Gamification
// Settings) are hidden from learners until the runtime flag is turned on. The boolean
// is delivered globally via MFE_CONFIG (getConfig().RGG_STUDENT_UI_VISIBLE); staff/admins
// bypass it in the callers below so they can preview while it is hidden. The platform
// menu relabel/hide above is NOT gamification and always applies. Undefined => hidden.
const isStudentUiVisible = () => {
  const value = getConfig().RGG_STUDENT_UI_VISIBLE;
  return value === true || value === 'true';
};

export const HeaderUserMenuItems = (widget) => {
  const intl = useIntl();
  const { administrator } = getAuthenticatedUser();
  const showGamification = isStudentUiVisible() || administrator;

  const items = [];
  if (showGamification) {
    items.push(
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
    );

    if (administrator) {
      items.push({
        type: 'item',
        href: `${getConfig().GAMMA_SETTINGS_URL}`,
        content: intl.formatMessage(messages['rgg.avatar.header.user.dropdown.gamification-settings.link']),
      });
    }
  }

  const platformMenu = (widget.RenderWidget.props.menu || []).map((group) => (
    group && Array.isArray(group.items)
      ? { ...group, items: group.items.filter((item) => !isHiddenPlatformItem(item)).map(relabelMenuItem) }
      : group
  ));

  // eslint-disable-next-line no-param-reassign
  widget.content.menu = [
    // Only prepend the gamification group when it has items, so a hidden learner
    // never gets an empty group (which would render a stray divider).
    ...(items.length ? [{ items }] : []),
    ...platformMenu,
  ];

  return widget;
};

export const LearningHeaderUserMenuItems = (widget) => {
  const intl = useIntl();
  const { administrator } = getAuthenticatedUser();
  const showGamification = isStudentUiVisible() || administrator;

  // MFE Learning currently supports two header implementations:
  // - `content` → used by the Header component
  // - `message` → used by the default LearningHeader
  // Both fields are required for compatibility.
  const items = [];
  if (showGamification) {
    items.push({
      href: `${getConfig().LMS_BASE_URL}/gamma_dashboard/dashboard/`,
      content: intl.formatMessage(messages['rgg.avatar.header.user.dropdown.performance.link']),
      message: intl.formatMessage(messages['rgg.avatar.header.user.dropdown.performance.link']),
    },
    {
      href: `${getConfig().LMS_BASE_URL}/gamma_dashboard/leaderboard/`,
      content: intl.formatMessage(messages['rgg.avatar.header.user.dropdown.leaderboard.link']),
      message: intl.formatMessage(messages['rgg.avatar.header.user.dropdown.leaderboard.link']),
    });

    if (administrator) {
      items.push({
        href: `${getConfig().GAMMA_SETTINGS_URL}`,
        content: intl.formatMessage(messages['rgg.avatar.header.user.dropdown.gamification-settings.link']),
        message: intl.formatMessage(messages['rgg.avatar.header.user.dropdown.gamification-settings.link']),
      });
    }
  }

  // eslint-disable-next-line no-param-reassign
  widget.content.items = [
    ...items,
    ...(widget.RenderWidget.props.items || [])
      .filter((item) => !isHiddenPlatformItem(item))
      .map(relabelMenuItem),
  ];

  return widget;
};
