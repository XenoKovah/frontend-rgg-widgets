import React from 'react';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { Form } from '@openedx/paragon';

import {
  useBadgeNotificationsPreference,
  useUpdateBadgeNotificationsPreference,
} from '../../data/hooks';
import messages from './messages';

/**
 * Account Settings switch controlling the "badge earned" pop-ups, persisted as
 * the `rgg_badge_notifications` Open edX user preference (unset means enabled).
 *
 * Rendered through the account MFE's gamification-preferences plugin slot as its
 * own small section, matching the page's section layout.
 */
const BadgeNotificationsToggle = () => {
  const intl = useIntl();
  const authenticatedUser = getAuthenticatedUser();
  const username = authenticatedUser?.username;
  const { data: enabled, isLoading } = useBadgeNotificationsPreference(username);
  const { mutate: updatePreference } = useUpdateBadgeNotificationsPreference(username);

  if (!username) {
    return null;
  }

  // Hidden while the student gamification UI is off (RGG_STUDENT_UI_VISIBLE), unless the
  // user is staff/admin (preview) — mirrors the header gamification-link gating.
  const flag = getConfig().RGG_STUDENT_UI_VISIBLE;
  const studentUiVisible = flag === true || flag === 'true';
  if (!studentUiVisible && !authenticatedUser?.administrator) {
    return null;
  }

  return (
    <div className="account-section pt-3 mb-5" id="rgg-gamification-settings">
      <h2 className="section-heading h4 mb-3">
        {intl.formatMessage(messages['rgg.badge.notifications.toggle.heading'])}
      </h2>
      <Form.Switch
        checked={Boolean(enabled)}
        disabled={isLoading}
        onChange={(event) => updatePreference(event.target.checked)}
        helperText={intl.formatMessage(messages['rgg.badge.notifications.toggle.description'])}
        data-testid="rgg-badge-notifications-toggle"
      >
        {intl.formatMessage(messages['rgg.badge.notifications.toggle.label'])}
      </Form.Switch>
    </div>
  );
};

export default BadgeNotificationsToggle;
