import BadgeNotifications from './BadgeNotifications';
import BadgeNotificationsProvider from './BadgeNotificationsProvider';

const BadgeNotificationsWithProvider = () => (
  <BadgeNotificationsProvider>
    <BadgeNotifications />
  </BadgeNotificationsProvider>
);

export default BadgeNotificationsWithProvider;
