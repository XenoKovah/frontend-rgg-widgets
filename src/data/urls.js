import { getConfig } from '@edx/frontend-platform';

export const getGammaProfileUrl = (username) => `${getConfig().LMS_BASE_URL}/gamma_dashboard/api/v0/avatar-progress/${username}/`;

export const getUserBadgesUrl = (username) => `${getConfig().LMS_BASE_URL}/gamma_dashboard/api/v0/user-badges/${username}/`;

export const getUserLevelUrl = (username) => `${getConfig().LMS_BASE_URL}/gamma_dashboard/api/v0/user-level/${username}/`;

export const getBadgeLeaderboardUrl = (slug) => `${getConfig().LMS_BASE_URL}/gamma_dashboard/leaderboard/badge/${slug}`;

export const getBadgeNotificationsUrl = () => `${getConfig().LMS_BASE_URL}/gamma_dashboard/api/v0/badge-notifications/`;

export const getLeaderboardOptOutUrl = () => `${getConfig().LMS_BASE_URL}/gamma_dashboard/api/v0/leaderboard-opt-out/`;

export const getUserPreferencesUrl = (username) => `${getConfig().LMS_BASE_URL}/api/user/v1/preferences/${username}`;

export const getGammaDashboardUrl = () => `${getConfig().LMS_BASE_URL}/gamma_dashboard/dashboard/`;
