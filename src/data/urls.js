import { getConfig } from '@edx/frontend-platform';

export const getGammaProfileUrl = (username) => `${getConfig().LMS_BASE_URL}/gamma_dashboard/api/v0/avatar-progress/${username}/`;

export const getUserBadgesUrl = (username) => `${getConfig().LMS_BASE_URL}/gamma_dashboard/api/v0/user-badges/${username}/`;

export const getBadgeLeaderboardUrl = (slug) => `${getConfig().LMS_BASE_URL}/gamma_dashboard/leaderboard/badge/${slug}`;
