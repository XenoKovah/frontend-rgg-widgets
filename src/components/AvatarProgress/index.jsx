import AvatarProgress from './AvatarProgress';
import AvatarProgressProvider from './AvatarProgressProvider';

const AvatarProgressWithProvider = () => (
  <AvatarProgressProvider>
    <AvatarProgress />
  </AvatarProgressProvider>
);

export default AvatarProgressWithProvider;
