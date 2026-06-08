import { useIntl } from '@edx/frontend-platform/i18n';
import { Image } from '@openedx/paragon';

import { useUserBadges } from '../../data/hooks';
import messages from './messages';

import './index.scss';

/**
 * Extract the viewed user's username from the profile URL (`/profile/u/<username>`).
 *
 * Read from the path rather than react-router's `useParams` so the widget does not
 * depend on sharing a react-router context with the host MFE: it is bundled
 * separately and may not see the MFE's Router provider.
 *
 * @returns {string} the viewed username, or '' if it can't be determined.
 */
const getViewedUsername = () => {
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
  const intl = useIntl();
  const username = getViewedUsername();
  const { data: badges = [], isLoading, isError } = useUserBadges(username);

  if (isLoading || isError || badges.length === 0) {
    return null;
  }

  return (
    <div className="rgg-profile-badges mb-4">
      <h2 className="h5 mb-3">
        {intl.formatMessage(messages['rgg.profile.badges.heading'])}
      </h2>
      <ul className="list-unstyled m-0">
        {badges.map((badge) => (
          <li
            key={badge.title}
            className="rgg-profile-badge d-flex align-items-start mb-3"
            data-testid="rgg-profile-badge"
          >
            {badge.image && (
              <Image
                className="rgg-profile-badge-image flex-shrink-0 mr-3"
                src={badge.image}
                alt={badge.title}
              />
            )}
            <div className="rgg-profile-badge-info">
              <div className="rgg-profile-badge-title font-weight-bold">
                {badge.title}
              </div>
              {badge.description && (
                <div className="rgg-profile-badge-description small text-gray-600">
                  {badge.description}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfileBadges;
