import { logError } from '@edx/frontend-platform/logging';

import { getCookieDomain } from '../../utils';

export const COOKIE_NAME = 'rgg-avatar-progress-last-seen';

/**
 * Reads the last-seen progress snapshot from a user-scoped cookie.
 * @param {string} username - The authenticated user's username.
 * @returns {{ currentPoints: number, stage: number|null }|null} The stored snapshot, or null if not found.
 */
export const getStoredLastSeen = (username) => {
  try {
    const targetName = `${COOKIE_NAME}-${username}`;
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, ...rest] = cookie.trim().split('=');
      if (name === targetName) {
        return JSON.parse(rest.join('='));
      }
    }
    return null;
  } catch (error) {
    logError('Failed to read stored last-seen cookie', error);
    return null;
  }
};

/**
 * Creates a progress snapshot from the API response data.
 * @param {Object} data - The avatar progress API response.
 * @returns {{ currentPoints: number, stage: number|null }} The snapshot.
 */
export const createProgressSnapshot = (data) => ({
  currentPoints: data.current_points ?? 0,
  stage: data.current_avatar?.stage ?? null,
});

/**
 * Compares two progress snapshots to determine if progress has changed.
 * @param {{ currentPoints: number, stage: number|null }} lastSeen - The previously stored snapshot.
 * @param {{ currentPoints: number, stage: number|null }} currentSnapshot - The current snapshot.
 * @returns {boolean} True if points or stage differ.
 */
export const hasProgressChanged = (lastSeen, currentSnapshot) => (
  lastSeen.currentPoints !== currentSnapshot.currentPoints
  || lastSeen.stage !== currentSnapshot.stage
);

/**
 * Persists the progress snapshot to a user-scoped cookie shared across subdomains.
 * Silently fails if cookies are unavailable.
 * @param {string} username - The authenticated user's username.
 * @param {{ currentPoints: number, stage: number|null }} snapshot - The snapshot to store.
 */
export const saveLastSeen = (username, snapshot) => {
  try {
    const name = `${COOKIE_NAME}-${username}`;
    const value = JSON.stringify(snapshot);
    const domain = getCookieDomain();
    const maxAge = 365 * 24 * 60 * 60;
    const domainPart = domain ? `; domain=${domain}` : '';
    document.cookie = `${name}=${value}${domainPart}; path=/; max-age=${maxAge}; SameSite=Lax`;
  } catch (error) {
    logError('Failed to save last-seen cookie', error);
  }
};
