/* eslint-disable import/no-extraneous-dependencies */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';
import React from 'react';
import PropTypes from 'prop-types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IntlProvider } from '@edx/frontend-platform/i18n';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({ LMS_BASE_URL: 'https://example.com' })),
}));

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedUser: jest.fn(() => ({ username: 'openedx' })),
}));

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
  logInfo: jest.fn(),
}));

export const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export const createTestWrapper = (messages = {}) => {
  const queryClient = createTestQueryClient();

  const TestWrapper = (props = {}) => {
    const { children = null } = props;
    return (
      <IntlProvider locale="en" messages={messages}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </IntlProvider>
    );
  };

  TestWrapper.propTypes = {
    children: PropTypes.node,
  };

  return TestWrapper;
};
