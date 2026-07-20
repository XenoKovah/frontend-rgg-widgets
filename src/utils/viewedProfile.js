/**
 * Extract the viewed user's username from the profile URL (`/profile/u/<username>`).
 *
 * Read from the path rather than react-router's `useParams` so the widgets do not
 * depend on sharing a react-router context with the host MFE: they are bundled
 * separately and may not see the MFE's Router provider.
 *
 * @returns {string} the viewed username, or '' if it can't be determined.
 */
// eslint-disable-next-line import/prefer-default-export
export const getViewedUsername = () => {
  const match = window.location.pathname.match(/\/u\/([^/?#]+)/);
  return match ? decodeURIComponent(match[1]) : '';
};
