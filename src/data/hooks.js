import { useQuery } from '@tanstack/react-query';

import { fetchGammaProfileData } from './api';

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
