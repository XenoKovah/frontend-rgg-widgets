import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import { createTestWrapper } from '../../setupTest';
import { useUserBadges } from '../hooks';
import { fetchUserBadges } from '../api';

jest.mock('../api', () => ({
  fetchUserBadges: jest.fn(),
}));

// Minimal consumer exposing the hook's data so the test can assert on it
// (RTL 12 has no renderHook).
const BadgeTitles = () => {
  const { data: badges = [] } = useUserBadges('learner');
  return <div data-testid="titles">{badges.map((badge) => badge.title).join('|')}</div>;
};

describe('useUserBadges', () => {
  it('alphabetizes badges by title, case-insensitively', async () => {
    fetchUserBadges.mockResolvedValue([
      { title: 'Set Photo', slug: 'set-photo' },
      { title: 'answerer', slug: 'answerer' },
      { title: '2000 points', slug: '2000-points' },
      { title: 'Instructor', slug: 'instructor' },
    ]);

    render(<BadgeTitles />, { wrapper: createTestWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('titles')).toHaveTextContent(
        '2000 points|answerer|Instructor|Set Photo',
      );
    });
  });
});
