import { useIntl } from '@edx/frontend-platform/i18n';
import { Image } from '@openedx/paragon';

import { useUserLevel } from '../../data/hooks';
import { getViewedUsername } from '../../utils/viewedProfile';
import messages from './messages';

import './index.scss';

/**
 * Renders the viewed user's R0x0r level -- the level art, its name and their point
 * total -- in the Profile page's left column, above "Earned Accomplishments".
 *
 * The backend enforces profile visibility and answers `{}` when the requester may
 * not see the profile, and `level: null` for a learner who has not yet reached the
 * first threshold; both mean there is nothing to show, so the widget renders
 * nothing rather than an empty box.
 */
const ProfileLevel = () => {
  const intl = useIntl();
  const username = getViewedUsername();
  const { data, isLoading, isError } = useUserLevel(username);

  const level = data?.level;

  if (isLoading || isError || !level) {
    return null;
  }

  return (
    <div className="rgg-profile-level mb-4" data-testid="rgg-profile-level">
      <h2 className="h5 mb-3">
        {intl.formatMessage(messages['rgg.profile.level.heading'])}
      </h2>
      <div className="rgg-profile-level-body d-flex align-items-center">
        {level.image && (
          // The same art the dashboard ladder shows for this level. Marked
          // decorative: the level name sits right beside it as real text, so
          // announcing the image too would just repeat it.
          <Image
            className="rgg-profile-level-image flex-shrink-0 mr-3"
            src={level.image}
            alt=""
            aria-hidden="true"
          />
        )}
        <div className="rgg-profile-level-info">
          <div className="rgg-profile-level-title font-weight-bold">
            {level.title}
          </div>
          <div className="rgg-profile-level-points small text-gray-600">
            {intl.formatMessage(messages['rgg.profile.level.points'], { points: data.points || 0 })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLevel;
