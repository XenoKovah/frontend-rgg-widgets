import React, {
  useEffect, useRef, useState,
} from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { Hyperlink, Image, Toast } from '@openedx/paragon';

import { useBadgeNotifications, useMarkBadgeNotificationsSeen } from '../../data/hooks';
import { getGammaDashboardUrl } from '../../data/urls';
import messages from './messages';

import './index.scss';

/**
 * How long each badge toast stays on screen. Paragon pauses the timer while the
 * toast is hovered or focused, so this is a floor, not a hard limit.
 */
export const TOAST_DELAY_MS = 8 * 1000;

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
  const intl = useIntl();
  const authenticatedUser = getAuthenticatedUser();
  const { data } = useBadgeNotifications(Boolean(authenticatedUser));
  const [queue, setQueue] = useState([]);
  // Session-level dedupe: uuids ever enqueued by this mount. Keeps repeat poll
  // responses (or a failed acknowledgement) from re-queueing the same badge.
  const enqueuedUuidsRef = useRef(new Set());
  const { mutate: markSeen } = useMarkBadgeNotificationsSeen();

  useEffect(() => {
    if (!data?.enabled || !data.notifications?.length) {
      return;
    }
    const fresh = data.notifications.filter(
      (notification) => notification.uuid && !enqueuedUuidsRef.current.has(notification.uuid),
    );
    if (!fresh.length) {
      return;
    }
    fresh.forEach((notification) => enqueuedUuidsRef.current.add(notification.uuid));
    setQueue((previous) => [...previous, ...fresh]);
  }, [data]);

  const current = queue[0] || null;
  const currentUuid = current?.uuid;

  // Acknowledge each toast as it is displayed (not when it closes), so a
  // navigation mid-toast cannot replay the whole queue on the next page.
  useEffect(() => {
    if (currentUuid) {
      markSeen([currentUuid]);
    }
  }, [currentUuid, markSeen]);

  if (!authenticatedUser || !current) {
    return null;
  }

  return (
    <Toast
      show
      onClose={() => setQueue((previous) => previous.slice(1))}
      delay={TOAST_DELAY_MS}
      className="rgg-badge-notification-toast"
    >
      <div className="d-flex align-items-center" data-testid="rgg-badge-notification">
        {current.image && (
          <Image
            src={current.image}
            alt=""
            className="rgg-badge-notification-image mr-3 flex-shrink-0"
          />
        )}
        <div>
          <p className="font-weight-bold mb-1">
            {intl.formatMessage(messages['rgg.badge.notifications.headline'])}
          </p>
          <p className="mb-1">{current.title}</p>
          <Hyperlink
            destination={getGammaDashboardUrl()}
            className="rgg-badge-notification-link"
          >
            {intl.formatMessage(messages['rgg.badge.notifications.view.badges'])}
          </Hyperlink>
        </div>
      </div>
    </Toast>
  );
};

export default BadgeNotifications;
