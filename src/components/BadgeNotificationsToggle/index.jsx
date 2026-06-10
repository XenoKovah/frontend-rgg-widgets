import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import BadgeNotificationsToggle from './BadgeNotificationsToggle';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const BadgeNotificationsToggleWithProvider = () => (
  <QueryClientProvider client={queryClient}>
    <BadgeNotificationsToggle />
  </QueryClientProvider>
);

export default BadgeNotificationsToggleWithProvider;
