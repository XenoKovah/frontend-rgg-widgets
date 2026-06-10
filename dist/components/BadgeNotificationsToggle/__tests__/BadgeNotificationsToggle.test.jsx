import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { getAuthenticatedUser } from '@edx/frontend-platform/auth';

import { createTestWrapper } from '../../../setupTest';
import {
  useBadgeNotificationsPreference,
  useUpdateBadgeNotificationsPreference,
} from '../../../data/hooks';
import BadgeNotificationsToggle from '../BadgeNotificationsToggle';
import messages from '../messages';

jest.mock('../../../data/hooks', () => ({
  useBadgeNotificationsPreference: jest.fn(),
  useUpdateBadgeNotificationsPreference: jest.fn(),
}));

const createWrapper = createTestWrapper(messages);

const updatePreference = jest.fn();

const renderWidget = (mock = {}) => {
  useBadgeNotificationsPreference.mockReturnValue({
    data: true,
    isLoading: false,
    ...mock,
  });
  useUpdateBadgeNotificationsPreference.mockReturnValue({ mutate: updatePreference });
  return render(<BadgeNotificationsToggle />, { wrapper: createWrapper });
};

describe('BadgeNotificationsToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getAuthenticatedUser.mockReturnValue({ username: 'openedx' });
  });

  it('renders a checked switch when notifications are enabled', () => {
    renderWidget({ data: true });

    expect(screen.getByText('Gamification')).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: 'Accomplishment notifications' })).toBeChecked();
  });

  it('renders an unchecked switch when the user opted out', () => {
    renderWidget({ data: false });

    expect(screen.getByRole('switch', { name: 'Accomplishment notifications' })).not.toBeChecked();
  });

  it('persists the flipped preference', () => {
    renderWidget({ data: true });

    fireEvent.click(screen.getByRole('switch', { name: 'Accomplishment notifications' }));

    expect(updatePreference).toHaveBeenCalledTimes(1);
    expect(updatePreference).toHaveBeenCalledWith(false);
  });

  it('renders nothing for anonymous users', () => {
    getAuthenticatedUser.mockReturnValue(null);
    renderWidget();

    expect(screen.queryByRole('switch')).not.toBeInTheDocument();
  });
});
