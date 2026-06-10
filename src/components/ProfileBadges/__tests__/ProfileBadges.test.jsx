import React from 'react';
import { render, screen } from '@testing-library/react';

import { createTestWrapper } from '../../../setupTest';
import { useUserBadges } from '../../../data/hooks';
import ProfileBadges from '../ProfileBadges';
import messages from '../messages';

jest.mock('../../../data/hooks', () => ({
  useUserBadges: jest.fn(),
}));

const createWrapper = createTestWrapper(messages);

const renderWidget = (mock = {}) => {
  useUserBadges.mockReturnValue({
    data: [],
    isLoading: false,
    isError: false,
    ...mock,
  });
  return render(<ProfileBadges />, { wrapper: createWrapper });
};

describe('ProfileBadges', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // The widget reads the viewed username from the profile URL.
    window.history.pushState({}, '', '/profile/u/learner');
  });

  it('reads the viewed username from the URL and queries for it', () => {
    renderWidget({ data: [] });

    expect(useUserBadges).toHaveBeenCalledWith('learner');
  });

  it('renders the earned badges with name, description and image', () => {
    renderWidget({
      data: [
        { title: 'Answerer', description: 'Answered a question in the Discussions section.', image: 'https://gamma.example.com/a.png' },
        { title: 'First Steps', description: 'Completed your first action.', image: 'https://gamma.example.com/b.png' },
      ],
    });

    expect(screen.getByText('Earned Accomplishments')).toBeInTheDocument();
    expect(screen.getAllByTestId('rgg-profile-badge')).toHaveLength(2);
    expect(screen.getByText('Answerer')).toBeInTheDocument();
    expect(screen.getByText('Answered a question in the Discussions section.')).toBeInTheDocument();
    expect(screen.getByAltText('Answerer')).toHaveAttribute('src', 'https://gamma.example.com/a.png');
  });

  it('renders nothing when the user has no earned badges', () => {
    const { container } = renderWidget({ data: [] });

    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByText('Earned Accomplishments')).not.toBeInTheDocument();
  });

  it('renders nothing while loading', () => {
    const { container } = renderWidget({ isLoading: true });

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing on error', () => {
    const { container } = renderWidget({ isError: true });

    expect(container).toBeEmptyDOMElement();
  });
});
