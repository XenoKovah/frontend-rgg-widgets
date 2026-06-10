import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  mockAvatarNotFoundError,
  mockNoAvatarSelected,
  mockAvatarProgress,
  mockFullyDevelopedAvatar,
} from '../../../mocks/avatarProgressMocks';
import { createTestWrapper } from '../../../setupTest';
import { useGammaProfileData } from '../../../data/hooks';
import AvatarProgress from '../AvatarProgress';
import messages from '../messages';

jest.mock('../../../data/hooks', () => ({
  useGammaProfileData: jest.fn(),
}));

const createWrapper = createTestWrapper(messages);

const defaultMockResponse = {
  data: null,
  isLoading: false,
  isError: false,
  error: null,
};

// Helper function to render component and open popover
const renderAndOpenPopover = async (mockData = {}) => {
  useGammaProfileData.mockReturnValue({
    ...defaultMockResponse,
    ...mockData,
  });

  const result = render(<AvatarProgress />, { wrapper: createWrapper });
  await userEvent.click(screen.getByLabelText('Close progress widget'));
  return result;
};

// Helper function to wait for and get popover element
const getPopover = async (baseElement) => {
  await waitFor(() => {
    expect(baseElement.querySelector('.rgg-avatar-progress-widget-popover')).toBeInTheDocument();
  });
  return baseElement.querySelector('.rgg-avatar-progress-widget-popover');
};

describe('AvatarProgress', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading state', () => {
    it('should display loading message when data is loading', async () => {
      await renderAndOpenPopover({ isLoading: true });

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByText('Your progress')).not.toBeInTheDocument();
    });
  });

  describe('Error state', () => {
    it('should display error message when there is an error', async () => {
      const errorMessage = mockAvatarNotFoundError.detail.error;
      await renderAndOpenPopover({
        isError: true,
        error: { message: errorMessage },
      });

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.queryByText('Your progress')).not.toBeInTheDocument();
    });

    it('should display default error message when error has no message', async () => {
      await renderAndOpenPopover({
        isError: true,
        error: {},
      });

      expect(screen.getByText('Something went wrong. Please try again later.')).toBeInTheDocument();
    });
  });

  describe('No avatar selected state', () => {
    it('should display message when no avatar is selected', async () => {
      const { baseElement } = await renderAndOpenPopover({ data: mockNoAvatarSelected });
      const popover = await getPopover(baseElement);

      expect(popover?.textContent).toMatch('Your avatar is chosen, but your journey has just begun. Earn your first points to unlock Level 1 - see progress on the Performance page.');
      expect(screen.queryByAltText('Your accomplishment avatar')).not.toBeInTheDocument();
      expect(screen.queryByText(/\/\d+/)).not.toBeInTheDocument();
      expect(screen.queryByText('Your progress')).not.toBeInTheDocument();
    });

    it('should display "avatar not selected" message when API status is 404', async () => {
      const { baseElement } = await renderAndOpenPopover({
        data: {
          ...mockNoAvatarSelected,
          status: 404,
        },
      });
      const popover = await getPopover(baseElement);

      expect(popover?.textContent).toMatch(/haven.*t chosen an avatar yet/i);
      expect(screen.getByRole('link', { name: /Performance page/i })).toHaveAttribute('href', 'https://example.com/gamma_dashboard/dashboard/');
      expect(screen.queryByAltText('Your accomplishment avatar')).not.toBeInTheDocument();
      expect(screen.queryByText(/\/\d+/)).not.toBeInTheDocument();
      expect(screen.queryByText('Your progress')).not.toBeInTheDocument();
    });
  });

  describe('Fully developed avatar state', () => {
    it('should display fully developed message when points reach the cap', async () => {
      await renderAndOpenPopover({ data: mockFullyDevelopedAvatar });

      expect(screen.getByText(/Congratulations, your avatar is fully developed/)).toBeInTheDocument();
      const avatar = screen.getByAltText('Your accomplishment avatar');
      expect(avatar).toHaveAttribute('src', mockFullyDevelopedAvatar.current_avatar.image);
      expect(screen.getByText('210/200')).toBeInTheDocument();
      expect(screen.getByText('Your progress')).toBeInTheDocument();
      expect(screen.getByText(`Level ${mockFullyDevelopedAvatar.current_avatar.stage}`)).toBeInTheDocument();
    });
  });

  describe('Current level state', () => {
    it('should display current level message with progress and use required_points over max_required_points', async () => {
      await renderAndOpenPopover({ data: mockAvatarProgress });

      expect(screen.getByText(new RegExp(`Congratulations, your avatar is Level ${mockAvatarProgress.current_avatar.stage} now`))).toBeInTheDocument();
      expect(screen.getByAltText('Your accomplishment avatar')).toHaveAttribute('src', mockAvatarProgress.current_avatar.image);
      expect(screen.getByText('60/100')).toBeInTheDocument();
      expect(screen.getByText('Your progress')).toBeInTheDocument();
      expect(screen.getByText(`Level ${mockAvatarProgress.current_avatar.stage}`)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Performance page/i })).toHaveAttribute('href', 'https://example.com/gamma_dashboard/dashboard/');
    });
  });

  describe('Edge cases', () => {
    it('should handle zero points correctly', async () => {
      await renderAndOpenPopover({
        data: {
          ...mockAvatarProgress,
          current_points: 0,
        },
      });

      expect(screen.getByText('0/100')).toBeInTheDocument();
    });

    it('should use max_required_points when required_points is not available', async () => {
      await renderAndOpenPopover({
        data: {
          ...mockFullyDevelopedAvatar,
          required_points: null,
        },
      });

      expect(screen.getByText('210/200')).toBeInTheDocument();
    });
  });
});
