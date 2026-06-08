import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import { getGammaProfileUrl, getUserBadgesUrl } from './urls';

/**
 * Fetches profile avatar data from the API.
 *
 * @async
 * @param {string} username - The username of the user.
 * @returns {Promise<object>} The user gamma profile avatar data from the API.
 */
export const fetchGammaProfileData = async (username) => {
  const url = getGammaProfileUrl(username);

  const { data } = await getAuthenticatedHttpClient().get(url);
  return data;
};

/**
 * Fetches the badges a user has earned (completed), for their profile page.
 *
 * @async
 * @param {string} username - The username of the profile being viewed.
 * @returns {Promise<Array<{title: string, description: string, image: string}>>}
 */
export const fetchUserBadges = async (username) => {
  const { data } = await getAuthenticatedHttpClient().get(getUserBadgesUrl(username));
  return data;
};
