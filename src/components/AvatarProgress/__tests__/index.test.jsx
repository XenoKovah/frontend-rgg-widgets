import React from 'react';
import { render } from '@testing-library/react';

import AvatarProgressWithProvider from '..';

jest.mock('../AvatarProgress', () => {
  const MockAvatarProgress = () => <div data-testid="avatar-progress">Avatar Progress</div>;
  return MockAvatarProgress;
});

jest.mock('../AvatarProgressProvider', () => {
  // eslint-disable-next-line react/prop-types
  const MockAvatarProgressProvider = ({ children }) => (
    <div data-testid="avatar-progress-provider">{children}</div>
  );
  return MockAvatarProgressProvider;
});

describe('AvatarProgress index', () => {
  it('should render AvatarProgress wrapped in AvatarProgressProvider', () => {
    const { container } = render(<AvatarProgressWithProvider />);

    const provider = container.querySelector('[data-testid="avatar-progress-provider"]');
    const progress = container.querySelector('[data-testid="avatar-progress"]');

    expect(provider).toBeInTheDocument();
    expect(progress).toBeInTheDocument();
    expect(provider).toContainElement(progress);
  });
});
