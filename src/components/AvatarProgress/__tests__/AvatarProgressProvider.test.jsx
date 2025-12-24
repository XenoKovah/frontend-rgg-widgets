import React from 'react';
import { render } from '@testing-library/react';
import { useQueryClient } from '@tanstack/react-query';

import AvatarProgressProvider from '../AvatarProgressProvider';

const TestComponent = () => {
  const queryClient = useQueryClient();
  return <div data-testid="test">{queryClient ? 'QueryClient provided' : 'No QueryClient'}</div>;
};

describe('AvatarProgressProvider', () => {
  it('should provide QueryClient to children', () => {
    const { getByTestId } = render(
      <AvatarProgressProvider>
        <TestComponent />
      </AvatarProgressProvider>,
    );

    expect(getByTestId('test')).toHaveTextContent('QueryClient provided');
  });

  it('should render children', () => {
    const { getByText } = render(
      <AvatarProgressProvider>
        <div>Component</div>
      </AvatarProgressProvider>,
    );

    expect(getByText('Component')).toBeInTheDocument();
  });
});
