import { getConfig } from '@edx/frontend-platform';

export const getGammaProfileUrl = (username) => `${getConfig().LMS_BASE_URL}/gamma_dashboard/api/v0/avatar-progress/${username}`;
