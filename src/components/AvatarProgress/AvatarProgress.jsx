import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import {
  Alert,
  Avatar,
  Popover,
  Hyperlink,
  IconButton,
  ProgressBar,
  OverlayTrigger,
} from '@openedx/paragon';
import {
  Info as InfoIcon,
  EmojiEvents as EmojiEventsIcon,
} from '@openedx/paragon/icons';

import { useGammaProfileData } from '../../data/hooks';
import messages from './messages';

import './index.scss';

const AvatarProgress = () => {
  const intl = useIntl();
  const { username } = getAuthenticatedUser();
  const {
    data,
    isLoading,
    isError,
    error,
  } = useGammaProfileData(username);

  const {
    status,
    current_points: currentPoints,
    max_required_points: maxRequiredPoints,
    required_points: requiredPoints,
    current_avatar: currentAvatar,
  } = data ?? {};

  const currentProgressCap = requiredPoints || maxRequiredPoints;
  // Clamp at 0: a learner docked a negative-points (penalty) badge can have a total
  // below zero, which would otherwise render a negative-width progress bar.
  const currentProgressPercentage = Math.max(0, (currentPoints / currentProgressCap) * 100);
  const performanceUrl = `${getConfig().LMS_BASE_URL}/gamma_dashboard/dashboard/`;
  const performanceLink = (chunks) => <Hyperlink destination={performanceUrl}>{chunks}</Hyperlink>;

  const progressMessage = () => {
    if (isLoading) {
      return intl.formatMessage(messages['rgg.avatar.progress.alert.loading.message']);
    }

    if (isError) {
      return error.message || intl.formatMessage(messages['rgg.avatar.progress.alert.error.message']);
    }

    if (status === 404) {
      return intl.formatMessage(messages['rgg.avatar.progress.alert.avatar.not.selected.message'], { link: performanceLink });
    }

    if (!currentAvatar) {
      return intl.formatMessage(messages['rgg.avatar.progress.alert.no.points.yet.message'], { link: performanceLink });
    }

    if (currentPoints >= currentProgressCap) {
      return intl.formatMessage(messages['rgg.avatar.progress.alert.fully.developed.message'], { link: performanceLink });
    }

    return intl.formatMessage(messages['rgg.avatar.progress.alert.current.level.message'], {
      link: performanceLink,
      level: currentAvatar?.stage,
    });
  };

  return (
    <div className="rgg-avatar-progress-widget mr-2">
      <OverlayTrigger
        trigger="click"
        placement="bottom"
        overlay={(
          <Popover
            id="avatar-progress-popover"
            className="rgg-avatar-progress-widget-popover"
          >
            {!isLoading && !isError && currentAvatar && (
              <Popover.Title
                as="h5"
                className="d-flex justify-content-between align-items-center text-gray-700 gap-2"
              >
                {intl.formatMessage(messages['rgg.avatar.progress.popover.title'])}
                {' '}
                <span className="text-primary-500">
                  {intl.formatMessage(messages['rgg.avatar.progress.popover.level.text'], { level: currentAvatar?.stage })}
                </span>
              </Popover.Title>
            )}
            <Popover.Content>
              {currentAvatar && (
                <>
                  <Avatar
                    size="xl"
                    src={currentAvatar?.image}
                    alt="Your accomplishment avatar"
                    className="d-block mx-auto rounded-0 mt-2"
                  />
                  <ProgressBar
                    now={currentProgressPercentage}
                    label={`${currentPoints}/${currentProgressCap}`}
                    variant="success"
                    className="mt-3 mb-2"
                  />
                </>
              )}
              <Alert
                variant={isError ? 'danger' : 'info'}
                className="mt-3 p-3 align-items-start"
                icon={InfoIcon}
              >
                <p>{progressMessage()}</p>
              </Alert>
            </Popover.Content>
          </Popover>
        )}
      >
        <IconButton
          src={EmojiEventsIcon}
          alt="Close progress widget"
          onClick={() => {}}
          variant="primary"
        />
      </OverlayTrigger>
    </div>
  );
};

export default AvatarProgress;
