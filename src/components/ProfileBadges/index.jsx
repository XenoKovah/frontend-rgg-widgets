import ProfileBadges from './ProfileBadges';
import ProfileBadgesProvider from './ProfileBadgesProvider';

const ProfileBadgesWithProvider = () => (
  <ProfileBadgesProvider>
    <ProfileBadges />
  </ProfileBadgesProvider>
);

export default ProfileBadgesWithProvider;
