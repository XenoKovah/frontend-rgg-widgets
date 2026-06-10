import PropTypes from 'prop-types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Returning focus to a long-lived tab should check for new badges right
      // away rather than waiting out the poll interval.
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
});

const BadgeNotificationsProvider = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

BadgeNotificationsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default BadgeNotificationsProvider;
