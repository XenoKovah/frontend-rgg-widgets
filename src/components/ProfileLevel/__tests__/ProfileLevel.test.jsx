import React from 'react';
import { render, screen } from '@testing-library/react';

import { createTestWrapper } from '../../../setupTest';
import { useUserLevel } from '../../../data/hooks';
import ProfileLevel from '../ProfileLevel';
import messages from '../messages';

jest.mock('../../../data/hooks', () => ({
  useUserLevel: jest.fn(),
}));

const createWrapper = createTestWrapper(messages);

const LEVEL = {
  title: 'R0x0r Illuminati Level 5',
  slug: 'r0x0r-illuminati-level-5',
  image: 'https://gamma.example.com/media/uploads/statuses/r0x0r-band-4.png',
  status_points: 10000000,
};

const renderWidget = (mock = {}) => {
  useUserLevel.mockReturnValue({
    data: { points: 16749461, level: LEVEL },
    isLoading: false,
    isError: false,
    ...mock,
  });
  return render(<ProfileLevel />, { wrapper: createWrapper });
};

describe('ProfileLevel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // The widget reads the viewed username from the profile URL.
    window.history.pushState({}, '', '/profile/u/learner');
  });

  it('reads the viewed username from the URL and queries for it', () => {
    renderWidget();

    expect(useUserLevel).toHaveBeenCalledWith('learner');
  });

  it('renders the level name, the level art and the digit-grouped point total', () => {
    renderWidget();

    expect(screen.getByText('R0x0r Level')).toBeInTheDocument();
    expect(screen.getByText('R0x0r Illuminati Level 5')).toBeInTheDocument();
    // Grouped for the locale rather than a bare 16749461.
    expect(screen.getByText('16,749,461 points')).toBeInTheDocument();
    expect(screen.getByTestId('rgg-profile-level').querySelector('img')).toHaveAttribute('src', LEVEL.image);
  });

  it('renders nothing for a learner below the first threshold', () => {
    const { container } = renderWidget({ data: { points: 100, level: null } });

    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByText('R0x0r Level')).not.toBeInTheDocument();
  });

  it('renders nothing when the profile is not visible to the viewer', () => {
    // The backend answers a bare {} rather than 403 for a hidden profile.
    const { container } = renderWidget({ data: {} });

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing while loading or on error', () => {
    const { container: loading } = renderWidget({ data: undefined, isLoading: true });
    expect(loading).toBeEmptyDOMElement();

    const { container: errored } = renderWidget({ data: undefined, isError: true });
    expect(errored).toBeEmptyDOMElement();
  });
});
