import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import { getGammaProfileUrl } from './urls';

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
