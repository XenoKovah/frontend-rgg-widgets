import PropTypes from 'prop-types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const AvatarProgressProvider = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

AvatarProgressProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AvatarProgressProvider;
