import React from 'react';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';

import { getAuthenticatedUser } from '@edx/frontend-platform/auth';

import { createTestWrapper } from '../../../setupTest';
import { useBadgeNotifications, useMarkBadgeNotificationsSeen } from '../../../data/hooks';
import BadgeNotifications from '../BadgeNotifications';
import messages from '../messages';

jest.mock('../../../data/hooks', () => ({
  useBadgeNotifications: jest.fn(),
  useMarkBadgeNotificationsSeen: jest.fn(),
}));

const createWrapper = createTestWrapper(messages);

const NOTIFICATIONS = [
  {
    uuid: '11111111-1111-1111-1111-111111111111',
    slug: 'point-collector',
    title: 'Point Collector',
    description: 'Earned 1000 points.',
    image: 'https://gamma.example.com/media/uploads/badges/points.png',
    completed_at: '2026-06-09T12:00:00Z',
  },
  {
    uuid: '22222222-2222-2222-2222-222222222222',
    slug: 'first-steps',
    title: 'First Steps',
    description: 'Completed your first action.',
    image: 'https://gamma.example.com/media/uploads/badges/first.png',
    completed_at: '2026-06-09T12:01:00Z',
  },
];

const markSeen = jest.fn();

const renderWidget = (mock = {}) => {
  useBadgeNotifications.mockReturnValue({
    data: { enabled: true, notifications: [] },
    ...mock,
  });
  useMarkBadgeNotificationsSeen.mockReturnValue({ mutate: markSeen });
  return render(<BadgeNotifications />, { wrapper: createWrapper });
};

describe('BadgeNotifications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getAuthenticatedUser.mockReturnValue({ username: 'openedx' });
  });

  it('renders nothing when there are no pending notifications', () => {
    renderWidget();

    expect(screen.queryByTestId('rgg-badge-notification')).not.toBeInTheDocument();
    expect(markSeen).not.toHaveBeenCalled();
  });

  it('renders nothing when the user has disabled notifications', () => {
    renderWidget({ data: { enabled: false, notifications: [] } });

    expect(screen.queryByTestId('rgg-badge-notification')).not.toBeInTheDocument();
  });

  it('renders nothing for anonymous users', () => {
    getAuthenticatedUser.mockReturnValue(null);
    renderWidget({ data: undefined });

    expect(useBadgeNotifications).toHaveBeenCalledWith(false);
    expect(screen.queryByTestId('rgg-badge-notification')).not.toBeInTheDocument();
  });

  it('shows the toast for an earned badge and acknowledges it as seen', () => {
    renderWidget({ data: { enabled: true, notifications: [NOTIFICATIONS[0]] } });

    expect(screen.getByText('You earned a badge!')).toBeInTheDocument();
    expect(screen.getByText('Point Collector')).toBeInTheDocument();
    expect(markSeen).toHaveBeenCalledTimes(1);
    expect(markSeen).toHaveBeenCalledWith([NOTIFICATIONS[0].uuid]);

    const link = screen.getByText('View your badges');
    expect(link).toHaveAttribute('href', 'https://example.com/gamma_dashboard/dashboard/');
  });

  it('shows queued badges one at a time and acknowledges each on display', async () => {
    renderWidget({ data: { enabled: true, notifications: NOTIFICATIONS } });

    expect(screen.getByText('Point Collector')).toBeInTheDocument();
    expect(screen.queryByText('First Steps')).not.toBeInTheDocument();
    expect(markSeen).toHaveBeenCalledWith([NOTIFICATIONS[0].uuid]);

    fireEvent.click(screen.getByRole('button', { name: /close/i }));

    await waitFor(() => expect(screen.getByText('First Steps')).toBeInTheDocument());
    expect(markSeen).toHaveBeenCalledWith([NOTIFICATIONS[1].uuid]);
    expect(markSeen).toHaveBeenCalledTimes(2);
  });

  it('does not re-enqueue notifications already shown when the poll repeats them', async () => {
    const { rerender } = renderWidget({ data: { enabled: true, notifications: [NOTIFICATIONS[0]] } });

    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    await waitFor(() => expect(screen.queryByTestId('rgg-badge-notification')).not.toBeInTheDocument());

    // The next poll returns the same (not yet acknowledged server-side) badge.
    useBadgeNotifications.mockReturnValue({
      data: { enabled: true, notifications: [{ ...NOTIFICATIONS[0] }] },
    });
    rerender(<BadgeNotifications />);

    expect(screen.queryByTestId('rgg-badge-notification')).not.toBeInTheDocument();
    expect(markSeen).toHaveBeenCalledTimes(1);
  });
});
