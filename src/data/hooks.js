import { useQuery } from '@tanstack/react-query';

import { fetchGammaProfileData, fetchUserBadges } from './api';

export const retryFn = (failureCount, error) => {
  if (error?.response?.status === 404 || error?.status === 404) {
    return false;
  }
  return failureCount < 2;
};

export const useGammaProfileData = (username) => (
  useQuery({
    queryKey: ['gammaProfile'],
    queryFn: () => fetchGammaProfileData(username),
    placeholderData: (previousData) => previousData,
    retry: retryFn,
  })
);

export const useUserBadges = (username) => (
  useQuery({
    // Key by username: unlike the current-user profile data, this is fetched for
    // whichever profile is being viewed, so the cache must not bleed across users.
    queryKey: ['userBadges', username],
    queryFn: () => fetchUserBadges(username),
    enabled: Boolean(username),
    retry: retryFn,
  })
);
