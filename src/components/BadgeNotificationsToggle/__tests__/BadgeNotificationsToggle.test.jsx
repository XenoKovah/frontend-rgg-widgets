import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';

import { createTestWrapper } from '../../../setupTest';
import {
  useBadgeNotificationsPreference,
  useLeaderboardOptOut,
  useUpdateBadgeNotificationsPreference,
  useUpdateLeaderboardOptOut,
} from '../../../data/hooks';
import BadgeNotificationsToggle from '../BadgeNotificationsToggle';
import messages from '../messages';

jest.mock('../../../data/hooks', () => ({
  useBadgeNotificationsPreference: jest.fn(),
  useUpdateBadgeNotificationsPreference: jest.fn(),
  useLeaderboardOptOut: jest.fn(),
  useUpdateLeaderboardOptOut: jest.fn(),
}));

const createWrapper = createTestWrapper(messages);

const updatePreference = jest.fn();
const updateOptOut = jest.fn();

const renderWidget = ({ notif = {}, optOut = {} } = {}) => {
  useBadgeNotificationsPreference.mockReturnValue({ data: true, isLoading: false, ...notif });
  useUpdateBadgeNotificationsPreference.mockReturnValue({ mutate: updatePreference });
  useLeaderboardOptOut.mockReturnValue({ data: false, isLoading: false, ...optOut });
  useUpdateLeaderboardOptOut.mockReturnValue({ mutate: updateOptOut });
  return render(<BadgeNotificationsToggle />, { wrapper: createWrapper });
};

describe('BadgeNotificationsToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getAuthenticatedUser.mockReturnValue({ username: 'openedx' });
    // The Gamification section is gated on the student-UI flag (hidden pre-launch); turn
    // it on so the switches render. A dedicated test below covers the hidden case.
    getConfig.mockReturnValue({ LMS_BASE_URL: 'https://example.com', RGG_STUDENT_UI_VISIBLE: true });
  });

  it('renders a checked switch when notifications are enabled', () => {
    renderWidget({ notif: { data: true } });

    expect(screen.getByText('Gamification')).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: 'Accomplishment notifications' })).toBeChecked();
  });

  it('renders an unchecked switch when the user opted out of notifications', () => {
    renderWidget({ notif: { data: false } });

    expect(screen.getByRole('switch', { name: 'Accomplishment notifications' })).not.toBeChecked();
  });

  it('persists the flipped notifications preference', () => {
    renderWidget({ notif: { data: true } });

    fireEvent.click(screen.getByRole('switch', { name: 'Accomplishment notifications' }));

    expect(updatePreference).toHaveBeenCalledTimes(1);
    expect(updatePreference).toHaveBeenCalledWith(false);
  });

  it('renders the leaderboard opt-out switch unchecked by default', () => {
    renderWidget({ optOut: { data: false } });

    expect(screen.getByRole('switch', { name: 'Opt out of leaderboard ranking' })).not.toBeChecked();
  });

  it('renders the leaderboard opt-out switch checked when the user opted out', () => {
    renderWidget({ optOut: { data: true } });

    expect(screen.getByRole('switch', { name: 'Opt out of leaderboard ranking' })).toBeChecked();
  });

  it('persists the flipped leaderboard opt-out choice', () => {
    renderWidget({ optOut: { data: false } });

    fireEvent.click(screen.getByRole('switch', { name: 'Opt out of leaderboard ranking' }));

    expect(updateOptOut).toHaveBeenCalledTimes(1);
    expect(updateOptOut).toHaveBeenCalledWith(true);
  });

  it('renders nothing when the student gamification UI is hidden for a non-staff user', () => {
    getConfig.mockReturnValue({ LMS_BASE_URL: 'https://example.com', RGG_STUDENT_UI_VISIBLE: false });
    renderWidget();

    expect(screen.queryByRole('switch')).not.toBeInTheDocument();
  });

  it('renders nothing for anonymous users', () => {
    getAuthenticatedUser.mockReturnValue(null);
    renderWidget();

    expect(screen.queryByRole('switch')).not.toBeInTheDocument();
  });
});
