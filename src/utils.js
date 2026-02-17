import { getConfig } from '@edx/frontend-platform';
import { logError } from '@edx/frontend-platform/logging';

/**
 * Extracts the hostname from LMS_BASE_URL to use as the cookie domain.
 * This allows the cookie to be shared across subdomains (e.g. profile.example.io, learning.example.io).
 * @returns {string} The hostname or empty string if unavailable.
 */
export const getCookieDomain = () => {
  try {
    return new URL(getConfig().LMS_BASE_URL).hostname;
  } catch (error) {
    logError('Failed to extract cookie domain from LMS_BASE_URL', error);
    return '';
  }
};
